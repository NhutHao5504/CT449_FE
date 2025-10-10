<template>
  <div class="overlay">
    <div class="form-container">
      <h2>Thêm Tài Khoản Nhân Viên</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="hoten">Họ tên:</label>
          <input type="text" id="hoten" v-model="HoTenNV" required />
        </div>

        <div class="form-group">
          <label for="sdt">Số điện thoại:</label>
          <input type="text" id="sdt" v-model="SoDienThoai" required />
        </div>

        <div class="form-group">
          <label for="matkhau">Mật khẩu:</label>
          <input type="password" id="matkhau" v-model="Password" required />
        </div>

        <div class="form-group">
          <label for="xacnhan">Xác nhận mật khẩu:</label>
          <input type="password" id="xacnhan" v-model="confirmmatkhauNV" required />
        </div>

        <div class="form-group">
          <label>Chức vụ:</label>
          <div class="radio-group">
            <label>
              <input type="radio" value="quanly" v-model="ChucVu" /> Quản lý
            </label>
            <label>
              <input type="radio" value="nhanvien" v-model="ChucVu" /> Nhân viên
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit">Thêm</button>
          <button type="button" class="btn-cancel" @click="cancel">Hủy</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NhanVienForm',
  data() {
    return {
      HoTenNV: '',
      SoDienThoai: '',
      Password: '',
      confirmmatkhauNV: '',
      ChucVu: 'nhanvien'
    };
  },
  methods: {
    submitForm() {
      if (this.Password !== this.confirmmatkhauNV) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
      }

      const newNhanVien = {
        HoTenNV: this.HoTenNV,
        SoDienThoai: this.SoDienThoai,
        Password: this.Password,
        confirmmatkhauNV: this.confirmmatkhauNV,
        ChucVu: this.ChucVu
      };

      this.$emit('submit', newNhanVien);
      this.resetForm();
    },
    resetForm() {
      this.HoTenNV = '';
      this.SoDienThoai = '';
      this.Password = '';
      this.confirmmatkhauNV = '';
      this.ChucVu = 'nhanvien';
    },
    cancel() {
      this.$emit('cancel');
      this.resetForm();
    }
  }
};
</script>

<style scoped>
/* ========== OVERLAY ========== */
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Cho form nằm phía trên thay vì giữa */
  overflow-y: auto; /* Cuộn toàn màn hình khi form quá cao */
  padding: 60px 15px; /* Cách mép trên để form không dính */
  z-index: 1000;
  font-family: 'Segoe UI', sans-serif;
}

/* ========== FORM CONTAINER ========== */
.form-container {
  background: #fff;
  padding: 28px 35px;
  border-radius: 14px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
  animation: slideDown 0.35s ease;
  position: relative;

  /* Giới hạn chiều cao tối đa */
  max-height: 85vh; /* chỉ chiếm 85% chiều cao màn hình */
  overflow-y: auto; /* Cho phép cuộn bên trong form */
}

/* Hiệu ứng trượt nhẹ xuống */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== TIÊU ĐỀ ========== */
.form-container h2 {
  text-align: center;
  color: #3f51b5;
  font-size: 24px;
  margin-bottom: 22px;
  font-weight: 700;
}

/* ========== INPUT GROUP ========== */
.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
  transition: border-color 0.25s, box-shadow 0.25s;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  outline: none;
}

/* ========== RADIO ========== */
.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.radio-group label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #555;
  cursor: pointer;
}

input[type="radio"] {
  margin-right: 6px;
  transform: scale(1.1);
}

/* ========== BUTTONS ========== */
.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 25px;
}

.btn-submit,
.btn-cancel {
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-submit {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
}
.btn-submit:hover {
  background: linear-gradient(135deg, #43A047, #1B5E20);
  transform: translateY(-1px);
}

.btn-cancel {
  background: linear-gradient(135deg, #f44336, #d32f2f);
}
.btn-cancel:hover {
  background: linear-gradient(135deg, #e53935, #b71c1c);
  transform: translateY(-1px);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 600px) {
  .form-container {
    padding: 20px;
    max-height: 90vh;
  }

  h2 {
    font-size: 20px;
  }

  .form-actions {
    flex-direction: column;
    gap: 10px;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%;
  }
}
</style>

