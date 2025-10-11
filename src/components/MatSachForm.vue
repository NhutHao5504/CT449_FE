<template>
  <div class="overlay" @click.self="$emit('cancel')">
    <form @submit.prevent="submitForm">
      <h2>Thông báo mất sách</h2>

      <div class="form-group">
        <label><strong>Người mượn:</strong></label>
        <p class="info-text">{{ tenDocGia }}</p>
      </div>

      <div class="form-group">
        <label><strong>Sách bị mất:</strong></label>
        <p class="info-text">{{ tenSach }}</p>
      </div>

      <div class="form-group">
        <label for="lyDoMat">Lý do mất / Ghi chú:</label>
        <textarea
          id="lyDoMat"
          v-model="lyDoMat"
          rows="5"
          placeholder="Nhập lý do hoặc ghi chú về sách bị mất..."
          required
        ></textarea>
      </div>

      <div class="buttons">
        <button type="submit" class="btn btn-primary">
          ✔ Xác nhận
        </button>
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          ✖ Hủy
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    tenDocGia: {
      type: String,
      required: true
    },
    tenSach: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      lyDoMat: ''
    }
  },
  methods: {
    submitForm() {
      if (!this.lyDoMat.trim()) {
        alert('Vui lòng nhập lý do mất sách!')
        return
      }
      this.$emit('submit', this.lyDoMat)
    }
  }
}
</script>

<style scoped>
/* ======= NỀN MỜ ======= */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 20, 20, 0.5);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

/* ======= FORM CHÍNH ======= */
form {
  width: 100%;
  max-width: 500px;
  background: #fff;
  padding: 30px 35px;
  border-radius: 16px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
}

/* Animation vào mượt */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

h2 {
  font-size: 24px;
  color: #9c27b0;
  margin-bottom: 25px;
  text-align: center;
  font-weight: 700;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 15px;
}

/* ======= NHÓM FORM ======= */
.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #34495e;
  font-size: 15px;
  display: block;
}

.info-text {
  padding: 12px 15px;
  background: #f8f9fa;
  border-left: 4px solid #9c27b0;
  border-radius: 6px;
  color: #333;
  font-size: 15px;
  margin: 0;
}

/* ======= TEXTAREA ======= */
textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1.5px solid #ced4da;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  background: #fafafa;
  transition: all 0.3s ease;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
}

textarea:focus {
  border-color: #9c27b0;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(156, 39, 176, 0.25);
  outline: none;
}

textarea::placeholder {
  color: #999;
  font-style: italic;
}

/* ======= NÚT ======= */
.btn {
  padding: 11px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
  flex: 1;
}

/* Nút xác nhận */
.btn-primary {
  background: linear-gradient(90deg, #9c27b0, #7b1fa2);
  color: #fff;
}
.btn-primary:hover {
  background: linear-gradient(90deg, #7b1fa2, #6a1b9a);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(156, 39, 176, 0.3);
}

/* Nút hủy */
.btn-secondary {
  background: linear-gradient(90deg, #6c757d, #5a6268);
  color: #fff;
}
.btn-secondary:hover {
  background: linear-gradient(90deg, #5a6268, #4e555b);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 117, 125, 0.3);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 25px;
}

/* ======= RESPONSIVE ======= */
@media (max-width: 576px) {
  form {
    padding: 25px 20px;
  }
  
  h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    width: 100%;
  }
}
</style>