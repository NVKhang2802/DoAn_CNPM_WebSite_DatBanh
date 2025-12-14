using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_DatBanh.Models
{
    [Table("DANHGIA")]
    public class DanhGia
    {
        [Key]
        [StringLength(10)]
        public string MADG { get; set; }

        [StringLength(10)]
        public string MASP { get; set; }

        [StringLength(10)]
        public string MAKH { get; set; }

        [Range(1, 5)]
        public int SOSAO { get; set; }

        [StringLength(500)]
        public string? BINHLUAN { get; set; }

        public DateTime NGAYDG { get; set; }

        [StringLength(500)]
        public string? PHANHOI { get; set; }

        public DateTime? NGAYPHANHOI { get; set; }

        [ForeignKey("MASP")]
        public SanPham? SANPHAM { get; set; }

        [ForeignKey("MAKH")]
        public KhachHang? KHACHHANG { get; set; }
    }
}
