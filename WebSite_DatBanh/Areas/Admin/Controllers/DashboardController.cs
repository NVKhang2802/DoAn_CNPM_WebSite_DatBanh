using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using WebSite_DatBanh.Models; 
using System.Linq; 
using System.Threading.Tasks; 
using System; 

namespace WebSite_DatBanh.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class DashboardController : Controller
    {
        // --- THÊM MỚI: Khai báo DbContext ---
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context)
        {
            _context = context;
        }
        // --- KẾT THÚC THÊM MỚI ---

        // --- SỬA LẠI: Nâng cấp hàm Index ---
        public async Task<IActionResult> Index()
        {
            var role = HttpContext.Session.GetString("ROLE");

            if (role == "Quản lý")
            {
                var now = DateTime.Now;

                // --- 1. CÁC CHỈ SỐ DÙNG LINQ ---

                // Doanh thu tháng này
                ViewBag.MonthlyRevenue = await _context.DONHANG
                    .Where(d => d.TRANGTHAI == "HOÀN THÀNH" && d.NGAYDAT.HasValue && d.NGAYDAT.Value.Month == now.Month && d.NGAYDAT.Value.Year == now.Year)
                    .SumAsync(d => d.TONGTIEN) ?? 0;

                // Đơn hàng mới (Đang xử lý)
                ViewBag.NewOrders = await _context.DONHANG
                    .CountAsync(d => d.TRANGTHAI == "ĐANG XỬ LÝ");

                // Khách hàng mới (30 ngày)
                ViewBag.NewCustomers = await _context.TAIKHOAN_KH
                    .CountAsync(k => k.NGAYTAO.HasValue && k.NGAYTAO.Value > now.AddDays(-30));


                // --- 2. CÁC CHỈ SỐ DÙNG SQL FUNCTION ---

                // Tổng sản phẩm (Dùng Function: FN_DEM_SP_CONHANG)
                var sqlProduct = "SELECT dbo.FN_DEM_SP_CONHANG() as Value";
                ViewBag.TotalProducts = await _context.Database
                    .SqlQueryRaw<int>(sqlProduct)
                    .FirstOrDefaultAsync();

                // Nhân viên đang làm (Dùng Function: FN_DEM_NV_DANGLAM)
                var sqlStaff = "SELECT dbo.FN_DEM_NV_DANGLAM() as Value";
                ViewBag.ActiveStaff = await _context.Database
                    .SqlQueryRaw<int>(sqlStaff)
                    .FirstOrDefaultAsync();

                // Tài khoản hoạt động (Dùng Function: FUNC_DEM_TK_DANGHOATDONG)
                var sqlAcc = "SELECT dbo.FUNC_DEM_TK_DANGHOATDONG() as Value";
                ViewBag.ActiveAccounts = await _context.Database
                    .SqlQueryRaw<int>(sqlAcc)
                    .FirstOrDefaultAsync();


                // --- 3. DANH SÁCH ĐƠN HÀNG (Để hiển thị bảng) ---
                var recentOrders = await _context.DONHANG
                    .Include(d => d.KHACHHANG)
                    .OrderByDescending(d => d.NGAYDAT)
                    .Take(5)
                    .ToListAsync();

                return View(recentOrders);
            }

            // Chuyển hướng nếu không phải Admin
            if (role == "Nhân viên bán hàng" || role == "Nhân viên giao hàng")
            {
                return RedirectToAction("Index", "Order", new { area = "Admin" });
            }

            return RedirectToAction("Login", "Account", new { area = "Admin" });
        }
    }
}