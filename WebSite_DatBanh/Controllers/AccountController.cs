using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Controllers
{
    public class AccountController : Controller
    {
        private readonly AppDbContext _context;
        public AccountController(AppDbContext context)
        {
            _context = context;
        }

        private async Task GhiNhatKy(string username, string ketqua)
        {
            try
            {
                string sql = "INSERT INTO NHATKYDANGNHAP (TENDN, THOIGIAN, KETQUA) VALUES ({0}, GETDATE(), {1})";
                await _context.Database.ExecuteSqlRawAsync(sql, username, ketqua);
            }
            catch
            {
            }
        }

        [HttpGet]
        public IActionResult Login() => View();

        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                ViewBag.Error = "Vui lòng nhập tên đăng nhập và mật khẩu";
                return View();
            }

            var tk = await _context.TAIKHOAN_KH
                .FirstOrDefaultAsync(t => t.TENDN == username);

            if (tk == null)
            {
                await GhiNhatKy(username, "Thất bại");
                ViewBag.Error = "Tài khoản không tồn tại.";
                return View();
            }

            if (tk.TRANGTHAI == "BỊ KHÓA")
            {
                await GhiNhatKy(username, "Bị khóa");
                ViewBag.Error = "Tài khoản đã bị khóa. Vui lòng liên hệ Admin.";
                return View();
            }

            if (tk.MATKHAU != password)
            {
                tk.SoLanSai = (tk.SoLanSai ?? 0) + 1;
                string logStatus = "Thất bại";

                if (tk.SoLanSai >= 5)
                {
                    tk.TRANGTHAI = "BỊ KHÓA";
                    logStatus = "Bị khóa";
                    ViewBag.Error = "Bạn đã nhập sai 5 lần. Tài khoản đã bị khóa!";
                }
                else
                {
                    int conLai = 5 - tk.SoLanSai.Value;
                    ViewBag.Error = $"Sai mật khẩu! Bạn còn {conLai} lần thử.";
                }

                _context.TAIKHOAN_KH.Update(tk);
                await _context.SaveChangesAsync();

                await GhiNhatKy(username, logStatus);

                return View();
            }

            tk.SoLanSai = 0;
            _context.TAIKHOAN_KH.Update(tk);
            await _context.SaveChangesAsync();

            HttpContext.Session.SetString("MAKH", tk.MAKH ?? "");
            HttpContext.Session.SetString("TENDN", tk.TENDN ?? "");

            await GhiNhatKy(username, "Thành công (Web)");

            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public IActionResult Register() => View();

        [HttpPost]
        public async Task<IActionResult> Register(string TENDN, string MATKHAU, string CONFIRM, string EMAIL)
        {
            if (MATKHAU != CONFIRM)
            {
                ViewBag.Error = "Mật khẩu xác nhận không khớp.";
                return View();
            }

            if (string.IsNullOrEmpty(TENDN) || string.IsNullOrEmpty(MATKHAU) || string.IsNullOrEmpty(EMAIL))
            {
                ViewBag.Error = "Vui lòng nhập đầy đủ thông tin.";
                return View();
            }

            var makh = "KH" + DateTime.Now.ToString("HHmmss");

            if (await _context.KHACHHANG.AnyAsync(k => k.TENDN == TENDN))
            {
                ViewBag.Error = "Tên đăng nhập đã tồn tại.";
                return View();
            }

            var kh = new KhachHang
            {
                MAKH = makh,
                HOTEN = TENDN,
                TENDN = TENDN,
                MATKHAU = MATKHAU,
                EMAIL = EMAIL
            };
            _context.KHACHHANG.Add(kh);
            await _context.SaveChangesAsync();

            var tk = new TaiKhoanKH
            {
                MATK = "TK" + Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper(),
                MAKH = makh,
                TENDN = TENDN,
                MATKHAU = MATKHAU,
                NGAYTAO = DateTime.Now,
                TRANGTHAI = "ĐANG HOẠT ĐỘNG",
                SoLanSai = 0
            };
            _context.TAIKHOAN_KH.Add(tk);
            await _context.SaveChangesAsync();

            return RedirectToAction("Login");
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Home");
        }
    }
}