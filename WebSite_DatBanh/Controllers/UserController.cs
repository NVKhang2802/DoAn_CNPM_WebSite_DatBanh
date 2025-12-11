using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Controllers
{
    public class UserController : Controller
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext context) => _context = context;

        public async Task<IActionResult> Index()
        {
            string maKh = HttpContext.Session.GetString("MAKH");
            if (string.IsNullOrEmpty(maKh))
            {
                return RedirectToAction("Login", "Account");
            }

            var kh = await _context.KHACHHANG.FindAsync(maKh);
            if (kh == null) return NotFound();

            if (TempData["SuccessMessage"] != null)
            {
                ViewBag.SuccessMessage = TempData["SuccessMessage"].ToString();
            }
            if (TempData["ErrorMessage"] != null)
            {
                ViewBag.ErrorMessage = TempData["ErrorMessage"].ToString();
            }

            return View(kh);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(KhachHang model)
        {
            string sessionMaKh = HttpContext.Session.GetString("MAKH");

            if (string.IsNullOrEmpty(sessionMaKh) || model.MAKH != sessionMaKh)
            {
                return RedirectToAction("Login", "Account");
            }

            var userToUpdate = await _context.KHACHHANG.FindAsync(sessionMaKh);
            if (userToUpdate == null) return NotFound();

            userToUpdate.HOTEN = model.HOTEN;
            userToUpdate.EMAIL = model.EMAIL;
            userToUpdate.DIACHI = model.DIACHI;
            userToUpdate.SDT = model.SDT;

            ModelState.Remove("TENDN");
            ModelState.Remove("MATKHAU");
            ModelState.Remove("DONHANG");

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(userToUpdate);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "Cập nhật thông tin thành công!";
                }
                catch (Exception ex)
                {
                    TempData["ErrorMessage"] = "Lỗi khi cập nhật: " + ex.Message;
                }
                return RedirectToAction(nameof(Index));
            }

            ViewBag.ErrorMessage = "Thông tin không hợp lệ, vui lòng kiểm tra lại.";
            return View(userToUpdate);
        }

        public async Task<IActionResult> History()
        {
            string maKh = HttpContext.Session.GetString("MAKH");
            if (string.IsNullOrEmpty(maKh)) return RedirectToAction("Login", "Account");

            var orders = await _context.DONHANG
                .Where(d => d.MAKH == maKh)
                .OrderByDescending(d => d.NGAYDAT)
                .AsNoTracking()
                .ToListAsync();

            ViewBag.SuccessMessage = TempData["SuccessMessage"];
            ViewBag.ErrorMessage = TempData["ErrorMessage"];

            return View(orders);
        }

        public async Task<IActionResult> HistoryDetail(string id)
        {
            string maKh = HttpContext.Session.GetString("MAKH");
            if (string.IsNullOrEmpty(maKh)) return RedirectToAction("Login", "Account");
            if (string.IsNullOrEmpty(id)) return NotFound();

            var order = await _context.DONHANG
                .Include(d => d.CT_DONHANG)
                    .ThenInclude(ct => ct.SANPHAM)
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.MADH == id && d.MAKH == maKh);

            if (order == null) return NotFound();

            return View(order);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CancelOrder(string id)
        {
            string maKh = HttpContext.Session.GetString("MAKH");
            if (string.IsNullOrEmpty(maKh)) return RedirectToAction("Login", "Account");

            var order = await _context.DONHANG.FirstOrDefaultAsync(d => d.MADH == id && d.MAKH == maKh);

            if (order != null && order.TRANGTHAI == "ĐANG XỬ LÝ")
            {
                order.TRANGTHAI = "ĐÃ HỦY";
                _context.Update(order);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "Đã hủy đơn hàng thành công.";
            }
            else
            {
                TempData["ErrorMessage"] = "Không thể hủy đơn hàng này.";
            }
            return RedirectToAction(nameof(History));
        }
    }
}