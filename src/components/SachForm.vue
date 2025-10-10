<template>
  <div class="overlay">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="TENSACH">Tên Sách</label>
        <input
          type="text"
          class="form-control"
          v-model="bookLocal.TENSACH"
          required
        />
      </div>
      <div class="form-group">
        <label for="MANXB">Nhà Xuất Bản</label>
        <select v-model="bookLocal.MANXB" class="form-control" required>
          <option value="" disabled>-- Chọn nhà xuất bản --</option>
          <option v-for="nxb in nxbList" :key="nxb.MANXB" :value="nxb.MANXB">
            {{ nxb.TENNXB }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="SOQUYEN">Số lượng quyển</label>
        <input
          type="number"
          class="form-control"
          v-model.number="bookLocal.SOQUYEN"
          min="1"
          required
        />
      </div>
      <div class="form-group">
        <label for="DONGIA">Đơn giá</label>
        <input
          type="number"
          v-model.number="bookLocal.DONGIA"
          class="form-control"
          id="DONGIA"
          required
        />
      </div>
      <div class="form-group">
        <label for="NAMXUATBAN">Năm xuất bản</label>
        <input
          type="number"
          v-model.number="bookLocal.NAMXUATBAN"
          class="form-control"
          id="NAMXUATBAN"
          required
        />
      </div>
      <div class="form-group">
        <label for="TACGIA">Tác giả</label>
        <input
          type="text"
          v-model="bookLocal.TACGIA"
          class="form-control"
          id="TACGIA"
          required
        />
      </div>
      <div class="form-group">
        <label for="hinhAnh">Ảnh sách:</label>
        <input type="file" id="hinhAnh" accept="image/*" @change="onFileChange" />
      </div>

      <!-- Xem trước ảnh -->
      <div v-if="bookLocal.hinhAnh" class="image-preview">
        <img :src="bookLocal.hinhAnh" alt="Ảnh xem trước" />
      </div>

      <!-- Nhóm nút lưu/hủy -->
      <div class="buttons">
        <button class="btn btn-success">💾 Lưu</button>
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">✖ Hủy</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    book: {
      type: Object,
      default: () => ({
        TENSACH: '',
        MANXB: '',
        SOQUYEN: 1,
        DONGIA: 0,
        NAMXUATBAN: 2010,
        TACGIA: '',
        hinhAnh: ''
      })
    },
    nxbList: { type: Array, required: true }
  },
  data() {
    return {
      bookLocal: { ...this.book },
      formKey: 0
    }
  },
  watch: {
    book: {
      handler(newVal) {
        this.bookLocal = { ...newVal }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    submitForm() {
      if (!this.bookLocal.MANXB) {
        alert('Vui lòng chọn Nhà Xuất Bản!')
        return
      }

      const bookData = { ...this.bookLocal }
      this.$emit('submit', bookData)
    },
    onFileChange(event) {
  console.log('Đã chọn file:', event.target.files[0]); // 👈 kiểm tra
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = e => {
      this.bookLocal.hinhAnh = e.target.result;
      console.log('Base64 ảnh:', this.bookLocal.hinhAnh.slice(0, 100)); 
    };
    reader.readAsDataURL(file);
  } else {
    alert('Vui lòng chọn tệp hình ảnh hợp lệ!');
  }
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
  background: rgba(20, 20, 20, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;        /* ✅ Cho phép cuộn dọc */
  padding: 40px 0;         /* ✅ Tạo khoảng cách trên dưới */
  z-index: 2000;           /* ✅ Tăng ưu tiên hiển thị */
}

/* ======= FORM CHÍNH ======= */
form {
  width: 100%;
  max-width: 720px;
  background: #fff;
  padding: 35px 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 25px;
  position: relative;
  animation: fadeIn 0.3s ease-in-out;

  /* ✅ Giới hạn chiều cao và cuộn trong form nếu quá dài */
  max-height: 90vh;
  overflow-y: auto;
}


/* Animation vào mượt */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

/* ======= NHÓM FORM ======= */
.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #34495e;
  font-size: 15px;
}

/* ======= INPUT / SELECT ======= */
input,
select {
  padding: 10px 12px;
  border: 1.5px solid #ced4da;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  background: #fafafa;
  transition: all 0.3s ease;
}

input:focus,
select:focus {
  border-color: #007bff;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
  outline: none;
}

/* File input */
input[type="file"] {
  border: none;
  background: none;
  padding: 4px 0;
}

/* ======= ẢNH XEM TRƯỚC ======= */
.image-preview {
  grid-column: span 2;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.image-preview img {
  max-width: 200px;
  max-height: 220px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #e0e0e0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

/* ======= NÚT ======= */
.btn {
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

/* Nút lưu */
.btn-success {
  background: linear-gradient(90deg, #28a745, #1e7e34);
  color: #fff;
}
.btn-success:hover {
  background: linear-gradient(90deg, #23913c, #166b29);
  transform: translateY(-1px);
}

/* Nút hủy */
.btn-secondary {
  background: linear-gradient(90deg, #dc3545, #b02a37);
  color: #fff;
}
.btn-secondary:hover {
  background: linear-gradient(90deg, #c82333, #922026);
  transform: translateY(-1px);
}

.buttons {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

/* ======= RESPONSIVE ======= */
@media (max-width: 768px) {
  form {
    grid-template-columns: 1fr;
    padding: 25px 22px;
  }
  .buttons {
    flex-direction: column;
  }
  .btn {
    width: 100%;
  }
}
</style>

