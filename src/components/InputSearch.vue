<style scoped>
/* ====== KHUNG TÌM KIẾM ====== */
.input-group {
  max-width: 540px;
  margin: 16px auto;
  display: flex;
  align-items: center;
  border-radius: 40px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* Khi hover hoặc focus vào bên trong khung */
.input-group:hover,
.input-group:focus-within {
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.35);
  transform: scale(1.02);
}

/* ====== Ô NHẬP ====== */
.form-control {
  flex: 1;
  border: none;
  padding: 14px 22px;
  font-size: 16px;
  background-color: #f8f9fc;
  transition: all 0.3s ease;
  border-radius: 40px 0 0 40px;
  color: #333;
}

.form-control::placeholder {
  color: #aaa;
  font-style: italic;
}

/* Khi focus: làm sáng nhẹ bên trong input */
.form-control:focus {
  outline: none;
  background-color: #fff;
}

/* ====== NÚT TÌM KIẾM ====== */
.btn-outline-secondary {
  border: none;
  padding: 14px 28px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 0 40px 40px 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hover nút */
.btn-outline-secondary:hover {
  background: linear-gradient(90deg, #5b68df, #5c3f99);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

/* Khi nhấn nút */
.btn-outline-secondary:active {
  transform: scale(0.97);
}

/* ====== RESPONSIVE ====== */
@media (max-width: 600px) {
  .input-group {
    max-width: 90%;
    flex-direction: column;
    border-radius: 20px;
  }

  .form-control {
    border-radius: 20px;
    width: 100%;
  }

  .btn-outline-secondary {
    border-radius: 20px;
    margin-top: 10px;
    width: 100%;
  }
}
</style>




<template>
  <div class="input-group mb-3">
  <input
    type="text"
    class="form-control"
    placeholder="Nhập từ khóa tìm kiếm..."
    :value="modelValue"
    @input="updateModelValue"
    @keyup.enter="submit"
  />
  <button class="btn btn-outline-secondary" @click="submit">Tìm kiếm</button>
</div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue", "submit"]);

const updateModelValue = (e) => {
  emit("update:modelValue", e.target.value);
};

const submit = () => {
  emit("submit");
};
</script>
