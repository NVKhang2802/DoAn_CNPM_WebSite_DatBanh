using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace WebSite_DatBanh.Models
{
    [Table("DONHANG")]
    public class DonHang
    {
        [Key]
        [StringLength(10)]
        public string MADH { get; set; }

        [StringLength(10)]
        public string? MAKH { get; set; }

        [StringLength(10)]
        public string? MANV { get; set; }

        public DateTime? NGAYDAT { get; set; }
        public decimal? TONGTIEN { get; set; }
        public string? TRANGTHAI { get; set; }

        // ✅ Thêm ForeignKey ở đây
        [ForeignKey("MAKH")]
        public KhachHang? KHACHHANG { get; set; }

        [ForeignKey("MANV")]
        public NhanVien? NHANVIEN { get; set; }

        public ICollection<ChiTietDonHang>? CT_DONHANG { get; set; }
        public ICollection<ThanhToan>? THANHTOAN { get; set; }
    }

}
