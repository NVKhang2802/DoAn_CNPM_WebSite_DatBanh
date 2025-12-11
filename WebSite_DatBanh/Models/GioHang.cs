using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_DatBanh.Models
{
    [Table("GIOHANG")]
    public class GioHang
    {
        [Key]
        [StringLength(10)]
        public string MAGH { get; set; }

        [StringLength(10)]
        public string MAKH { get; set; }

        public DateTime? NGAYTHEM { get; set; }

        // ✅ Thêm ForeignKey
        [ForeignKey("MAKH")]
        public KhachHang? KHACHHANG { get; set; }

        public ICollection<ChiTietGioHang>? CT_GIOHANG { get; set; }
    }

}
