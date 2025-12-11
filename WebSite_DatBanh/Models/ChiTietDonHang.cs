using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_DatBanh.Models
{
    [Table("CT_DONHANG")]
    public class ChiTietDonHang
    {
        [StringLength(10)]
        public string MADH { get; set; }

        [StringLength(10)]
        public string MASP { get; set; }

        public int SOLUONG { get; set; }
        public decimal GIASP { get; set; }

        // Navigation
        public DonHang? DONHANG { get; set; }
        public SanPham? SANPHAM { get; set; }
    }
}
