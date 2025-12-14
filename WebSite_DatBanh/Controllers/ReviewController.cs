using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Controllers
{
    public class ReviewController : Controller
    {
        private readonly AppDbContext _context;

        public ReviewController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create(string masp, int sosao, string? binhluan)
        {
            var makh = HttpContext.Session.GetString("MAKH");
            if (string.IsNullOrEmpty(makh))
            {
                return Json(new { success = false, message = "Vui lòng đăng nhập để đánh giá!" });
            }

            if (string.IsNullOrEmpty(masp) || sosao < 1 || sosao > 5)
            {
                return Json(new { success = false, message = "Dữ liệu không hợp lệ!" });
            }

            var existingReview = await _context.DANHGIA
                .FirstOrDefaultAsync(d => d.MASP == masp && d.MAKH == makh);

            if (existingReview != null)
            {
                existingReview.SOSAO = sosao;
                existingReview.BINHLUAN = binhluan;
                existingReview.NGAYDG = DateTime.Now;
                _context.DANHGIA.Update(existingReview);
            }
            else
            {
                var newMadg = await GenerateNewMaDG();
                var danhGia = new DanhGia
                {
                    MADG = newMadg,
                    MASP = masp,
                    MAKH = makh,
                    SOSAO = sosao,
                    BINHLUAN = binhluan,
                    NGAYDG = DateTime.Now
                };
                await _context.DANHGIA.AddAsync(danhGia);
            }

            await _context.SaveChangesAsync();

            var khachHang = await _context.KHACHHANG.FindAsync(makh);
            var tenKH = khachHang?.HOTEN ?? "Khách hàng";

            return Json(new
            {
                success = true,
                message = existingReview != null ? "Cập nhật đánh giá thành công!" : "Đánh giá thành công!",
                review = new
                {
                    tenKH = tenKH,
                    sosao = sosao,
                    binhluan = binhluan ?? "",
                    ngaydg = DateTime.Now.ToString("dd/MM/yyyy HH:mm")
                }
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetByProduct(string masp)
        {
            if (string.IsNullOrEmpty(masp))
            {
                return Json(new { success = false, message = "Mã sản phẩm không hợp lệ!" });
            }

            var reviews = await _context.DANHGIA
                .Include(d => d.KHACHHANG)
                .Where(d => d.MASP == masp)
                .OrderByDescending(d => d.NGAYDG)
                .Select(d => new
                {
                    tenKH = d.KHACHHANG != null ? d.KHACHHANG.HOTEN : "Khách hàng",
                    sosao = d.SOSAO,
                    binhluan = d.BINHLUAN ?? "",
                    ngaydg = d.NGAYDG.ToString("dd/MM/yyyy HH:mm"),
                    phanhoi = d.PHANHOI ?? "",
                    ngayphanhoi = d.NGAYPHANHOI != null ? d.NGAYPHANHOI.Value.ToString("dd/MM/yyyy HH:mm") : ""
                })
                .ToListAsync();

            var avgRating = reviews.Any() ? Math.Round(reviews.Average(r => r.sosao), 1) : 0;

            return Json(new
            {
                success = true,
                reviews = reviews,
                avgRating = avgRating,
                totalReviews = reviews.Count
            });
        }

        private async Task<string> GenerateNewMaDG()
        {
            var lastDanhGia = await _context.DANHGIA
                .OrderByDescending(d => d.MADG)
                .FirstOrDefaultAsync();

            if (lastDanhGia == null)
            {
                return "DG01";
            }

            var lastNumber = int.Parse(lastDanhGia.MADG.Substring(2));
            return $"DG{(lastNumber + 1):D2}";
        }
    }
}
