using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_DatBanh.Models
{
    [Table("TAIKHOAN_KH")]
    public class TaiKhoanKH
    {
        [Key]
        [StringLength(10)]
        public string MATK { get; set; }

        [Required, StringLength(10)]
        public string MAKH { get; set; }

        [Required, StringLength(50)]
        public string TENDN { get; set; }

        [Required, StringLength(255)]
        public string MATKHAU { get; set; }

        public DateTime? NGAYTAO { get; set; }

        [StringLength(50)]
        public string TRANGTHAI { get; set; }

        public int? SoLanSai { get; set; }

        // ✅ Thêm ForeignKey
        [ForeignKey("MAKH")]
        public KhachHang? KHACHHANG { get; set; }
    }

}
