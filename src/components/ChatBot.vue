<!-- <template>
  <div class="chatbot-container" v-if="visible">
    <div class="chat-window">
      <div class="chat-header">
        <strong>Trợ lý ảo thư viện NNH</strong>
        <button @click="visible = false" class="close-btn">×</button>
      </div>

      <div class="chat-body" ref="chatBody">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="msg.role"
        >
          <div v-if="msg.role === 'bot'" class="bot-msg" v-html="msg.text"></div>
          <div v-else class="user-msg">{{ msg.text }}</div>

        </div>
      </div>

      <div class="chat-input">
        <input
          v-model="userInput"
          placeholder="Nhập câu hỏi..."
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage">Gửi</button>
      </div>
    </div>
  </div>

  <button class="chat-toggle" @click="toggleChat" v-if="!visible">
    💬
  </button>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
import { askGemini } from "@/services/chatbot.js";
import { onMounted } from "vue";
import axios from "axios";

const userInput = ref("");
const messages = ref([]);
const visible = ref(false);
const chatBody = ref(null);


const toggleChat = async () => {
  visible.value = !visible.value;
  if (visible.value && messages.value.length === 0) {
    try {
      const reply = await askGemini("");
      messages.value.push({ role: "bot", text: reply });

      await nextTick(() => {
        chatBody.value.scrollTop = chatBody.value.scrollHeight;
      });
    } catch (error) {
      console.error("⚠️ Lỗi khi tải lời chào:", error);
    }
  }
};

const sendMessage = async () => {
  const text = userInput.value.trim();
  if (!text) return;

  messages.value.push({ role: "user", text });
  userInput.value = "";

  await nextTick(() => {
    chatBody.value.scrollTop = chatBody.value.scrollHeight;
  });

  try {
    const currentUser = JSON.parse(localStorage.getItem("docgia"));
    const docGiaId = currentUser?.MADOCGIA || null;
    const docGiaMongoId = currentUser?._id || null;

    const reply = await askGemini(text, docGiaId, docGiaMongoId);
    messages.value.push({ role: "bot", text: reply });

    await nextTick(() => {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    });
  } catch (err) {
    console.error("Lỗi chatbot:", err);
    messages.value.push({
      role: "bot",
      text: "⚠️ Có lỗi khi kết nối tới chatbot!",
    });
  }
};



onMounted(() => {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".borrow-btn");
    if (btn) {
      const bookName = btn.getAttribute("data-book");
      const currentUser = JSON.parse(localStorage.getItem("docgia"));
      const docGiaId = currentUser?.MADOCGIA || null;

      if (!docGiaId) {
        alert("Bạn cần đăng nhập để mượn sách.");
        return;
      }

      try {
        // Gọi API backend để mượn trực tiếp
        const res = await axios.post("http://localhost:3000/api/theodoi/dangKyMuonSach", {
          docGiaID: docGiaId,
          MASACH: "S001", // lấy mã sách thực tế từ DB
          SOQUYEN: 1,
          NGAYMUON: new Date(),
        });

        alert(`${res.data.message || "Mượn sách thành công!"}`);
      } catch (error) {
        console.error("Lỗi khi mượn sách:", error);
        alert("Không thể mượn sách. Vui lòng thử lại sau.");
      }
    }
  });
});

</script>

<style scoped>
.chat-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  height: 420px;
  background: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.chat-header {
  background: #007bff;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  font-size: 14px;
}

.chat-body .user {
  text-align: right;
  color: #333;
}

.chat-body .bot {
  text-align: left;
  color: #007bff;
}

.chat-body .bot ul {
  padding-left: 1rem !important;
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
}

.chat-body .bot-msg ul {
  padding-left: 1rem;
}

.chat-input {
  display: flex;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex: 1;
  border: none;
  padding: 10px;
  outline: none;
}

.chat-input button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
}

.close-btn {
  background: none;
  color: white;
  font-size: 18px;
  border: none;
  cursor: pointer;
}

.chat-body .bot p,
.chat-body .bot div {
  background: #e9f2ff;
  display: inline-block;
  padding: 8px 12px;
  border-radius: 10px;
  margin: 5px 0;
  max-width: 90%;
  text-align: left;
  white-space: pre-line;
}

.chat-body .user p {
  background: #dcf8c6;
  display: inline-block;
  padding: 8px 12px;
  border-radius: 10px;
  margin: 5px 0;
  max-width: 90%;
  text-align: right;
}

.user-msg {
  background: #dcf8c6;
  color: #1e2a1f;
  padding: 10px 14px;
  border-radius: 16px 16px 0 16px;
  margin: 6px 0;
  max-width: 80%;
  display: inline-block; 
  text-align: left; 
  align-self: flex-end;
  word-break: break-word;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.bot-msg {
  background: #e9f2ff;
  color: #2c3e50;
  padding: 10px 14px;
  border-radius: 12px 12px 12px 0;
  margin: 6px 0;
  max-width: 85%;
  text-align: left;
  box-shadow: 0 1px 4px rgba(0, 123, 255, 0.15);
  line-height: 1.4;
}

.bot-msg p {
  margin: 0 0 6px 0;
  font-weight: 600;
  color: #003d99;
}

.bot-msg ul {
  margin: 0;
  padding-left: 1rem;
  list-style-type: disc;
}

.bot-msg li {
  margin: 2px 0;
  line-height: 1.3;
}


.bot-msg strong {
  color: #004aad;
}
</style>
<style>
.bot-msg ul {
  padding-left: 1rem !important;
}

</style> -->

<template>
  <div class="chatbot-container" v-if="visible">
    <div class="chat-window">
      <div class="chat-header">
        <strong>Trợ lý ảo thư viện NNH</strong>
        <button @click="visible = false" class="close-btn">×</button>
      </div>

      <div class="chat-body" ref="chatBody">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="msg.role"
        >
          <div v-if="msg.role === 'bot'" class="bot-msg" v-html="msg.text"></div>
          <div v-else class="user-msg">{{ msg.text }}</div>
        </div>
        
        <!-- Loading khi đang mượn sách -->
        <div v-if="isBorrowing" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>Đang xử lý mượn sách...</p>
        </div>
      </div>

      <div class="chat-input">
        <input
          v-model="userInput"
          placeholder="Nhập câu hỏi..."
          @keyup.enter="sendMessage"
          :disabled="isBorrowing"
        />
        <button @click="sendMessage" :disabled="isBorrowing">Gửi</button>
      </div>
    </div>
  </div>

  <button class="chat-toggle" @click="toggleChat" v-if="!visible">
    💬
  </button>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, onUnmounted } from "vue";
import { askGemini } from "@/services/chatbot.js";
import axios from "axios";

const userInput = ref("");
const messages = ref([]);
const visible = ref(false);
const chatBody = ref(null);
const isBorrowing = ref(false);

const toggleChat = async () => {
  visible.value = !visible.value;
  if (visible.value && messages.value.length === 0) {
    try {
      const reply = await askGemini("");
      messages.value.push({ role: "bot", text: reply });

      await nextTick(() => {
        chatBody.value.scrollTop = chatBody.value.scrollHeight;
      });
    } catch (error) {
      console.error("⚠️ Lỗi khi tải lời chào:", error);
    }
  }
};

const sendMessage = async () => {
  const text = userInput.value.trim();
  if (!text || isBorrowing.value) return;

  messages.value.push({ role: "user", text });
  userInput.value = "";

  await nextTick(() => {
    chatBody.value.scrollTop = chatBody.value.scrollHeight;
  });

  try {
    const currentUser = JSON.parse(localStorage.getItem("docgia"));
    const docGiaId = currentUser?.MADOCGIA || null;
    const docGiaMongoId = currentUser?._id || null;

    const reply = await askGemini(text, docGiaId, docGiaMongoId);
    messages.value.push({ role: "bot", text: reply });

    await nextTick(() => {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    });
  } catch (err) {
    console.error("Lỗi chatbot:", err);
    messages.value.push({
      role: "bot",
      text: "⚠️ Có lỗi khi kết nối tới chatbot!",
    });
  }
};

const handleBorrowBook = async (bookName, masach, sachId) => {
  const currentUser = JSON.parse(localStorage.getItem("docgia"));
  const docGiaMongoId = currentUser?._id || null;

  if (!docGiaMongoId) {
    alert("⚠️ Bạn cần đăng nhập để mượn sách.");
    return;
  }

  if (!confirm(`Bạn có chắc muốn mượn sách "${bookName}" không?`)) {
    return;
  }

  isBorrowing.value = true;

  try {
    // ⚠️ QUAN TRỢNG: Kiểm tra xem masach là MASACH hay _id
    // Nếu masach là ObjectId (24 ký tự hex), cần lấy MASACH thực từ API
    
    let maSachChuan = masach;
    
    // Kiểm tra nếu masach là ObjectId (định dạng MongoDB _id)
    if (/^[0-9a-fA-F]{24}$/.test(masach)) {
      console.warn(`⚠️ masach "${masach}" có vẻ là ObjectId, cần lấy MASACH thực tế`);
      
      // Gọi API để lấy thông tin sách và lấy MASACH
      try {
        const sachInfo = await axios.get(`http://localhost:3000/api/sach/${masach}`);
        if (sachInfo.data && sachInfo.data.MASACH) {
          maSachChuan = sachInfo.data.MASACH;
          console.log(`✅ Đã chuyển đổi từ _id sang MASACH: ${masach} -> ${maSachChuan}`);
        }
      } catch (sachError) {
        console.error("❌ Không thể lấy thông tin MASACH từ API:", sachError);
        // Vẫn tiếp tục với masach gốc
      }
    }

    console.log('📤 Dữ liệu gửi đi:', {
      docGiaID: docGiaMongoId,
      MASACH: maSachChuan,  // Dùng MASACH đã chuyển đổi
      SOQUYEN: 1,
      NGAYMUON: new Date().toISOString().split('T')[0],
      bookName: bookName
    });

    // Gọi API mượn sách
    const res = await axios.post("http://localhost:3000/api/theodoi/dangKyMuonSach", {
      docGiaID: docGiaMongoId,
      MASACH: maSachChuan,      // Dùng MASACH đã xử lý
      SOQUYEN: 1,
      NGAYMUON: new Date().toISOString().split('T')[0]
    });

    console.log('📥 Phản hồi từ server:', res.data);

    // ⚠️ SỬA: Kiểm tra response theo cấu trúc thực tế từ BE
    if (res.data && res.data.message) {
      // Hiển thị thông báo thành công bằng ALERT
      const alertMessage = `✅ ${res.data.message}\n\n` +
                          `📖 Sách: ${bookName}\n` +
                          `🔢 Mã sách: ${maSachChuan}\n` +
                          `📅 Ngày mượn: ${new Date().toLocaleDateString('vi-VN')}\n` +
                          `🔄 Trạng thái: ${res.data.theodoi?.trangThai || 'Chờ duyệt'}\n` +
                          `🔖 Mã phiếu: ${res.data.theodoi?._id || 'Đang xử lý'}\n\n` +
                          `Cảm ơn bạn đã sử dụng dịch vụ thư viện! 📚`;
      
      alert(alertMessage);
      
      // KHÔNG thêm vào messages nữa, chỉ alert
      // Bạn có thể thêm một tin nhắn ngắn gọn vào chat nếu muốn
      const simpleSuccessMsg = `✅ Tôi đã đặt mượn sách "${bookName}" thành công!`;
      messages.value.push({ role: "bot", text: simpleSuccessMsg });

    } else {
      throw new Error(res.data.message || 'Đã xảy ra lỗi không xác định');
    }

    // Cuộn xuống cuối
    await nextTick(() => {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    });

  } catch (error) {
    console.error("Lỗi khi mượn sách:", error);
    
    let errorMessage = "Không thể mượn sách. Vui lòng thử lại sau.";
    
    if (error.response && error.response.data) {
      const serverError = error.response.data;
      console.error('❌ Lỗi từ server:', serverError);
      errorMessage = serverError.message || serverError.error || errorMessage;
      
      // Hiển thị chi tiết lỗi từ server
      if (serverError.errors) {
        errorMessage += `\nChi tiết: ${JSON.stringify(serverError.errors)}`;
      }
    } else if (error.request) {
      errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
    } else {
      errorMessage = error.message || errorMessage;
    }

    // Hiển thị lỗi bằng ALERT
    alert(`❌ Lỗi: ${errorMessage}`);
    
    // Vẫn hiển thị lỗi trong chat để người dùng biết
    messages.value.push({
      role: "bot",
      text: `<div class="borrow-error">❌ <strong>Lỗi khi mượn sách:</strong> ${errorMessage}</div>`
    });

    await nextTick(() => {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    });
  } finally {
    isBorrowing.value = false;
  }
};

// const handleBorrowBook = async (bookName, masach, sachId) => {
//   const currentUser = JSON.parse(localStorage.getItem("docgia"));
//   const docGiaMongoId = currentUser?._id || null;

//   if (!docGiaMongoId) {
//     alert("⚠️ Bạn cần đăng nhập để mượn sách.");
//     return;
//   }

//   if (!confirm(`Bạn có chắc muốn mượn sách "${bookName}" không?`)) {
//     return;
//   }

//   isBorrowing.value = true;

//   try {
//     // ⚠️ QUAN TRỢNG: Kiểm tra xem masach là MASACH hay _id
//     // Nếu masach là ObjectId (24 ký tự hex), cần lấy MASACH thực từ API
    
//     let maSachChuan = masach;
    
//     // Kiểm tra nếu masach là ObjectId (định dạng MongoDB _id)
//     if (/^[0-9a-fA-F]{24}$/.test(masach)) {
//       console.warn(`⚠️ masach "${masach}" có vẻ là ObjectId, cần lấy MASACH thực tế`);
      
//       // Gọi API để lấy thông tin sách và lấy MASACH
//       try {
//         const sachInfo = await axios.get(`http://localhost:3000/api/sach/${masach}`);
//         if (sachInfo.data && sachInfo.data.MASACH) {
//           maSachChuan = sachInfo.data.MASACH;
//           console.log(`✅ Đã chuyển đổi từ _id sang MASACH: ${masach} -> ${maSachChuan}`);
//         }
//       } catch (sachError) {
//         console.error("❌ Không thể lấy thông tin MASACH từ API:", sachError);
//         // Vẫn tiếp tục với masach gốc
//       }
//     }

//     console.log('📤 Dữ liệu gửi đi:', {
//       docGiaID: docGiaMongoId,
//       MASACH: maSachChuan,  // Dùng MASACH đã chuyển đổi
//       SOQUYEN: 1,
//       NGAYMUON: new Date().toISOString().split('T')[0],
//       bookName: bookName
//     });

//     // Gọi API mượn sách
//     const res = await axios.post("http://localhost:3000/api/theodoi/dangKyMuonSach", {
//       docGiaID: docGiaMongoId,
//       MASACH: maSachChuan,      // Dùng MASACH đã xử lý
//       SOQUYEN: 1,
//       NGAYMUON: new Date().toISOString().split('T')[0]
//     });

//     console.log('📥 Phản hồi từ server:', res.data);

//     // Kiểm tra response
//     if (res.data && res.data.success) {
//       // Hiển thị thông báo thành công
//       const successMessage = `
//       <div class="borrow-success">
//         ✅ <strong>Mượn sách thành công!</strong><br>
//         <strong>Sách:</strong> ${bookName}<br>
//         <strong>Mã sách:</strong> ${maSachChuan}<br>
//         <strong>Ngày mượn:</strong> ${new Date().toLocaleDateString('vi-VN')}<br>
//         <strong>Trạng thái:</strong> ${res.data.data.trangThai || 'Chờ duyệt'}<br>
//         <strong>Mã phiếu:</strong> ${res.data.data._id}<br><br>
//         Cảm ơn bạn đã sử dụng dịch vụ thư viện! 📚
//       </div>
//       `;

//       messages.value.push({ role: "bot", text: successMessage });
//     } else {
//       throw new Error(res.data.message || 'Đã xảy ra lỗi không xác định');
//     }

//     // Cuộn xuống cuối
//     await nextTick(() => {
//       chatBody.value.scrollTop = chatBody.value.scrollHeight;
//     });

//   } catch (error) {
//     console.error("Lỗi khi mượn sách:", error);
    
//     let errorMessage = "Không thể mượn sách. Vui lòng thử lại sau.";
    
//     if (error.response && error.response.data) {
//       const serverError = error.response.data;
//       console.error('❌ Lỗi từ server:', serverError);
//       errorMessage = serverError.message || serverError.error || errorMessage;
      
//       // Hiển thị chi tiết lỗi từ server
//       if (serverError.errors) {
//         errorMessage += `<br>Chi tiết: ${JSON.stringify(serverError.errors)}`;
//       }
//     } else if (error.request) {
//       errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
//     } else {
//       errorMessage = error.message || errorMessage;
//     }

//     messages.value.push({
//       role: "bot",
//       text: `<div class="borrow-error">❌ <strong>Lỗi:</strong> ${errorMessage}</div>`
//     });

//     await nextTick(() => {
//       chatBody.value.scrollTop = chatBody.value.scrollHeight;
//     });
//   } finally {
//     isBorrowing.value = false;
//   }
// };

// Hàm xử lý click trên toàn bộ chat
const handleGlobalClick = (event) => {
  const btn = event.target.closest(".borrow-btn");
  if (btn) {
    const bookName = btn.getAttribute("data-book");
    const masach = btn.getAttribute("data-masach");
    const sachId = btn.getAttribute("data-sachid");
    
    if (bookName && masach) {
      handleBorrowBook(bookName, masach, sachId);
    }
  }
};

onMounted(() => {
  // Thêm event listener khi component được mount
  document.addEventListener("click", handleGlobalClick);
});

onUnmounted(() => {
  // Xóa event listener khi component bị unmount
  document.removeEventListener("click", handleGlobalClick);
});

</script>

<style scoped>
.chat-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1001;
}

.chat-window {
  width: 320px;
  height: 420px;
  background: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.chat-header {
  background: #007bff;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  font-size: 14px;
  position: relative;
}

.chat-body .user {
  text-align: right;
  color: #333;
}

.chat-body .bot {
  text-align: left;
  color: #007bff;
}

.chat-body .bot ul {
  padding-left: 1rem !important;
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
}

.chat-body .bot-msg ul {
  padding-left: 1rem;
}

.chat-input {
  display: flex;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex: 1;
  border: none;
  padding: 10px;
  outline: none;
}

.chat-input button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
}

.chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.chat-input input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.close-btn {
  background: none;
  color: white;
  font-size: 18px;
  border: none;
  cursor: pointer;
}

.chat-body .bot p,
.chat-body .bot div {
  background: #e9f2ff;
  display: inline-block;
  padding: 8px 12px;
  border-radius: 10px;
  margin: 5px 0;
  max-width: 90%;
  text-align: left;
  white-space: pre-line;
}

.chat-body .user p {
  background: #dcf8c6;
  display: inline-block;
  padding: 8px 12px;
  border-radius: 10px;
  margin: 5px 0;
  max-width: 90%;
  text-align: right;
}

.user-msg {
  background: #dcf8c6;
  color: #1e2a1f;
  padding: 10px 14px;
  border-radius: 16px 16px 0 16px;
  margin: 6px 0;
  max-width: 80%;
  display: inline-block; 
  text-align: left; 
  align-self: flex-end;
  word-break: break-word;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.bot-msg {
  background: #e9f2ff;
  color: #2c3e50;
  padding: 10px 14px;
  border-radius: 12px 12px 12px 0;
  margin: 6px 0;
  max-width: 85%;
  text-align: left;
  box-shadow: 0 1px 4px rgba(0, 123, 255, 0.15);
  line-height: 1.4;
}

.bot-msg p {
  margin: 0 0 6px 0;
  font-weight: 600;
  color: #003d99;
}

.bot-msg ul {
  margin: 0;
  padding-left: 1rem;
  list-style-type: disc;
}

.bot-msg li {
  margin: 2px 0;
  line-height: 1.3;
}

.bot-msg strong {
  color: #004aad;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Style cho nút mượn sách */
.bot-msg .borrow-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: background 0.3s;
}

.bot-msg .borrow-btn:hover {
  background: #218838;
}

/* Style cho thông báo mượn sách */
.borrow-success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
}

.borrow-error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
}
</style>

<style>
.bot-msg ul {
  padding-left: 1rem !important;
}

/* Style cho nút mượn sách trong HTML trả về từ bot */
.borrow-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  display: inline-block;
  transition: background 0.3s;
}

.borrow-btn:hover {
  background: #218838;
}

.borrow-btn:active {
  transform: scale(0.98);
}
</style>