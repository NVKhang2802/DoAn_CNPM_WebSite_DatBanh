using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_DatBanh.Models
{
    [Table("CT_GIOHANG")]
    public class ChiTietGioHang
    {
        [StringLength(10)]
        public string MAGH { get; set; }

        [StringLength(10)]
        public string MASP { get; set; }

        public int SOLUONG { get; set; }

        [StringLength(50)]
        public string? KICHCO { get; set; }

        // Navigation
        public GioHang? GIOHANG { get; set; }
        public SanPham? SANPHAM { get; set; }
    }
}
