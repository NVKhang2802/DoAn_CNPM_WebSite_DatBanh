using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Controllers
{
    public class CartController : Controller
    {
        private readonly AppDbContext _context;
        public CartController(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            string maKh = HttpContext.Session.GetString("MAKH");
            if (string.IsNullOrEmpty(maKh))
            {
                return RedirectToAction("Login", "Account");
            }

            var giohang = await _context.GIOHANG
                .Include(g => g.CT_GIOHANG)
                    .ThenInclude(ct => ct.SANPHAM)
                .FirstOrDefaultAsync(g => g.MAKH == maKh);

            if (giohang == null)
            {
                return View(new List<ChiTietGioHang>());
            }

            var items = giohang.CT_GIOHANG ?? new List<ChiTietGioHang>();
            return View(items);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart(string maKh, string masp, int qty = 1, string kichco = "Vừa")
        {
            if (string.IsNullOrEmpty(maKh) || string.IsNullOrEmpty(masp) || qty <= 0)
                return BadRequest();

            var gh = await _context.GIOHANG.FirstOrDefaultAsync(g => g.MAKH == maKh);
            if (gh == null)
            {
                gh = new GioHang
                {
                    MAGH = "GH" + DateTime.Now.ToString("HHmmss"),
                    MAKH = maKh,
                    NGAYTHEM = DateTime.Now
                };
                _context.GIOHANG.Add(gh);
                await _context.SaveChangesAsync();
            }

            var ct = await _context.CT_GIOHANG
                .FirstOrDefaultAsync(c => c.MAGH == gh.MAGH && c.MASP == masp && c.KICHCO == kichco);

            if (ct == null)
            {
                ct = new ChiTietGioHang
                {
                    MAGH = gh.MAGH,
                    MASP = masp,
                    SOLUONG = qty,
                    KICHCO = kichco
                };
                _context.CT_GIOHANG.Add(ct);
            }
            else
            {
                ct.SOLUONG += qty;
                _context.CT_GIOHANG.Update(ct);
            }
            await _context.SaveChangesAsync();

            return RedirectToAction("Index", "Cart");
        }

        [HttpPost]
        public async Task<IActionResult> BuyNow(string maKh, string masp, int qty = 1)
        {
            if (string.IsNullOrEmpty(maKh) || string.IsNullOrEmpty(masp))
                return RedirectToAction("Login", "Account");

            var gh = await _context.GIOHANG.FirstOrDefaultAsync(g => g.MAKH == maKh);
            if (gh == null)
            {
                gh = new GioHang { MAGH = "GH" + DateTime.Now.ToString("HHmmss"), MAKH = maKh, NGAYTHEM = DateTime.Now };
                _context.GIOHANG.Add(gh);
                await _context.SaveChangesAsync();
            }

            string defaultSize = "Vừa";
            var ct = await _context.CT_GIOHANG.FirstOrDefaultAsync(c => c.MAGH == gh.MAGH && c.MASP == masp && c.KICHCO == defaultSize);

            if (ct == null)
            {
                ct = new ChiTietGioHang { MAGH = gh.MAGH, MASP = masp, SOLUONG = qty, KICHCO = defaultSize };
                _context.CT_GIOHANG.Add(ct);
            }
            else
            {
                ct.SOLUONG += qty;
                _context.CT_GIOHANG.Update(ct);
            }
            await _context.SaveChangesAsync();

            return RedirectToAction("Index", "Payment");
        }

        [HttpPost]
        public async Task<IActionResult> Remove(string magh, string masp, string kichco)
        {
            var ct = await _context.CT_GIOHANG.FirstOrDefaultAsync(c => c.MAGH == magh && c.MASP == masp && c.KICHCO == kichco);

            if (ct != null)
            {
                _context.CT_GIOHANG.Remove(ct);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        public async Task<IActionResult> UpdateQuantity(string magh, string masp, string kichco, int qty)
        {
            var ct = await _context.CT_GIOHANG.FirstOrDefaultAsync(c => c.MAGH == magh && c.MASP == masp && c.KICHCO == kichco);

            if (ct == null) return NotFound();
            if (qty <= 0)
            {
                _context.CT_GIOHANG.Remove(ct);
            }
            else
            {
                ct.SOLUONG = qty;
                _context.CT_GIOHANG.Update(ct);
            }
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
