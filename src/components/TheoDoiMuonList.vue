<template>
  <div class="borrow-list">
    <h1>Theo dõi mượn sách</h1>

    <InputSearch v-model="search" />

    <div class="page-size mb-2">
      <label for="pageSize">Hiển thị:</label>
      <select v-model="perPage" id="pageSize">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
      <span> phiếu / trang</span>
    </div>

    <table>
      <thead>
        <tr>
          <th>Người mượn</th>
          <th>Tên sách</th>
          <th>Số quyển</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="don in paginatedDonMuon" :key="don._id">
          <td>{{ loadHoTen(don.MADOCGIA) }}</td>
          <td>{{ loadSach(don.MASACH) }}</td>
          <td>{{ don.SOQUYEN }}</td>
          <td>{{ formatDate(don.NGAYMUON) }}</td>
          <td>
            {{ formatNgay(don.NGAYTRA) }}
            <div
              v-if="isQuaHan(don.NGAYMUON, don.NGAYTRA)"
              style="color: red; font-size: 0.9rem"
            >
              Mượn quá hạn ({{ soNgayTre(don.NGAYMUON, don.NGAYTRA) }} ngày) –
              Phạt {{ soNgayTre(don.NGAYMUON, don.NGAYTRA) * 5000 }}đ
            </div>
          </td>
          <!-- Cột TRẠNG THÁI -->
<td>
  <!-- ✅ Khi mất sách -->
  <div v-if="don.trangThai === 'Mất sách'">
    <strong style="color: #e74c3c">📕 {{ don.trangThai }}</strong>
    <div style="margin-top: 4px; color: #c0392b; font-weight: 600;">
      💸 Bồi thường:
      {{ formatCurrency(don.TIENBOITHUONG) }}
    </div>
  </div>

  <!-- ✅ Các trạng thái khác -->
  <span
    v-else-if="don.trangThai === 'Đã trả'"
    style="color: #28a745; font-weight: 600"
  >
    {{ don.trangThai }}
  </span>
  <span
    v-else-if="don.trangThai === 'Đang mượn'"
    style="color: #f39c12; font-weight: 600"
  >
    {{ don.trangThai }}
  </span>
  <span
    v-else
    style="color: #3498db; font-weight: 600"
  >
    {{ don.trangThai }}
  </span>
</td>

<!-- Cột THAO TÁC -->
<td>
  <!-- Duyệt -->
  <button
    style="background:#4caf50;color:white"
    v-if="don.trangThai === 'Chờ duyệt'"
    @click="$emit('duyetMuon', don)"
  >
    Duyệt
  </button>

  <!-- Trả -->
  <button
    style="background:#f44336;color:white"
    v-if="don.trangThai === 'Đang mượn'"
    @click="$emit('xacNhanTra', don)"
  >
    Trả
  </button>

  <!-- Mất sách -->
  <button
    style="background:#9c27b0;color:white"
    v-if="don.trangThai === 'Đang mượn'"
    @click="moThongBaoMatSach(don)"
  >
    Mất sách
  </button>

  <!-- ✅ Khi mất sách thì hiện nút XÓA -->
  <button
    style="background:#ff9800;color:white"
    v-if="don.trangThai === 'Mất sách'"
    @click="$emit('xoaDonMuon', don)"
  >
    🗑 Xóa
  </button>

  <!-- Đã trả -->
  <button
    style="background:#ff9800;color:white"
    v-if="don.trangThai === 'Đã trả'"
    @click="$emit('xoaDonMuon', don)"
  >
    Xóa
  </button>
</td>
        </tr>
      </tbody>
    </table>

    <!-- FORM THÔNG BÁO MẤT SÁCH -->
    <MatSachForm
      v-if="hienFormMatSach && donChon"
      :tenDocGia="loadHoTen(donChon.MADOCGIA)"
      :tenSach="loadSach(donChon.MASACH)"
      @submit="xacNhanMatSach"
      @cancel="dongFormMatSach"
    />

    <div class="pagination mt-3">
      <button @click="prevPage" :disabled="currentPage === 1">
        <i class="bi bi-chevron-left"></i>
        Trước
      </button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Sau
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import MatSachForm from "@/components/MatSachForm.vue";

export default {
  components: { InputSearch, MatSachForm },
  props: {
    danhSachDonMuon: Array,
    danhSachDocGia: Array,
    danhSachSach: Array,
  },
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      search: "",
      hienFormMatSach: false,
      donChon: null,
    };
  },
  computed: {
    filteredDonMuon() {
      const keyword = this.search.toLowerCase().trim();
      return this.danhSachDonMuon.filter((don) => {
        const sach = this.loadSach(don.MASACH).toLowerCase();
        const ten = this.loadHoTen(don.MADOCGIA).toLowerCase();
        return sach.includes(keyword) || ten.includes(keyword);
      });
    },
    totalPages() {
      return Math.ceil(this.filteredDonMuon.length / this.perPage);
    },
    paginatedDonMuon() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredDonMuon.slice(start, start + this.perPage);
    },
  },
  methods: {
    loadHoTen(id) {
      const docGia = this.danhSachDocGia.find((dg) => dg._id === id);
      return docGia ? docGia.TEN : "Không tìm thấy";
    },
    loadSach(ma) {
      const sach = this.danhSachSach.find((s) => s.MASACH === ma);
      return sach ? sach.TENSACH : "Không tìm thấy";
    },
    formatDate(d) {
      return new Date(d).toLocaleDateString("vi-VN");
    },
    formatNgay(d) {
      if (!d) return "Chưa trả";
      return new Date(d).toLocaleDateString("vi-VN");
    },
    isQuaHan(muon, tra) {
      if (!muon || tra) return false;
      const hienTai = new Date();
      const ngayMuon = new Date(muon);
      const soNgayMuon = (hienTai - ngayMuon) / (1000 * 60 * 60 * 24);
      return soNgayMuon > 14;
    },
    soNgayTre(muon, tra) {
      if (!muon) return 0;
      const hienTai = new Date();
      const ngayMuon = new Date(muon);
      const soNgayMuon = (hienTai - ngayMuon) / (1000 * 60 * 60 * 24);
      return soNgayMuon > 14 ? Math.floor(soNgayMuon - 14) : 0;
    },
    moThongBaoMatSach(don) {
      console.log("Mở form mất sách:", don);
      this.donChon = don;
      this.hienFormMatSach = true;
    },
    dongFormMatSach() {
      this.hienFormMatSach = false;
      this.donChon = null;
    },
    xacNhanMatSach(lyDo) {
      this.$emit("matSach", { don: this.donChon, lyDo });
      this.dongFormMatSach();
    },
    formatCurrency(value) {
      if (!value) return "0đ";
      return value.toLocaleString("vi-VN") + "đ";
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
  },
  watch: {
    perPage() {
      this.currentPage = 1;
    },
  },
};
</script>

<style scoped>
.borrow-list {
  padding: 30px;
  max-width: 1200px;
  margin: 40px auto;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  font-size: 32px;
  color: #2c3e50;
  text-shadow: none;
  margin-bottom: 35px;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 1.5px;
}

.page-size {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 25px;
  font-size: 15px;
  color: #555;
  gap: 15px;
}

.page-size label {
  font-weight: 600;
  color: #333;
}

.page-size select {
  padding: 8px 12px;
  border: 1px solid #c0c0c0;
  border-radius: 8px;
  font-size: 15px;
  background: #fdfdfd;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.page-size select:hover {
  border-color: #a0a0a0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.page-size select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.page-size span {
  font-size: 15px;
  color: #555;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

th,
td {
  border: none;
  padding: 14px 10px;
  text-align: center;
  vertical-align: middle;
}

th {
  background: linear-gradient(to right, #4a90e2, #5c7ee6);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 14px;
}

th:first-child { border-top-left-radius: 12px; }
th:last-child { border-top-right-radius: 12px; }

td {
  background-color: #ffffff;
  border-bottom: 1px solid #eef0f3;
}

tbody tr:nth-child(even) td {
  background-color: #f8faff;
}

tbody tr:hover td {
  background-color: #e3f2fd;
  transform: scale(1.005);
  transition: background-color 0.2s ease, transform 0.2s ease;
}

tbody tr:last-child td {
  border-bottom: none;
}
tbody tr:last-child td:first-child {
  border-bottom-left-radius: 12px;
}
tbody tr:last-child td:last-child {
  border-bottom-right-radius: 12px;
}

th:last-child,
td:last-child {
  width: auto;
  min-width: 140px;
  text-align: center;
  padding: 8px;
}

button {
  padding: 8px 12px;
  margin: 3px;
  font-size: 13px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

button:hover {
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

button[style*="background: #4caf50"],
button[style*="background:#4caf50"] {
  background: linear-gradient(to right, #28a745, #218838) !important;
  color: white;
}
button[style*="background: #4caf50"]:hover,
button[style*="background:#4caf50"]:hover {
  background: linear-gradient(to right, #218838, #1e7e34) !important;
}

button[style*="background: #f44336"],
button[style*="background:#f44336"] {
  background: linear-gradient(to right, #dc3545, #c82333) !important;
  color: white;
}
button[style*="background: #f44336"]:hover,
button[style*="background:#f44336"]:hover {
  background: linear-gradient(to right, #c82333, #bd2130) !important;
}

button[style*="background: #ff9800"],
button[style*="background:#ff9800"] {
  background: linear-gradient(to right, #ffc107, #e0a800) !important;
  color: #333;
}
button[style*="background: #ff9800"]:hover,
button[style*="background:#ff9800"]:hover {
  background: linear-gradient(to right, #e0a800, #c69500) !important;
}

button[style*="background: #9c27b0"],
button[style*="background:#9c27b0"] {
  background: linear-gradient(to right, #9c27b0, #7b1fa2) !important;
  color: white;
}
button[style*="background: #9c27b0"]:hover,
button[style*="background:#9c27b0"]:hover {
  background: linear-gradient(to right, #7b1fa2, #6a1b9a) !important;
}

div[style*="color: red"] {
  color: #e74c3c !important;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 5px;
  border-top: 1px dashed #e74c3c;
  padding-top: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 15px;
}

.pagination button {
  padding: 8px 15px;
  border: none;
  background: linear-gradient(to right, #530ef3, #3925ef);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 15px;
  font-weight: 600;
}

.pagination button:hover {
  background: linear-gradient(to right, #0a6bf2, #4c6dd0);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pagination button:disabled {
  background-color: #d0d0d0;
  color: #999;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.pagination span {
  font-size: 16px;
  color: #444;
  font-weight: 500;
}

@media (max-width: 992px) {
  .borrow-list {
    padding: 25px;
    margin: 30px auto;
  }
  h1 {
    font-size: 28px;
    margin-bottom: 30px;
  }
  th, td {
    padding: 12px 8px;
    font-size: 14px;
  }
  .page-size {
    margin-bottom: 20px;
  }
  .pagination {
    margin-top: 25px;
    gap: 10px;
  }
  .pagination button {
    padding: 6px 12px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .borrow-list {
    padding: 20px;
    border-radius: 12px;
  }
  h1 {
    font-size: 24px;
    margin-bottom: 25px;
  }
  .page-size {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 20px;
  }
  .page-size select {
    width: 100px;
  }
}

@media (max-width: 576px) {
  .borrow-list {
    padding: 15px;
    margin: 20px auto;
    border-radius: 10px;
  }
  h1 {
    font-size: 20px;
    margin-bottom: 20px;
  }
}
</style>