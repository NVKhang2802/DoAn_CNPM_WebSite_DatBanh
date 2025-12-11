using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class OrderController : Controller
    {
        private readonly AppDbContext _context;
        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        private bool CheckEditRole()
        {
            var role = HttpContext.Session.GetString("ROLE");
            if (role == "Quản lý" || role == "Nhân viên bán hàng") return true;
            TempData["ErrorAdmin"] = "Bạn không có quyền thực hiện hành động này!";
            return false;
        }

        private bool CheckAccess()
        {
            var role = HttpContext.Session.GetString("ROLE");
            if (role == "Quản lý" || role == "Nhân viên bán hàng" || role == "Nhân viên giao hàng") return true;
            TempData["ErrorAdmin"] = "Bạn không có quyền truy cập!";
            return false;
        }

        public async Task<IActionResult> Index(string statusFilter)
        {
            if (!CheckAccess()) return RedirectToAction("Login", "Account", new { area = "Admin" });

            var query = _context.DONHANG
                            .Include(d => d.KHACHHANG)
                            .AsNoTracking();

            if (!string.IsNullOrEmpty(statusFilter))
            {
                query = query.Where(d => d.TRANGTHAI == statusFilter);
            }

            ViewBag.StatusList = new List<string> { "ĐANG XỬ LÝ", "ĐANG GIAO HÀNG", "HOÀN THÀNH", "ĐÃ HỦY" };
            ViewBag.CurrentFilter = statusFilter;

            var model = await query
                            .OrderByDescending(d => d.NGAYDAT)
                            .ToListAsync();
            return View(model);
        }

        public async Task<IActionResult> Details(string id)
        {
            if (!CheckAccess()) return RedirectToAction("Login", "Account", new { area = "Admin" });
            if (string.IsNullOrEmpty(id)) return NotFound();

            var donHang = await _context.DONHANG
                .Include(d => d.KHACHHANG)
                .Include(d => d.CT_DONHANG)
                    .ThenInclude(ct => ct.SANPHAM)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.MADH == id);

            if (donHang == null) return NotFound();

            ViewBag.CanEdit = CheckEditRole();
            return View(donHang);
        }

        public IActionResult Add()
        {
            if (!CheckEditRole()) return RedirectToAction(nameof(Index));
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Add(DonHang donHang)
        {
            if (!CheckEditRole()) return RedirectToAction(nameof(Index));

            donHang.MADH = "DH" + DateTime.Now.ToString("HHmmss");
            donHang.NGAYDAT = DateTime.Now;

            ModelState.Remove("MADH");

            if (ModelState.IsValid)
            {
                _context.DONHANG.Add(donHang);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            return View(donHang);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateStatus(string madh, string trangthai)
        {
            if (!CheckEditRole()) return RedirectToAction(nameof(Details), new { id = madh });

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC SP_CAPNHAT_TRANGTHAI_DONHANG {0}, {1}", madh, trangthai);

                TempData["SuccessMessage"] = "Cập nhật trạng thái thành công!";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Lỗi: " + ex.Message;
            }

            return RedirectToAction(nameof(Details), new { id = madh });
        }

        public async Task<IActionResult> Delete(string id)
        {
            if (!CheckEditRole()) return RedirectToAction(nameof(Index));
            if (string.IsNullOrEmpty(id)) return NotFound();

            var donHang = await _context.DONHANG
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.MADH == id);

            if (donHang == null) return NotFound();

            return View(donHang);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            if (!CheckEditRole()) return RedirectToAction(nameof(Index));

            var donHang = await _context.DONHANG.FindAsync(id);
            if (donHang != null)
            {
                var chiTiet = _context.CT_DONHANG.Where(ct => ct.MADH == id);
                _context.CT_DONHANG.RemoveRange(chiTiet);

                _context.DONHANG.Remove(donHang);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Index));
        }
    }
}