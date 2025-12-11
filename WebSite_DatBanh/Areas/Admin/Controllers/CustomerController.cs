using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CustomerController : Controller
    {
        private readonly AppDbContext _context;
        public CustomerController(AppDbContext context)
        {
            _context = context;
        }

        private bool CheckAdminRole()
        {
            var role = HttpContext.Session.GetString("ROLE");
            if (role == "Quản lý") return true;
            TempData["ErrorAdmin"] = "Bạn không có quyền thực hiện hành động này!";
            return false;
        }

        private bool CheckViewRole()
        {
            var role = HttpContext.Session.GetString("ROLE");
            if (role == "Quản lý" || role == "Nhân viên bán hàng") return true;
            TempData["ErrorAdmin"] = "Bạn không có quyền truy cập!";
            return false;
        }

        public async Task<IActionResult> Index(string sdt = "")
        {
            if (!CheckViewRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });

            List<KhachHang> model;

            if (!string.IsNullOrEmpty(sdt))
            {
                model = await _context.KHACHHANG
                    .FromSqlRaw("EXEC SP_TIM_KHACHHANG_SDT {0}", sdt)
                    .AsNoTracking()
                    .ToListAsync();
            }
            else
            {
                model = await _context.KHACHHANG.AsNoTracking().ToListAsync();
            }

            ViewBag.SearchSDT = sdt;
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateStats()
        {
            if (!CheckAdminRole()) return RedirectToAction(nameof(Index));

            try
            {
                await _context.Database.ExecuteSqlRawAsync("EXEC PROC_CAPNHAT_SOLANDATHANG");
                TempData["SuccessMessage"] = "Đã cập nhật số lần đặt hàng cho tất cả khách hàng!";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Lỗi khi cập nhật: " + ex.Message;
            }

            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Details(string id)
        {
            if (!CheckViewRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });
            if (string.IsNullOrEmpty(id)) return NotFound();

            var customer = await _context.KHACHHANG
                .Include(k => k.DONHANG)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.MAKH == id);
            
            if (customer == null) return NotFound();

            return View(customer);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(string id)
        {
            if (!CheckAdminRole()) return RedirectToAction(nameof(Index));

            var kh = await _context.KHACHHANG.FindAsync(id);
            if (kh == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy khách hàng.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                _context.KHACHHANG.Remove(kh);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "Đã xóa khách hàng thành công.";
            }
            catch (Exception ex)
            {
                var sqlMessage = ex.InnerException?.Message ?? ex.Message;

                if (sqlMessage.Contains("Không thể xóa khách hàng"))
                {
                    TempData["ErrorAdmin"] = "⛔ TRIGGER CHẶN: " + sqlMessage;
                }
                else if (sqlMessage.Contains("REFERENCE"))
                {
                    TempData["ErrorAdmin"] = "⛔ LỖI KHÓA NGOẠI: Khách hàng này đang có dữ liệu liên quan.";
                }
                else
                {
                    TempData["ErrorMessage"] = "Lỗi hệ thống: " + sqlMessage;
                }
            }

            return RedirectToAction(nameof(Index));
        }
    }
}