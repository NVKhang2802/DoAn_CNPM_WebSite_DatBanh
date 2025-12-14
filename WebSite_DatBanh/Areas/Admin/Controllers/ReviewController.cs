using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ReviewController : Controller
    {
        private readonly AppDbContext _context;

        public ReviewController(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(string? searchProduct, int? filterStar)
        {
            var query = _context.DANHGIA
                .Include(d => d.SANPHAM)
                .Include(d => d.KHACHHANG)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchProduct))
            {
                query = query.Where(d => d.SANPHAM != null && 
                    (d.SANPHAM.TENSP.Contains(searchProduct) || d.MASP.Contains(searchProduct)));
            }

            if (filterStar.HasValue && filterStar >= 1 && filterStar <= 5)
            {
                query = query.Where(d => d.SOSAO == filterStar.Value);
            }

            var reviews = await query
                .OrderByDescending(d => d.NGAYDG)
                .ToListAsync();

            var stats = new
            {
                TotalReviews = await _context.DANHGIA.CountAsync(),
                AvgRating = await _context.DANHGIA.AnyAsync() 
                    ? Math.Round(await _context.DANHGIA.AverageAsync(d => d.SOSAO), 1) 
                    : 0,
                Star5 = await _context.DANHGIA.CountAsync(d => d.SOSAO == 5),
                Star4 = await _context.DANHGIA.CountAsync(d => d.SOSAO == 4),
                Star3 = await _context.DANHGIA.CountAsync(d => d.SOSAO == 3),
                Star2 = await _context.DANHGIA.CountAsync(d => d.SOSAO == 2),
                Star1 = await _context.DANHGIA.CountAsync(d => d.SOSAO == 1)
            };

            ViewBag.Stats = stats;
            ViewBag.SearchProduct = searchProduct;
            ViewBag.FilterStar = filterStar;

            return View(reviews);
        }

        public async Task<IActionResult> ByProduct(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return RedirectToAction(nameof(Index));
            }

            var sanPham = await _context.SANPHAM.FindAsync(id);
            if (sanPham == null)
            {
                return NotFound();
            }

            var reviews = await _context.DANHGIA
                .Include(d => d.KHACHHANG)
                .Where(d => d.MASP == id)
                .OrderByDescending(d => d.NGAYDG)
                .ToListAsync();

            var avgRating = reviews.Any() ? Math.Round(reviews.Average(r => r.SOSAO), 1) : 0;

            ViewBag.SanPham = sanPham;
            ViewBag.AvgRating = avgRating;
            ViewBag.TotalReviews = reviews.Count;

            var distribution = new Dictionary<int, int>
            {
                { 5, reviews.Count(r => r.SOSAO == 5) },
                { 4, reviews.Count(r => r.SOSAO == 4) },
                { 3, reviews.Count(r => r.SOSAO == 3) },
                { 2, reviews.Count(r => r.SOSAO == 2) },
                { 1, reviews.Count(r => r.SOSAO == 1) }
            };
            ViewBag.Distribution = distribution;

            return View(reviews);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(string id)
        {
            var danhGia = await _context.DANHGIA.FindAsync(id);
            if (danhGia != null)
            {
                _context.DANHGIA.Remove(danhGia);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        public async Task<IActionResult> Reply(string id, string phanhoi)
        {
            var danhGia = await _context.DANHGIA.FindAsync(id);
            if (danhGia == null)
            {
                return NotFound();
            }

            if (string.IsNullOrWhiteSpace(phanhoi))
            {
                TempData["ErrorAdmin"] = "Nội dung phản hồi không được để trống!";
                return RedirectToAction(nameof(Index));
            }

            danhGia.PHANHOI = phanhoi;
            danhGia.NGAYPHANHOI = DateTime.Now;
            
            _context.DANHGIA.Update(danhGia);
            await _context.SaveChangesAsync();

            TempData["SuccessAdmin"] = "Phản hồi đánh giá thành công!";
            return RedirectToAction(nameof(Index));
        }
    }
}
