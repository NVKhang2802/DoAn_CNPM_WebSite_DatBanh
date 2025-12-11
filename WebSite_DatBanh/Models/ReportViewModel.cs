using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_DatBanh.Models
{
    public class ReportViewModel
    {
        public DateTime NGAYDAT { get; set; }
        public int SoDonHang { get; set; }
        public decimal DoanhThu { get; set; }

    }
}
