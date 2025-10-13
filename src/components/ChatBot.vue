<template>
  <div class="chatbot-container" v-if="visible">
    <div class="chat-window">
      <div class="chat-header">
        <strong>📚 Trợ lý thư viện</strong>
        <button @click="visible = false" class="close-btn">×</button>
      </div>

      <div class="chat-body" ref="chatBody">
        <div v-for="(msg, index) in messages" :key="index" :class="msg.role">
          <p>{{ msg.text }}</p>
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

  <button class="chat-toggle" @click="visible = !visible" v-if="!visible">
    💬
  </button>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { askGemini } from "@/services/chatbot.js"; // dùng service riêng

const userInput = ref("");
const messages = ref([]);
const visible = ref(false);
const chatBody = ref(null);

const sendMessage = async () => {
  const text = userInput.value.trim();
  if (!text) return;

  messages.value.push({ role: "user", text });
  userInput.value = "";

  await nextTick(() => {
    chatBody.value.scrollTop = chatBody.value.scrollHeight;
  });

  try {
    const reply = await askGemini(
      `Bạn là trợ lý thư viện, hãy trả lời bằng tiếng Việt ngắn gọn, rõ ràng.\nNgười dùng hỏi: ${text}`
    );

    messages.value.push({ role: "bot", text: reply });

    await nextTick(() => {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    });
  } catch (err) {
    console.error("Lỗi chatbot:", err);
    messages.value.push({
      role: "bot",
      text: "Có lỗi khi kết nối tới Gemini API!",
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
</style>
