<script setup>
import HeaderComponent from './components/HeaderView.vue'
import FooterComponent from './components/FooterView.vue'
import ChatBot from './components/ChatBot.vue'
</script>

<template>
  <div class="wrapper">
    <HeaderComponent />

    <main class="content">
      <div class="container mt-4">
        <router-view />
      </div>
    </main>


    <FooterComponent />
    <ChatBot />

  </div>
</template>

<style>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}
</style>
