using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_DatBanh.Models
{
    [Table("NHANVIEN")]
    public class NhanVien
    {
        [Key] public string MANV { get; set; }
        public string HOTEN { get; set; }
        public string CHUCVU { get; set; }
        public DateTime? NGAYVAOLAM { get; set; }
        public string TRANGTHAI { get; set; }
        public int? TUOI { get; set; }
        public string? ANHDD { get; set; }
        public string TENDN { get; set; }
        public string MATKHAU { get; set; }
    }
}
