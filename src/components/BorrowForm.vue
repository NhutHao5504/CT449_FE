<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <button class="btn-close" @click="$emit('close')">&times;</button>

      <div class="borrow-form">
        <div class="borrow-header">Phiếu Mượn</div>

        <div class="borrow-content">
          <!-- Tên sách -->
          <div class="form-group">
            <label>Tên sách:</label>
            <p class="book-name">{{ book?.TENSACH }}</p>
          </div>

          <!-- Số lượng -->
          <div class="form-group">
            <label for="quantity">Số lượng mượn:</label>
            <input
              type="number"
              v-model.number="quantity"
              :max="book?.SOQUYEN || 1"
              min="1"
            />
          </div>
        </div>

        <p class="note">
          ⚠️ Không được mượn quá <strong>14 ngày</strong>.  
          Quá hạn <strong>1 ngày</strong> phạt <strong>5000đ</strong>.
        </p>

        <button class="btn-add" @click="registerBorrow">Đăng Ký Mượn</button>
      </div>
    </div>
  </div>
</template>

<script>
import { dangKyMuonSach } from '@/services/muonsachService'
import { useStore } from 'vuex'

export default {
  props: { book: Object },
  data() {
    const store = useStore()
    return {
      store,
      quantity: 1,
      NGAYMUON: ''
    }
  },
  computed: {
    docGiaId() {
      return this.store.state.user._id
    }
  },
  methods: {
    registerBorrow() {
      const today = new Date()
      this.NGAYMUON = today.toISOString().split('T')[0]

      console.log("DỮ LIỆU GỬI LÊN:", {
        docGiaID: this.docGiaId,
        MASACH: this.book?.MASACH,
        SOQUYEN: this.quantity,
        NGAYMUON: this.NGAYMUON
      });

      dangKyMuonSach(this.docGiaId, this.book.MASACH, this.quantity, this.NGAYMUON)
        .then(() => {
          alert('Đăng ký mượn thành công!')
          this.$emit('close')
        })
        .catch((err) => {
          alert(err.response?.data?.message || 'Lỗi khi đăng ký!')
        })
    }
  }
}
</script>

<style scoped>
/* === NỀN PHỦ === */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center; /* 👈 canh giữa dọc và ngang */
  z-index: 999;
  backdrop-filter: blur(3px);
  padding: 20px;
  overflow-y: auto;
}

/* === KHUNG FORM === */
.modal-content {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 26px 32px 34px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  font-family: "Segoe UI", sans-serif;
  animation: popUp 0.3s ease;
  margin-top: 80px;
}

@keyframes popUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* === NÚT ĐÓNG === */
.btn-close {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: #e74c3c;
  color: #fff;
  font-size: 22px;
  line-height: 32px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;
}
.btn-close:hover {
  background: #c0392b;
  transform: rotate(90deg);
}

/* === FORM CHÍNH === */
.borrow-form {
  background: #f9fafb;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px 18px 26px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* === TIÊU ĐỀ PHIẾU === */
.borrow-header {
  background: linear-gradient(135deg, #4a90e2, #3a6fd0);
  color: #fff;
  text-align: center;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 18px;
}

/* === NỘI DUNG FORM: MỖI Ô MỘT DÒNG === */
.borrow-content {
  display: block; /* 👈 bỏ flex, cho mỗi nhóm xuống dòng */
}

.form-group {
  margin-bottom: 16px; /* 👈 tạo khoảng cách giữa các nhóm */
}

label {
  font-weight: 600;
  color: #333;
  font-size: 15px;
  margin-bottom: 6px;
  display: block;
}

.book-name {
  background: #fff;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
  color: #2c3e50;
}

input[type="number"] {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.25s;
}
input[type="number"]:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.25);
  outline: none;
}


/* === GHI CHÚ === */
.note {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 16px;
  text-align: center;
  line-height: 1.4;
}

/* === NÚT ĐĂNG KÝ === */
.btn-add {
  display: block;
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #43a047, #2e7d32);
  color: white;
  font-weight: 600;
  font-size: 15px;
  margin-top: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.btn-add:hover {
  background: linear-gradient(135deg, #2e7d32, #1b5e20);
  transform: translateY(-2px);
}

/* === RESPONSIVE === */
@media (max-width: 600px) {
  .borrow-content {
    flex-direction: column;
  }
  .modal-content {
    max-width: 95%;
    padding: 22px;
  }
  .btn-close {
    top: -10px;
    right: -10px;
    width: 30px;
    height: 30px;
    font-size: 18px;
  }
}
</style>
