<template>
  <footer class="footer">
    <div class="container footer-container">
      <!-- Logo + mô tả -->
      <div class="footer-section footer-branding">
        <img src="../assets/logo.png" alt="Logo hệ thống" class="footer-logo" />
        <p>
          H'Library - Nơi tri thức lan tỏa!
        </p>
        <p>
          Hệ thống giúp độc giả đăng ký và quản lý mượn sách trực tuyến một cách
          thuận tiện, hiệu quả.
        </p>
      </div>

      <!-- Liên hệ -->
      <div class="footer-section">
        <h4>Liên Hệ</h4>
        <p><i class="bi bi-geo-alt"></i> Đại Học Cần Thơ</p>
        <p><i class="bi bi-envelope"></i> haonhut.01012004@gmail.com</p>
        <p><i class="bi bi-telephone"></i> 0865 475 344 (Hỗ trợ 24/7)</p>

      </div>

      <!-- Thông tin -->
      <div class="footer-section">
        <h4>Thông Tin</h4>
        <span class="footer-link" @click="openModal('gioithieu')"
          >Giới thiệu</span
        ><br />
        <span class="footer-link" @click="openModal('dieukhoan')"
          >Điều khoản mượn sách</span
        ><br />
        <span class="footer-link" @click="openModal('huongdan')"
          >Hướng dẫn sử dụng</span
        >
      </div>
    </div>

    <div class="footer-bottom">© 2025 Hệ Thống Quản Lý Mượn Sách H'Library</div>

    <!-- Modal -->
    <div v-if="activeModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">&times;</button>
        <div v-if="activeModal === 'gioithieu'">
          <h3>Giới Thiệu</h3>
          <p>
            H'Library là hệ thống quản lý mượn sách trực tuyến, giúp độc giả dễ dàng
            đăng ký, tìm kiếm và mượn sách từ thư viện. Với giao diện thân thiện và
            tính năng hiện đại, H'Library mang đến trải nghiệm mượn sách tiện lợi
            và nhanh chóng.
          </p>
        </div>
        <div v-else-if="activeModal === 'dieukhoan'">
          <h3>Điều Khoản Mượn Sách</h3>
          <p>1. Độc giả cần tài khoản hợp lệ để sử dụng hệ thống.</p>
          <p>2. Thời gian mượn tối đa là 14 ngày; Quá hạn 1 ngày phạt 5000đ.</p>
          <p>3. Phí phạt áp dụng nếu trễ hạn hoặc hư hỏng sách.</p>
          <p>4. Có thể gia hạn nếu yêu cầu trước hạn.</p>
        </div>
        <div v-else-if="activeModal === 'huongdan'">
          <h3>Hướng Dẫn Sử Dụng</h3>
          <p>1. Đăng nhập bằng số điện thoại và mật khẩu.</p>
          <p>2. Duyệt sách và gửi yêu cầu mượn.</p>
          <p>3. Theo dõi lịch sử mượn và trả.</p>
          <p>4. Tuân thủ quy định mượn trả.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      activeModal: null,
    };
  },
  methods: {
    openModal(type) {
      this.activeModal = type;
    },
    closeModal() {
      this.activeModal = null;
    },
  },
};
</script>

<style scoped>
.footer {
  background: linear-gradient(to right top, #0a57ab, #5661bf, #886acf, #b771db, #e478e2);
  color: #fff;
  font-family: "Segoe UI", sans-serif;
  border-top: 4px solid #1e3a8a;
  padding: 60px 40px 20px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* --- GRID --- */
.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: auto;
  align-items: flex-start;
}

/* --- BRANDING --- */
.footer-branding {
  text-align: left;
}
.footer-logo {
  width: 120px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(30, 58, 138, 0.15);
  margin-bottom: 15px;
}
.footer-title {
  font-weight: 600;
  font-size: 16pt;
  color: #fff;
  margin-bottom: 8px;
}
.footer-branding p {
  font-size: 13pt;
  line-height: 1.6;
  color: #fff;
}

/* --- SECTION --- */
.footer-section h4 {
  font-size: 18pt;
  margin-bottom: 18px;
  color: #fff;
  position: relative;
}
.footer-section h4::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 150px;
  height: 3px;
  background: #38bdf8;
  border-radius: 2px;
}

.footer-section p,
.footer-link {
  font-size: 13pt;
  margin: 8px 0;
  color: #fff;
  transition: all 0.3s ease;
}

.footer-section i {
  color: #fff;
  margin-right: 8px;
}

/* --- LINK --- */
.footer-link {
  display: inline-block;
  cursor: pointer;
  position: relative;
}
.footer-link::after {
  content: "";
  width: 0%;
  height: 2px;
  background: #38bdf8;
  position: absolute;
  bottom: -2px;
  left: 0;
  transition: width 0.3s ease;
}
.footer-link:hover {
  color: #1e3a8a;
  transform: translateX(3px);
}
.footer-link:hover::after {
  width: 100%;
}

/* --- BOTTOM --- */
.footer-bottom {
  text-align: center;
  border-top: 1px solid #94a3b8;
  margin-top: 40px;
  padding-top: 15px;
  font-size: 12pt;
  color: #fff;
}

/* --- MODAL --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(30, 41, 59, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: #fff;
  padding: 40px 30px;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  border: 2px solid #1e3a8a;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.4s ease;
  color: #334155;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 28px;
  color: #1e3a8a;
  border: none;
  background: none;
  cursor: pointer;
  transition: 0.3s;
}
.close-btn:hover {
  color: #38bdf8;
}

/* --- ANIMATION --- */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .footer {
    padding: 40px 20px;
  }
  .footer-container {
    text-align: center;
  }
  .footer-logo {
    margin: 0 auto 15px;
  }
  .footer-section h4::after {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>

<!-- <style scoped>
.footer {
  background: linear-gradient(to right, #f1f5f9, #e2e8f0);
  color: #000;
  font-family: "Segoe UI", sans-serif;
  padding: 60px 40px 20px;
  margin-top: 60px;
  border-top: 3px solid #93c5fd;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
}

.footer-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
  max-width: 1200px;
  margin: auto;
}

/* Logo + mô tả */
.footer-branding {
  flex: 1.2;
  min-width: 280px;
}
.footer-logo {
  width: 100px;
  height: auto;
  margin-bottom: 15px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}
.footer-logo:hover {
  transform: scale(1.05);
}
.footer-branding p {
  font-size: 13pt;
  line-height: 1.6;
  color: #e2e8f0;
}

/* Các phần khác */
.footer-section {
  flex: 1;
  min-width: 240px;
}
.footer-section h4 {
  font-size: 18pt;
  color: #fff;
  margin-bottom: 20px;
  position: relative;
}
.footer-section h4::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 60px;
  height: 3px;
  background: #38bdf8;
  border-radius: 2px;
}

.footer-section p {
  margin: 10px 0;
  font-size: 14pt;
  color: #f1f5f9;
  line-height: 1.7;
}

.footer-section i {
  color: #93c5fd;
  margin-right: 8px;
}

/* Link */
.footer-link {
  cursor: pointer;
  display: inline-block;
  font-size: 14pt;
  margin: 8px 0;
  color: #f8fafc;
  text-decoration: none;
  transition: all 0.3s ease;
}
.footer-link:hover {
  color: #38bdf8;
  transform: translateX(4px);
}

/* Footer bottom */
.footer-bottom {
  text-align: center;
  font-size: 12pt;
  margin-top: 40px;
  padding-top: 25px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  color: #e0f2fe;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #ffffff;
  color: #1e293b;
  padding: 35px;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  border-top: 6px solid #2563eb;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: fadeIn 0.35s ease;
}
.close-btn {
  position: absolute;
  top: 14px;
  right: 18px;
  font-size: 28px;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}
.close-btn:hover {
  color: #38bdf8;
  transform: rotate(90deg);
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-container {
    gap: 30px;
  }
  .footer-section h4 {
    font-size: 16pt;
  }
  .footer-section p,
  .footer-link {
    font-size: 13pt;
  }
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
  }
  .footer-logo {
    margin: 0 auto 15px;
  }
  .footer-section h4::after {
    left: 50%;
    transform: translateX(-50%);
  }
}

</style>
 -->
