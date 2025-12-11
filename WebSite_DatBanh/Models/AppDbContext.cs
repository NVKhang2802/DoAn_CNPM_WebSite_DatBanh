using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebSite_DatBanh.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<SanPham> SANPHAM { get; set; }
        public DbSet<KhachHang> KHACHHANG { get; set; }
        public DbSet<NhanVien> NHANVIEN { get; set; }
        public DbSet<DonHang> DONHANG { get; set; }
        public DbSet<ChiTietDonHang> CT_DONHANG { get; set; }
        public DbSet<GioHang> GIOHANG { get; set; }
        public DbSet<ChiTietGioHang> CT_GIOHANG { get; set; }
        public DbSet<ThanhToan> THANHTOAN { get; set; }
        public DbSet<TaiKhoanKH> TAIKHOAN_KH { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ChiTietDonHang>()
                .HasKey(c => new { c.MADH, c.MASP });

            modelBuilder.Entity<ChiTietGioHang>()
                .HasKey(c => new { c.MAGH, c.MASP });

            modelBuilder.Entity<ChiTietDonHang>()
                .HasOne(c => c.DONHANG)
                .WithMany(d => d.CT_DONHANG)
                .HasForeignKey(c => c.MADH);

            modelBuilder.Entity<ChiTietDonHang>()
                .HasOne(c => c.SANPHAM)
                .WithMany(p => p.CT_DONHANG)
                .HasForeignKey(c => c.MASP);

            modelBuilder.Entity<ChiTietGioHang>()
                .HasOne(c => c.GIOHANG)
                .WithMany(g => g.CT_GIOHANG)
                .HasForeignKey(c => c.MAGH);

            modelBuilder.Entity<ChiTietGioHang>()
                .HasOne(c => c.SANPHAM)
                .WithMany(p => p.CT_GIOHANG)
                .HasForeignKey(c => c.MASP);

            modelBuilder.Entity<SanPham>()
                .ToTable(tb => tb.HasTrigger("TRG_KIEMTRA_GIA_SANPHAM"));

            modelBuilder.Entity<TaiKhoanKH>()
                .ToTable(tb => tb.HasTrigger("TRG_VIETHOA_TENDN"));

            modelBuilder.Entity<ThanhToan>()
                .ToTable(tb => tb.HasTrigger("TRG_DEFAULT_NGAYTHANHTOAN"));

            modelBuilder.Entity<ChiTietDonHang>()
                .ToTable(tb => tb.HasTrigger("TRG_CAPNHAT_TONGTIEN"));

            modelBuilder.Entity<KhachHang>()
                .ToTable(tb => tb.HasTrigger("TRG_CHAN_XOA_KHACHHANG"));
        }
    }
}
