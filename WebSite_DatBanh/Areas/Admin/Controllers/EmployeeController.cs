using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Thêm
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class EmployeeController : Controller
    {
        private readonly AppDbContext _context;
        public EmployeeController(AppDbContext context)
        {
            _context = context;
        }

        // HÀM KIỂM TRA ROLE (THÊM VÀO)
        private bool CheckAdminRole()
        {
            var role = HttpContext.Session.GetString("ROLE");
            if (role == "Quản lý") // <-- Sửa thành "Quản lý"
            {
                return true;
            }
            TempData["ErrorAdmin"] = "Bạn không có quyền truy cập!";
            return false;
        }

        // --- 1. DANH SÁCH (READ) ---
        // GET: /Admin/Employee/Index
        public async Task<IActionResult> Index()
        {
            if (!CheckAdminRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });

            var model = await _context.NHANVIEN.AsNoTracking().ToListAsync();
            return View(model);
        }

        // --- 2. THÊM MỚI (CREATE) ---
        // GET: /Admin/Employee/Add
        public IActionResult Add()
        {
            if (!CheckAdminRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });

            // Trả về view "Add.cshtml" đã tồn tại
            return View();
        }

        // POST: /Admin/Employee/Add
        [HttpPost]
        [ValidateAntiForgeryToken] // Thêm bảo mật
        public async Task<IActionResult> Add(NhanVien nhanVien)
        {
            if (!CheckAdminRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });

            // Gán các giá trị mặc định
            nhanVien.MANV = "NV" + DateTime.Now.ToString("HHmmss"); // Mã NV tự sinh
            nhanVien.NGAYVAOLAM = DateTime.Now;
            nhanVien.TRANGTHAI = "Đang làm";

            // Xóa ModelState của các trường tự sinh để valid
            ModelState.Remove("MANV");
            ModelState.Remove("NGAYVAOLAM");
            ModelState.Remove("TRANGTHAI");
            ModelState.Remove("ANHDD");
            ModelState.Remove("TUOI");

            if (ModelState.IsValid)
            {
                try
                {
                    _context.NHANVIEN.Add(nhanVien);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, "Lỗi khi lưu: " + ex.Message);
                }
            }
            // Nếu model không hợp lệ, quay lại form Add
            return View(nhanVien);
        }

        // --- 3. SỬA (UPDATE) ---
        // GET: /Admin/Employee/Edit/NV01
        public async Task<IActionResult> Edit(string id)
        {
            if (!CheckAdminRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });
            if (string.IsNullOrEmpty(id)) return NotFound();

            var nhanVien = await _context.NHANVIEN.FindAsync(id);
            if (nhanVien == null) return NotFound();

            // Trả về view "Edit.cshtml" (chúng ta sẽ tạo ở bước 2)
            return View(nhanVien);
        }

        // POST: /Admin/Employee/Edit/NV01
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, NhanVien nhanVien)
        {
            if (!CheckAdminRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });
            if (id != nhanVien.MANV) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.NHANVIEN.Update(nhanVien);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.NHANVIEN.Any(e => e.MANV == id))
                        return NotFound();
                    else
                        throw;
                }
            }
            // Nếu không hợp lệ, quay lại form Edit
            return View(nhanVien);
        }

        // --- 4. XÓA (DELETE) ---
        // GET: /Admin/Employee/Delete/NV01
        public async Task<IActionResult> Delete(string id)
        {
            if (!CheckAdminRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });
            if (string.IsNullOrEmpty(id)) return NotFound();

            var nhanVien = await _context.NHANVIEN
                .AsNoTracking() // Không cần theo dõi để xóa
                .FirstOrDefaultAsync(m => m.MANV == id);

            if (nhanVien == null) return NotFound();

            // Trả về view "Delete.cshtml" (chúng ta sẽ tạo ở bước 3)
            return View(nhanVien);
        }

        // POST: /Admin/Employee/Delete/NV01
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            if (!CheckAdminRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });

            var nhanVien = await _context.NHANVIEN.FindAsync(id);
            if (nhanVien != null)
            {
                _context.NHANVIEN.Remove(nhanVien);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Index));
        }
    }
}