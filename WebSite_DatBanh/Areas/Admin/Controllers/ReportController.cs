using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ReportController : Controller
    {
        private readonly AppDbContext _context;
        public ReportController(AppDbContext context)
        {
            _context = context;
        }

        // Hàm kiểm tra quyền (Chỉ Quản lý mới được xem tiền nong)
        private bool CheckAdminRole()
        {
            var role = HttpContext.Session.GetString("ROLE");
            if (role == "Quản lý") return true;
            TempData["ErrorAdmin"] = "Bạn không có quyền truy cập báo cáo doanh thu!";
            return false;
        }

        // GET: /Admin/Report/Index
        public async Task<IActionResult> Index(DateTime? fromDate, DateTime? toDate)
        {
            if (!CheckAdminRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });

            // Mặc định lấy dữ liệu 30 ngày gần nhất nếu chưa chọn ngày
            if (!fromDate.HasValue) fromDate = DateTime.Now.AddDays(-30);
            if (!toDate.HasValue) toDate = DateTime.Now;

            // Gửi lại ngày đã chọn ra View để hiển thị trên ô input
            ViewBag.FromDate = fromDate.Value.ToString("yyyy-MM-dd");
            ViewBag.ToDate = toDate.Value.ToString("yyyy-MM-dd");

            // --- GỌI STORED PROCEDURE ---
            // SqlQueryRaw để map kết quả vào ViewModel
            // Cú pháp SQL: EXEC SP_BAOCAO_DOANHTHU '2023-01-01', '2023-01-31'
            string sql = "EXEC SP_BAOCAO_DOANHTHU {0}, {1}";

            var reportData = await _context.Database
                .SqlQueryRaw<ReportViewModel>(sql, fromDate, toDate)
                .ToListAsync();

            // Tính tổng cộng để hiển thị ở chân trang
            ViewBag.TotalRevenue = reportData.Sum(x => x.DoanhThu);
            ViewBag.TotalOrders = reportData.Sum(x => x.SoDonHang);

            return View(reportData);
        }
    }
}