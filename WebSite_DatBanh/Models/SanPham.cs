using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_DatBanh.Models
{
    [Table("SANPHAM")]
    public class SanPham
    {
        [Key]
        [StringLength(10)]
        public string MASP { get; set; }

        [Required]
        [StringLength(100)]
        public string TENSP { get; set; }

        public decimal GIA { get; set; }

        [StringLength(500)]
        public string MOTA { get; set; }

        [StringLength(255)]
        public string ANHSP { get; set; }

        [StringLength(50)]
        public string KICHCO { get; set; }

        [StringLength(50)]
        public string MAUSAC { get; set; }

        [StringLength(50)]
        public string TRANGTHAI { get; set; }

        public ICollection<ChiTietDonHang>? CT_DONHANG { get; set; }
        public ICollection<ChiTietGioHang>? CT_GIOHANG { get; set; }
        public ICollection<DanhGia>? DANHGIA { get; set; }
    }
}
