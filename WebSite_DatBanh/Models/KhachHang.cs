using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_DatBanh.Models
{
    [Table("KHACHHANG")]
    public class KhachHang
    {
        [Key] public string MAKH { get; set; }
        public string HOTEN { get; set; }
        public string TENDN { get; set; }
        public string MATKHAU { get; set; }
        public string EMAIL { get; set; }
        public string? DIACHI { get; set; }
        public string? SDT { get; set; }
        public int? SOLANDATHANG { get; set; }

        public ICollection<DonHang>? DONHANG { get; set; }
    }
}
