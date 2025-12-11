using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Areas.Admin.Controllers
{
    [Area("Admin")]
    [AllowAnonymous]
    public class AccountController : Controller
    {
        private readonly AppDbContext _context;
        public AccountController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                ViewBag.Error = "Vui lòng nhập đầy đủ thông tin.";
                return View();
            }

            var nhanVien = await _context.NHANVIEN
                .FirstOrDefaultAsync(nv => nv.TENDN == username && nv.MATKHAU == password);

            if (nhanVien == null)
            {
                ViewBag.Error = "Sai tên đăng nhập hoặc mật khẩu.";
                return View();
            }

            HttpContext.Session.SetString("HOTEN_ADMIN", nhanVien.HOTEN ?? "");
            HttpContext.Session.SetString("MANV", nhanVien.MANV);
            HttpContext.Session.SetString("ROLE", nhanVien.CHUCVU);

            try
            {
                string sqlLog = "INSERT INTO NHATKYDANGNHAP (TENDN, THOIGIAN, KETQUA) VALUES ({0}, GETDATE(), {1})";
                await _context.Database.ExecuteSqlRawAsync(sqlLog, username, "Thành công (Web)");
            }
            catch
            {
            }

            return RedirectToAction("Index", "Dashboard", new { area = "Admin" });
        }

        [HttpGet]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("HOTEN_ADMIN");
            HttpContext.Session.Remove("MANV");
            HttpContext.Session.Remove("ROLE");

            return RedirectToAction("Login", "Account", new { area = "Admin" });
        }
    }
}