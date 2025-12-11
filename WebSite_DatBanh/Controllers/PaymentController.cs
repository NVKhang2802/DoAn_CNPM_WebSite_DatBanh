using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Controllers
{
    public class PaymentController : Controller
    {
        private readonly AppDbContext _context;
        public PaymentController(AppDbContext context) => _context = context;

        public async Task<IActionResult> Index()
        {
            string maKh = HttpContext.Session.GetString("MAKH");
            if (string.IsNullOrEmpty(maKh))
                return RedirectToAction("Login", "Account");

            var gh = await _context.GIOHANG
                .Include(g => g.KHACHHANG)
                .Include(g => g.CT_GIOHANG)
                .ThenInclude(ct => ct.SANPHAM)
                .FirstOrDefaultAsync(g => g.MAKH == maKh);

            if (gh == null || gh.CT_GIOHANG == null || !gh.CT_GIOHANG.Any())
                return RedirectToAction("Index", "Cart");

            decimal tong = gh.CT_GIOHANG.Sum(ct => ct.SOLUONG * (ct.SANPHAM?.GIA ?? 0));

            ViewBag.TongTien = tong;
            ViewBag.MAGH = gh.MAGH;

            return View(gh);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreatePayment(string magh, string phuongThuc,
                                                       string MAKH, string HOTEN, string EMAIL, string SDT, string DIACHI)
        {
            var gh = await _context.GIOHANG
                .Include(g => g.CT_GIOHANG)
                .ThenInclude(ct => ct.SANPHAM)
                .FirstOrDefaultAsync(g => g.MAGH == magh);

            if (gh == null || gh.MAKH != MAKH) return BadRequest();

            string madh = "DH" + DateTime.Now.ToString("HHmmss");
            string matt = "TT" + DateTime.Now.ToString("HHmmss");
            decimal tong = gh.CT_GIOHANG.Sum(ct => ct.SOLUONG * (ct.SANPHAM?.GIA ?? 0));

            var customerToUpdate = await _context.KHACHHANG.FindAsync(MAKH);
            if (customerToUpdate != null)
            {
                customerToUpdate.HOTEN = HOTEN;
                customerToUpdate.EMAIL = EMAIL;
                customerToUpdate.SDT = SDT;
                customerToUpdate.DIACHI = DIACHI;
                _context.KHACHHANG.Update(customerToUpdate);
            }

            var dh = new DonHang
            {
                MADH = madh,
                MAKH = gh.MAKH,
                MANV = null,
                NGAYDAT = DateTime.Now,
                TONGTIEN = tong,
                TRANGTHAI = "ĐANG XỬ LÝ"
            };
            _context.DONHANG.Add(dh);

            foreach (var ct in gh.CT_GIOHANG)
            {
                _context.CT_DONHANG.Add(new ChiTietDonHang
                {
                    MADH = madh,
                    MASP = ct.MASP,
                    SOLUONG = ct.SOLUONG,
                    GIASP = ct.SANPHAM?.GIA ?? 0
                });
            }

            var tt = new ThanhToan
            {
                MATT = matt,
                MADH = madh,
                PHUONGTHUC = phuongThuc,
                NGAYTT = DateTime.Now,
                SOTIEN = tong,
                TRANGTHAI = "ĐÃ THANH TOÁN"
            };
            _context.THANHTOAN.Add(tt);

            _context.CT_GIOHANG.RemoveRange(gh.CT_GIOHANG);
            _context.GIOHANG.Remove(gh);

            await _context.SaveChangesAsync();

            TempData["PaymentSuccess"] = "Đặt hàng và thanh toán thành công!";

            return RedirectToAction(nameof(PaymentSuccess), new { id = madh });
        }

        public async Task<IActionResult> PaymentSuccess(string id)
        {
            if (string.IsNullOrEmpty(id)) return RedirectToAction("Index", "Home");

            var dh = await _context.DONHANG
                .Include(d => d.KHACHHANG)
                .Include(d => d.THANHTOAN)
                .FirstOrDefaultAsync(d => d.MADH == id);

            if (dh == null) return RedirectToAction("Index", "Home");

            return View(dh);
        }
    }
}