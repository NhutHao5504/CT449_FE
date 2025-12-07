<template>
  <div class="account-management-container">
    <h1>Quản Lý Tài Khoản</h1>

    <!-- Khu vực điều khiển -->
    <div class="controls-group">
      <div class="tab-group">
        <button
          @click="activeTab = 'docgia'"
          :class="['btn-tab', { active: activeTab === 'docgia' }]"
        >
          Danh Sách Độc Giả
        </button>

        <button
          @click="activeTab = 'nhanvien'"
          :class="['btn-tab', { active: activeTab === 'nhanvien' }]"
        >
          Danh Sách Nhân Viên
        </button>
      </div>

      <button
        @click="showNhanVienForm = true"
        class="btn btn-add"
      >
        Thêm Nhân Viên
      </button>
    </div>

    <!-- Form thêm nhân viên -->
    <NhanVienForm
      v-if="showNhanVienForm"
      @submit="addNhanVien"
      @cancel="showNhanVienForm = false"
    />

    <!-- Danh sách -->
    <div class="account-content">
      <DocGiaList
        v-if="activeTab === 'docgia'"
        :docGias="docGias"
        @deleteDocGia="deleteDocGia"
      />
      <NhanVienList
        v-if="activeTab === 'nhanvien'"
        :nhanViens="nhanViens"
        @deleteNhanVien="deleteNhanVien"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import DocGiaList from '@/components/DocGiaList.vue'
import NhanVienList from '@/components/NhanVienList.vue'
import NhanVienForm from '@/components/NhanVienForm.vue'

export default {
  components: { DocGiaList, NhanVienList, NhanVienForm },
  data() {
    return {
      activeTab: 'docgia',
      docGias: [],
      nhanViens: [],
      showNhanVienForm: false
    }
  },
  async created() {
    await this.fetchDocGias()
    await this.fetchNhanViens()
  },
  methods: {
    async fetchDocGias() {
      try {
        const res = await axios.get('http://localhost:3000/api/docgia')
        this.docGias = res.data.map(d => d._doc || d)
      } catch (err) {
        console.error('Lỗi tải độc giả:', err)
      }
    },
    async fetchNhanViens() {
      try {
        const res = await axios.get('http://localhost:3000/api/nhanvien')
        this.nhanViens = res.data.map(nv => nv._doc || nv)
      } catch (err) {
        console.error('Lỗi tải nhân viên:', err)
      }
    },
    async deleteDocGia(id) {
      if (confirm('Bạn có chắc muốn xóa độc giả này?')) {
        await axios.delete(`http://localhost:3000/api/docgia/${id}`)
        this.docGias = this.docGias.filter(d => d._id !== id)
      }
    },
    async deleteNhanVien(id) {
      if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
        await axios.delete(`http://localhost:3000/api/nhanvien/${id}`)
        this.nhanViens = this.nhanViens.filter(n => n._id !== id)
      }
    },
    async addNhanVien(nvData) {
      try {
        const res = await axios.post('http://localhost:3000/api/nhanvien/register', nvData)
        if (res.status === 200 && !res.data.error) {
          alert('Thêm nhân viên thành công!')
          this.showNhanVienForm = false
          await this.fetchNhanViens()
        } else {
          alert('Thêm thất bại: ' + (res.data.message || 'Lỗi không xác định'))
        }
      } catch (err) {
        console.error('Chi tiết lỗi:', error.response?.status, error.response?.data);
        alert('Đã xảy ra lỗi khi thêm nhân viên!')
      }
    }
  } 
}
</script>

<style scoped>
.account-management-container {
  padding: 40px;
  max-width: 1100px;
  margin: 20px auto;
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", sans-serif;
}

/* ====== TIÊU ĐỀ ====== */
h1 {
  font-size: 32px;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 700;
  letter-spacing: 1px;
  border-bottom: 3px solid #6c63ff;
  display: inline-block;
  padding-bottom: 8px;
}

/* ====== KHU VỰC ĐIỀU KHIỂN ====== */
.controls-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
}

.tab-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* ====== NÚT TAB ====== */
.btn-tab {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #444;
  background-color: #f1f1f1;
  font-weight: 600;
  font-size: 15px;
  padding: 10px 20px;
  min-width: 170px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

.btn-tab:hover {
  background-color: #e0e0ff;
  color: #222;
}

.btn-tab.active {
  background: linear-gradient(90deg, #6c63ff, #4834d4);
  color: #fff;
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
  transform: scale(1.03);
}

/* ====== NÚT THÊM NHÂN VIÊN ====== */
.btn-add {
  background: linear-gradient(90deg, #ffb300, #f57c00);
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  padding: 10px 20px;
  min-width: 180px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn-add:hover {
  background: linear-gradient(90deg, #f57c00, #e65100);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
}

/* ====== KHU VỰC NỘI DUNG ====== */
.account-content {
  background: #f9f9fb;
  border-radius: 16px;
  padding: 25px 30px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.4s ease;
}

/* ====== HIỆU ỨNG CHUYỂN MỊN ====== */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ====== RESPONSIVE ====== */
@media (max-width: 768px) {
  .controls-group {
    flex-direction: column;
    align-items: stretch;
  }
  .tab-group {
    justify-content: center;
  }
  .btn-tab, .btn-add {
    width: 100%;
  }
}
</style>
