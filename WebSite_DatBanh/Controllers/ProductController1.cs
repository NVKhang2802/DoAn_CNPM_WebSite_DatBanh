using Microsoft.AspNetCore.Mvc;
using WebSite_DatBanh.Models;
using Microsoft.EntityFrameworkCore;

namespace WebSite_DatBanh.Controllers
{
    public class ProductController1 : Controller
    {
        private readonly AppDbContext _context;
        public ProductController1(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(string priceRange)
        {
            var query = _context.SANPHAM.AsNoTracking().Where(s => s.TRANGTHAI == "CÒN HÀNG");

            if (!string.IsNullOrEmpty(priceRange))
            {
                switch (priceRange)
                {
                    case "under_200":
                        query = query.Where(s => s.GIA < 200000);
                        break;
                    case "200_300":
                        query = query.Where(s => s.GIA >= 200000 && s.GIA <= 300000);
                        break;
                    case "over_300":
                        query = query.Where(s => s.GIA > 300000);
                        break;
                }
            }

            ViewBag.CurrentFilter = priceRange;

            var list = await query.ToListAsync();
            return View(list);
        }

        public IActionResult Detail(string id)
        {
            if (string.IsNullOrEmpty(id)) return BadRequest();

            var sp = _context.SANPHAM
                .AsNoTracking()
                .FirstOrDefault(s => s.MASP == id);

            if (sp == null) return NotFound();
            return View(sp);
        }

        [HttpGet]
        public async Task<IActionResult> Search(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return RedirectToAction(nameof(Index));
            }

            var result = await _context.SANPHAM
                .Where(sp => sp.TENSP.Contains(query))
                .AsNoTracking()
                .ToListAsync();

            ViewBag.Query = query;
            return View(result);
        }
    }
}
