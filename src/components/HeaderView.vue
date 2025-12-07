<template>
  <div class="header-bar">
    
    <div class="header-left">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <span class="store-name">H'Library</span>
    </div>

    
    <nav class="navbar-center">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Trang chủ</router-link>
        </li>

        <template v-if="userRole === 'docgia'">
          <!-- <li class="nav-item">
            <router-link class="nav-link" to="/muonsach"
              >Đăng ký Mượn Sách</router-link
            >
          </li> -->
          <li class="nav-item">
            <router-link class="nav-link" to="/lichsumuon"
              >Lịch Sử Mượn Sách</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/taikhoan"
              >Thông Tin Tài Khoản</router-link
            >
          </li>
        </template>

        <template v-else-if="userRole === 'quanly'">
          <li class="nav-item">
            <router-link class="nav-link" to="/theodoimuon"
              >Theo Dõi Mượn Sách</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/quanlysach"
              >Quản Lý Sách</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/quanlytaikhoan"
              >Quản Lý Tài Khoản</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/taikhoan"
              >Thông Tin Tài Khoản</router-link
            >
          </li>
        </template>

        <template v-else-if="userRole === 'nhanvien'">
          <li class="nav-item">
            <router-link class="nav-link" to="/theodoimuon"
              >Theo Dõi Mượn Sách</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/taikhoan"
              >Thông Tin Tài Khoản</router-link
            >
          </li>
        </template>

        <template v-else>
          <li class="nav-item">
            <router-link class="nav-link" to="/logindocgia"
              >Đăng nhập</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register">Đăng ký</router-link>
          </li>
        </template>

        <li class="nav-item" v-if="userRole">
          <router-link
            class="nav-link logout"
            to="/logout"
            @click="handleLogout"
          >
            Đăng Xuất
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  computed: {
    userRole() {
      return this.$store.state.user.role;
    },
  },
  methods: {
    async handleLogout() {
      try {
        const user = this.$store.state.user;

        if (user && user._id) {
          // 🧹 Gọi API reset lịch sử chat trên server
          await fetch("http://localhost:3000/api/chatbot/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ docGiaId: user._id }),
          });
        }

        // 🧽 Xóa cache/lịch sử chat lưu trong trình duyệt (nếu có)
        localStorage.removeItem("chatHistory");
        sessionStorage.removeItem("chatHistory");

        // 🚪 Gọi action logout từ Vuex
        await this.$store.dispatch("logout");

        // 🔁 Chuyển hướng về trang đăng nhập
        this.$router.push("/logindocgia");
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
      }
    },

  },

};
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-image: linear-gradient(to top, #761ab4, #5f14a2, #490e90, #32087e, #1a036c);
  padding: 12px 40px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Bên trái: logo và tên */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 48px;
  width: 48px;
  border-radius: 10px;
  object-fit: cover;
  background-color: #fff;
  padding: 4px;
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.1);
}

.store-name {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* Navbar bên phải */
.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 22px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: #f5f7fa !important;
  font-weight: 500;
  font-size: 15px;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.25s ease-in-out;
  text-decoration: none;
  position: relative;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 6px;
  transform: translateX(-50%);
  width: 0%;
  height: 2px;
  background-color: #88b0f0;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 70%;
}

.nav-link:hover {
  color: #ffffff !important;
  background-color: rgba(136, 176, 240, 0.15);
  transform: translateY(-1px);
}

/* Nút Đăng xuất */
.logout {
  color: #fff !important;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 18px;
  transition: all 0.3s ease;
  text-decoration: none;
  margin-left: 50px;
}

.logout:hover {
  background-color: #d42525;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(229, 57, 53, 0.6);
}

</style>
