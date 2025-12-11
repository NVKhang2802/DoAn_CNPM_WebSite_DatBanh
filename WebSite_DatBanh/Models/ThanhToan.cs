using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_DatBanh.Models
{
    [Table("THANHTOAN")]
    public class ThanhToan
    {
        [Key]
        [StringLength(10)]
        public string MATT { get; set; }

        [StringLength(10)]
        public string MADH { get; set; }

        [Required, StringLength(50)]
        public string PHUONGTHUC { get; set; }

        public DateTime? NGAYTT { get; set; }

        public decimal SOTIEN { get; set; }

        [StringLength(50)]
        public string TRANGTHAI { get; set; }

        [StringLength(255)]
        public string GHICHU { get; set; }

        // Navigation
        [ForeignKey("MADH")]
        public DonHang? DONHANG { get; set; }
    }
}
