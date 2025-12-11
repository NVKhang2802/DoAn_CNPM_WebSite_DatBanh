using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class DatabaseController : Controller
    {
        private readonly AppDbContext _context;
        public DatabaseController(AppDbContext context)
        {
            _context = context;
        }

        // --- HÀM KIỂM TRA QUYền ADMIN ---
        private bool CheckAdminRole()
        {
            var role = HttpContext.Session.GetString("ROLE");
            if (role == "Quản lý") return true;
            TempData["ErrorAdmin"] = "Bạn không có quyền truy cập!";
            return false;
        }

        // --- Trang chính để hiển thị nút ---
        // GET: /Admin/Database/Index
        public IActionResult Index()
        {
            if (!CheckAdminRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });

            // Lấy đường dẫn từ file SQL
            ViewBag.BackupPath = @"E:\HQT_CSDL\DB_QLBANH\QL_BANH_FULL.bak";
            return View();
        }

        // --- XỬ LÝ BACKUP ---
        // --- 1. BACKUP FULL (T1) ---
        [HttpPost]
        public async Task<IActionResult> BackupFull()
        {
            string path = @"E:\HQT_CSDL\DB_QLBANH\QL_BANH_FULL.bak";
            // Lệnh SQL: Backup Full với INIT (Tạo mới)
            string sql = $"BACKUP DATABASE [QL_BANH] TO DISK = '{path}' WITH INIT, NAME='Full Backup'";

            await ExecuteSql(sql, "Full Backup thành công!");
            return RedirectToAction(nameof(Index));
        }

        // --- 2. BACKUP DIFFERENTIAL (T2) ---
        [HttpPost]
        public async Task<IActionResult> BackupDiff()
        {
            string path = @"E:\HQT_CSDL\DB_QLBANH\QL_BANH_DIFF.bak";
            // Lệnh SQL: Backup Diff (Chỉ lưu sự thay đổi)
            string sql = $"BACKUP DATABASE [QL_BANH] TO DISK = '{path}' WITH INIT, DIFFERENTIAL, NAME='Diff Backup'";

            await ExecuteSql(sql, "Differential Backup thành công!");
            return RedirectToAction(nameof(Index));
        }

        // --- 3. BACKUP LOG (T3) ---
        [HttpPost]
        public async Task<IActionResult> BackupLog()
        {
            string path = @"E:\HQT_CSDL\DB_QLBANH\QL_BANH_LOG.trn";
            // Lệnh SQL: Backup Log (Lưu nhật ký)
            string sql = $"BACKUP LOG [QL_BANH] TO DISK = '{path}' WITH INIT, NAME='Log Backup'";

            await ExecuteSql(sql, "Transaction Log Backup thành công!");
            return RedirectToAction(nameof(Index));
        }

        // --- HÀM HỖ TRỢ CHẠY SQL ---
        private async Task ExecuteSql(string sql, string successMsg)
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync(sql);
                TempData["SuccessMessage"] = successMsg;
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Lỗi: " + ex.Message;
            }
        }

        // --- 4. RESTORE TOÀN BỘ (Full -> Diff -> Log) ---
        [HttpPost]
        public async Task<IActionResult> CreateRestore()
        {
            if (!CheckAdminRole()) return RedirectToAction("Login", "Account", new { area = "Admin" });

            string dbName = "QL_BANH_Restored"; // Restore ra database mới
            string pathFull = @"E:\HQT_CSDL\DB_QLBANH\QL_BANH_FULL.bak";
            string pathDiff = @"E:\HQT_CSDL\DB_QLBANH\QL_BANH_DIFF.bak";
            string pathLog = @"E:\HQT_CSDL\DB_QLBANH\QL_BANH_LOG.trn";

            // Đường dẫn File
            string dataPath = @"E:\HQT_CSDL\DB_QLBANH\";

            // Lệnh Restore
            string sql = $@"
            -- 1. Restore Full (NORECOVERY)
            RESTORE DATABASE [{dbName}] FROM DISK = '{pathFull}' 
            WITH REPLACE, NORECOVERY,
            MOVE 'QL_BANH' TO '{dataPath}{dbName}.mdf',
            MOVE 'QL_BANH_log' TO '{dataPath}{dbName}_log.ldf';

            -- 2. Restore Diff (NORECOVERY)
            RESTORE DATABASE [{dbName}] FROM DISK = '{pathDiff}' WITH NORECOVERY;

            -- 3. Restore Log (RECOVERY - Hoàn tất)
            RESTORE LOG [{dbName}] FROM DISK = '{pathLog}' WITH RECOVERY;
        ";

            await ExecuteSql(sql, $"Restore thành công quy trình (Full->Diff->Log)! Database '{dbName}' đã sẵn sàng.");
            return RedirectToAction(nameof(Index));
        }
    }
}