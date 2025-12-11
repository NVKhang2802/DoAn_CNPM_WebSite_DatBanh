using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Controllers
{
    [AllowAnonymous]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AppDbContext _context;

        public HomeController(ILogger<HomeController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var model = await _context.SANPHAM
                                      .Where(s => s.TRANGTHAI == "CÒN HÀNG")
                                      .OrderBy(s => s.TENSP)
                                      .Take(12)
                                      .ToListAsync();

            return View(model);
        }

        public IActionResult About() => View();

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Contact() => View();

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
