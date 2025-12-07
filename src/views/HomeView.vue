<template>
  <div class="home-page">
    <!-- HERO SECTION -->
    <section class="hero">
      <div class="hero-overlay">
        <h1 class="hero-title">H'LIBRARY</h1>
        <p class="hero-subtitle">Nơi lưu giữ tri thức — Mở rộng tâm hồn qua từng trang sách</p>
        <InputSearch v-model="search" />
      </div>
    </section>

    <!-- THỐNG KÊ -->
    <section class="stats">
      <div class="stat-item">
        <h2>{{ sachList.length }}</h2>
        <p>Đầu sách</p>
      </div>
      <div class="stat-item">
        <h2>320+</h2>
        <p>Độc giả</p>
      </div>
      <div class="stat-item">
        <h2>1,200+</h2>
        <p>Lượt mượn</p>
      </div>
    </section>

    <!-- DANH SÁCH SÁCH -->
    <section class="book-section">
      <h2 class="section-title">Danh Sách Sách</h2>
      <div class="sach-list">
        <SachCard
          v-for="sach in paginatedBooks"
          :key="sach.MASACH"
          :sach="sach"
          :nxbs="nxbs"
          @borrow="handleBorrow"
        />
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">
          <i class="bi bi-chevron-left"></i> Trang trước
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages">
          Trang sau <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </section>

    <!-- FORM MƯỢN -->
    <BorrowForm
      v-if="showBorrowForm"
      :book="selectedSach"
      @close="showBorrowForm = false"
    />
  </div>
</template>


<script>
import SachCard from '@/components/SachCard.vue'
import InputSearch from '@/components/InputSearch.vue'
import BorrowForm from '@/components/BorrowForm.vue'
import { fetchBooks } from '@/services/sachService'
import { fetchNXB } from '@/services/nxbService'

export default {
  components: {
    SachCard,
    InputSearch,
    BorrowForm
  },
  data() {
    return {
      sachList: [],
      search: '',
      nxbs: [],
      currentPage: 1,
      pageSize: 12,
      selectedSach: null,
      showBorrowForm: false
    }
  },
  mounted() {
    this.loadBooks()
    this.loadNXBs()
  },
  computed: {
    filteredBooks() {
      return this.sachList.filter(book => {
        const keyword = this.search.normalize("NFC").toLowerCase().trim()
        const manxbValue = book.MANXB?._id || book.MANXB || ''
        const nxb = this.nxbs.find(n => String(n.MANXB).trim() === String(manxbValue).trim())
        const tenNXB = nxb ? nxb.TENNXB.normalize("NFC").toLowerCase() : ''
        return (
          book.TENSACH?.normalize("NFC").toLowerCase().includes(keyword) ||
          book.MASACH?.toLowerCase().includes(keyword) ||
          book.TACGIA?.toLowerCase().includes(keyword) ||
          (book.NAMXUATBAN?.toString() || '').toLowerCase().includes(keyword) ||
          tenNXB.includes(keyword)
        )
      })
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.pageSize)
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredBooks.slice(start, end)
    }
  },
  methods: {
    async loadBooks() {
      try {
        this.sachList = await fetchBooks()
      } catch (error) {
        console.error('Lỗi khi tải sách:', error)
      }
    },
    async loadNXBs() {
      try {
        this.nxbs = await fetchNXB()
      } catch (error) {
        console.error('Lỗi khi tải nhà xuất bản:', error)
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    handleBorrow(sach) {
      this.selectedSach = sach
      this.showBorrowForm = true
    }
  }
}
</script>

<style scoped>
.home-page {
  font-family: "Segoe UI", sans-serif;
  background: #f5f7fa;
}

/* ===== HERO SECTION ===== */
.hero {
  position: relative;
  height: 380px;
  background: url('../assets/banner.jpg') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 80px;
  border-bottom-right-radius: 80px;
  overflow: hidden;
}
.hero-overlay {
  background: rgba(0, 0, 0, 0.55);
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  color: white;
  width: 90%;
  max-width: 700px;
  backdrop-filter: blur(6px);
}
.hero-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.hero-subtitle {
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 25px;
  opacity: 0.9;
}

/* InputSearch (giả định có .input-group trong component) */
.input-group {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 40px;
  overflow: hidden;
  background: white;
  display: flex;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}
.input-group input {
  flex: 1;
  border: none;
  padding: 12px 18px;
  outline: none;
  font-size: 16px;
}
.input-group button {
  background: linear-gradient(135deg, #4a90e2, #2b5fb2);
  border: none;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 600;
}
.input-group button:hover {
  background: linear-gradient(135deg, #2b5fb2, #1f4690);
}

/* ===== THỐNG KÊ ===== */
.stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  text-align: center;
  margin: 50px auto;
  flex-wrap: wrap;
}
.stat-item h2 {
  font-size: 2rem;
  color: #2b5fb2;
  font-weight: 700;
}
.stat-item p {
  color: #555;
  margin-top: 6px;
  font-size: 1rem;
}

/* ===== DANH SÁCH SÁCH ===== */
.book-section {
  padding: 20px 60px 60px;
}
.section-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  position: relative;
}
.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #4a90e2, #2b5fb2);
  margin: 10px auto 0;
  border-radius: 2px;
}
.sach-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 28px;
  justify-content: center;
}

/* Thẻ sách nổi bật */
.sach-list .card {
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  overflow: hidden;
  background: white;
}
.sach-list .card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  filter: brightness(1.05);
}

/* ===== PHÂN TRANG ===== */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  gap: 10px;
}
.pagination button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #4a90e2, #2b5fb2);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
}
.pagination button:hover:not(:disabled) {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #2b5fb2, #1f4690);
}
.pagination button:disabled {
  background: #bbb;
}
.pagination span {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  .book-section {
    padding: 20px;
  }
  .stats {
    gap: 20px;
  }
}

</style>