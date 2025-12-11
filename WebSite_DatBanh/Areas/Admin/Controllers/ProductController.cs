using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_DatBanh.Models;

namespace WebSite_DatBanh.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ProductController : Controller
    {
        private readonly AppDbContext _context;
        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        private bool CheckAdminRole()
        {
            var role = HttpContext.Session.GetString("ROLE");
            if (role == "Quản lý") return true; 
            TempData["ErrorAdmin"] = "Bạn không có quyền truy cập!";
            return false;
        }

        private bool CheckAccess()
        {
            var role = HttpContext.Session.GetString("ROLE");
            if (role == "Quản lý" || role == "Nhân viên bán hàng" || role == "Nhân viên giao hàng") return true;
            TempData["ErrorAdmin"] = "Bạn không có quyền truy cập!";
            return false;
        }

        public async Task<IActionResult> Index()
        {
            if (!CheckAccess()) return RedirectToAction("Login", "Account", new { area = "Admin" });

            var model = await _context.SANPHAM.AsNoTracking().ToListAsync();
            return View(model);
        }

        public IActionResult Add()
        {
            if (!CheckAdminRole()) return RedirectToAction(nameof(Index)); 
            return View(); 
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Add(SanPham sanPham, IFormFile? ImageFile, string? ImageUrl, string? ExistingImage)
        {
            if (!CheckAdminRole()) return RedirectToAction(nameof(Index));

            sanPham.MASP = "SP" + DateTime.Now.ToString("HHmmss");
            if(string.IsNullOrEmpty(sanPham.TRANGTHAI))
            {
                sanPham.TRANGTHAI = "CÒN HÀNG";
            }
            
            ModelState.Remove("MASP");
            ModelState.Remove("ANHSP");

            if (ModelState.IsValid)
            {
                try
                {
                    if (ImageFile != null && ImageFile.Length > 0)
                    {
                        var fileName = $"sp_{DateTime.Now:yyyyMMddHHmmss}_{Path.GetFileName(ImageFile.FileName)}";
                        var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img", "Cake", fileName);
                        
                        using (var stream = new FileStream(uploadPath, FileMode.Create))
                        {
                            await ImageFile.CopyToAsync(stream);
                        }
                        
                        sanPham.ANHSP = $"~/img/Cake/{fileName}";
                    }
                    else if (!string.IsNullOrEmpty(ImageUrl) && (ImageUrl.StartsWith("http://") || ImageUrl.StartsWith("https://")))
                    {
                        sanPham.ANHSP = ImageUrl;
                    }
                    else if (!string.IsNullOrEmpty(ExistingImage))
                    {
                        sanPham.ANHSP = $"~/img/Cake/{ExistingImage}";
                    }
                    else if (!string.IsNullOrEmpty(sanPham.ANHSP))
                    {
                        if (!sanPham.ANHSP.StartsWith("~/") && !sanPham.ANHSP.StartsWith("http"))
                        {
                            sanPham.ANHSP = $"~/img/Cake/{sanPham.ANHSP}";
                        }
                    }
                    else
                    {
                        sanPham.ANHSP = "~/img/Cake/default.png";
                    }

                    _context.SANPHAM.Add(sanPham);
                    await _context.SaveChangesAsync();
                    TempData["Success"] = "Thêm sản phẩm thành công!";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, "Lỗi khi lưu: " + ex.Message);
                }
            }
            
            return View(sanPham);
        }

        public async Task<IActionResult> Edit(string id)
        {
            if (!CheckAdminRole()) return RedirectToAction(nameof(Index)); 
            if (string.IsNullOrEmpty(id)) return NotFound();

            var sanPham = await _context.SANPHAM.FindAsync(id);
            if (sanPham == null) return NotFound();
            
            return View(sanPham); 
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, SanPham sanPham, IFormFile? ImageFile, string? ImageUrl, string? ExistingImage, bool KeepCurrentImage = false)
        {
            if (!CheckAdminRole()) return RedirectToAction(nameof(Index));
            if (id != sanPham.MASP) return NotFound();

            var existingProduct = await _context.SANPHAM.AsNoTracking().FirstOrDefaultAsync(p => p.MASP == id);
            var currentImage = existingProduct?.ANHSP ?? "~/img/Cake/default.png";

            ModelState.Remove("ANHSP");

            if (ModelState.IsValid)
            {
                try
                {
                    if (ImageFile != null && ImageFile.Length > 0)
                    {
                        var fileName = $"sp_{DateTime.Now:yyyyMMddHHmmss}_{Path.GetFileName(ImageFile.FileName)}";
                        var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img", "Cake", fileName);
                        
                        using (var stream = new FileStream(uploadPath, FileMode.Create))
                        {
                            await ImageFile.CopyToAsync(stream);
                        }
                        
                        sanPham.ANHSP = $"~/img/Cake/{fileName}";
                    }
                    else if (!string.IsNullOrEmpty(ImageUrl) && (ImageUrl.StartsWith("http://") || ImageUrl.StartsWith("https://")))
                    {
                        sanPham.ANHSP = ImageUrl;
                    }
                    else if (!string.IsNullOrEmpty(ExistingImage))
                    {
                        sanPham.ANHSP = $"~/img/Cake/{ExistingImage}";
                    }
                    else if (KeepCurrentImage || string.IsNullOrEmpty(sanPham.ANHSP))
                    {
                        sanPham.ANHSP = currentImage;
                    }
                    else if (!sanPham.ANHSP.StartsWith("~/") && !sanPham.ANHSP.StartsWith("http"))
                    {
                        sanPham.ANHSP = $"~/img/Cake/{sanPham.ANHSP}";
                    }

                    _context.SANPHAM.Update(sanPham);
                    await _context.SaveChangesAsync();
                    TempData["Success"] = "Cập nhật sản phẩm thành công!";
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.SANPHAM.Any(e => e.MASP == id))
                        return NotFound();
                    else
                        throw;
                }
            }
            return View(sanPham);
        }

        public async Task<IActionResult> Delete(string id)
        {
            if (!CheckAdminRole()) return RedirectToAction(nameof(Index));
            if (string.IsNullOrEmpty(id)) return NotFound();

            var sanPham = await _context.SANPHAM
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.MASP == id);
            
            if (sanPham == null) return NotFound();

            return View(sanPham); 
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            if (!CheckAdminRole()) return RedirectToAction(nameof(Index));

            var sanPham = await _context.SANPHAM.FindAsync(id);
            if (sanPham != null)
            {
                _context.SANPHAM.Remove(sanPham);
                await _context.SaveChangesAsync();
            }
            
            return RedirectToAction(nameof(Index));
        }
    }
}