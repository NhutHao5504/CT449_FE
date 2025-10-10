<template>
  <div class="book-management-container">
    <h1>📚 Quản Lý Sách</h1>

    <!-- Nhóm tìm kiếm và nút -->
    <div class="controls-group">
      <InputSearch v-model="search" placeholder="🔍 Tìm kiếm theo tên, mã, tác giả..." />

      <div class="button-group">
        <button @click="openBookForm(null)" class="btn btn-add">
          ➕ Thêm Sách Mới
        </button>
        <button @click="showNxbForm = true" class="btn btn-publisher">
          🏢 Thêm Nhà Xuất Bản
        </button>
      </div>
    </div>

    <!-- Form thêm/sửa -->
    <SachForm
      v-if="showBookForm"
      :book="selectedBook"
      :nxbList="nxbs"
      @submit="saveBook"
      @cancel="closeBookForm"
      :key="selectedBook?._id || 'new'"
    />

    <!-- Form thêm NXB -->
    <NxbForm
      v-if="showNxbForm"
      @submit="saveNxb"
      @cancel="showNxbForm = false"
    />

    <!-- Danh sách sách -->
    <SachList
      :books="filteredBooks"
      :nxbs="nxbs"
      @edit="openBookForm"
      @delete="deleteBook"
    />
  </div>
</template>

<script>
  import InputSearch from '@/components/InputSearch.vue'
  import SachForm from '@/components/SachForm.vue'
  import NxbForm from '@/components/NxbForm.vue'
  import SachList from '@/components/SachList.vue'
  import {
    fetchBooks,
    createBook,
    updateBook,
    deleteBook
  } from '@/services/sachService'
  import { fetchNXB, createNXB } from '@/services/nxbService'

  export default {
    components: { SachForm, NxbForm, SachList, InputSearch },
    data() {
      return {
        search: '',
        books: [],
        nxbs: [],
        showBookForm: false,
        showNxbForm: false,
        selectedBook: null,
        formKey: 0,
        saving: false
      }
    },
    computed: {
      filteredBooks() {
        return this.books.filter(book => {
          const TENSACH = book.TENSACH ? book.TENSACH.toLowerCase() : ''
          const MASACH = book.MASACH ? book.MASACH.toLowerCase() : ''
          const TACGIA = book.TACGIA
            ? book.TACGIA.trim().toLowerCase()
            : ''
          const keyword = this.search.normalize("NFC").toLowerCase().trim();

          const MANXBValue = book.MANXB || ''
          const nxb = this.nxbs.find(n => String(n.MANXB) === String(MANXBValue))
          const TENNXB = nxb ? nxb.TENNXB.toLowerCase() : ''

          return (
            TENSACH.includes(keyword) ||
            MASACH.includes(keyword) ||
            TENNXB.includes(keyword) ||
            TACGIA.includes(keyword)
          )
        })
      }
    },
    methods: {
      async loadBooks() {
        try {
          this.books = await fetchBooks()
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
      getNXBName(MANXB) {
        if (!MANXB || !this.nxbs) return 'Chưa có NXB';

        const manxbValue = typeof MANXB === 'object' ? MANXB.toString() : String(MANXB);

        const nxb = this.nxbs.find(n => 
          String(n.MANXB) === manxbValue || String(n._id) === manxbValue
        );

        return nxb ? nxb.TENNXB : 'Không tìm thấy';
      },
      async openBookForm(book) {
        await this.loadNXBs()
        this.selectedBook = book ? { ...book } : null
        this.showBookForm = true
      },
      closeBookForm() {
        this.selectedBook = null
        this.showBookForm = false
      },
      async saveBook(book) {
        try {
          if (this.saving) return;
          this.saving = true;

          if (book._id) {
            await updateBook(book);
            alert('Cập nhật sách thành công!');
          } else {
              console.log('Dữ liệu gửi để tạo mới:', book);

            const newBook = await createBook(book);
            if (!newBook) {
              throw new Error('Không nhận được dữ liệu từ API sau khi thêm sách!');
            }
            alert('Thêm sách mới thành công!');
          }

          this.closeBookForm();
          await this.loadBooks();
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
          alert(`Không thể lưu sách. Vui lòng thử lại.\nChi tiết: ${errorMessage}`);
        } finally {
          this.saving = false;
          this.selectedBook = null;
        }
      },

      async saveNxb(nxb) {
        try {
          const newNXB = await createNXB(nxb)
          this.nxbs.push(newNXB)
          alert('Thêm nhà xuất bản mới thành công!')
          this.showNxbForm = false
        } catch (error) {
          console.error('Lỗi khi thêm nhà xuất bản:', error)
        }
      },
      async deleteBook(id) {
        try {
          await deleteBook(id)
          alert('Xóa sách thành công!')
          await this.loadBooks()
          this.loadBooks()
        } catch (error) {
          console.error('Lỗi khi xóa sách:', error)
        }
      }
    },
    created() {
      this.loadBooks()
      this.loadNXBs()
    }
  }
</script>

<style scoped>
.book-management-container {
  padding: 40px;
  max-width: 1100px;
  margin: 20px auto;
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", sans-serif;
}

h1 {
  font-size: 32px;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 25px;
  font-weight: 700;
  letter-spacing: 1px;
  border-bottom: 3px solid #3498db;
  display: inline-block;
  padding-bottom: 8px;
}

/* === Nhóm điều khiển === */
.controls-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* === Nút chung === */
button {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  padding: 10px 18px;
  min-width: 150px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
}

/* === Nút thêm sách === */
.btn-add {
  background: linear-gradient(90deg, #27ae60, #1e8449);
}

.btn-add:hover {
  background: linear-gradient(90deg, #1e8449, #145a32);
}

/* === Nút thêm NXB === */
.btn-publisher {
  background: linear-gradient(90deg, #3498db, #21618c);
}

.btn-publisher:hover {
  background: linear-gradient(90deg, #21618c, #154360);
}

/* === Responsive === */
@media (max-width: 768px) {
  .controls-group {
    flex-direction: column;
    align-items: stretch;
  }
  .button-group {
    justify-content: center;
  }
  button {
    width: 100%;
  }
}
</style>
