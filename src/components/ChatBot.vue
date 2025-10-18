<template>
  <div class="chatbot-container" v-if="visible">
    <div class="chat-window">
      <div class="chat-header">
        <strong>📚 Trợ lý thư viện</strong>
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

const userInput = ref("");
const messages = ref([]);
const visible = ref(false);
const chatBody = ref(null);

// 🟢 Khi bấm mở chat → tự động gửi lời chào nếu chưa có tin nhắn
const toggleChat = async () => {
  visible.value = !visible.value;
  if (visible.value && messages.value.length === 0) {
    try {
      const reply = await askGemini(""); // gửi message rỗng để backend trả lời hướng dẫn
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
  display: inline-block; /* ✅ giúp chỉ bọc vừa nội dung */
  text-align: left; /* ✅ nội dung canh trái trong khung */
  align-self: flex-end; /* ✅ đẩy sang phải */
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
  line-height: 1.4; /* giảm khoảng cách dòng */
}

/* 🟢 Giảm khoảng cách giữa tiêu đề và danh sách */
.bot-msg p {
  margin: 0 0 6px 0;
  font-weight: 600;
  color: #003d99;
}

/* 🟢 Danh sách gọn gàng hơn */
.bot-msg ul {
  margin: 0;
  padding-left: 1rem; /* lùi nhẹ danh sách */
  list-style-type: disc;
}

/* 🟢 Các mục li đều nhau, khoảng cách nhỏ */
.bot-msg li {
  margin: 2px 0; /* giảm khoảng cách giữa các dòng */
  line-height: 1.3;
}

/* 🟢 Nhấn mạnh chữ đậm */
.bot-msg strong {
  color: #004aad;
}
</style>
<style>
.bot-msg ul {
  padding-left: 1rem !important;
}
</style>