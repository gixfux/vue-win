<template>
  <div id="ChatContent">
    <div class="chat-content">
      <div class="tip-message">项目正在完善中。。。</div>
      <div class="chat-messages">
        <div class="single-msg" :class="{'single-msg-right': message.userId === chatStore.currentUser.userId}" v-for="(message, index) in chatStore.messageGather[chatSocket.currentRoomId]" :key="index">
          <a-avatar :size="40" :src="chatStore.userGather[message.userId].avatar"></a-avatar>
          <div class="msg">{{ message.content }}</div>
        </div>
      </div>
    </div>

    <div class="chat-content-input">
      <div class="emoji-btn"></div>
      <div class="input-panel">
        <a-input-search v-model:value="messageContent" placeholder="input search text" enter-button="send" size="large" @search="sendMessage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatSocketStore } from '@/stores/chatSocket/chatSocket'
import { useChatStore } from '@/stores/chatStore'
import { onMounted, ref } from 'vue'

const chatStore = useChatStore()
const chatSocket = useChatSocketStore()
const messageContent = ref('123')
// let messageContentDom: HTMLElement

function sendMessage() {
  if (messageContent.value) {
    if (chatStore.currentRoom.type === 'user') {
      chatSocket.socket.emit('friendMessage', { userId: chatStore.currentUser.userId, friendId: chatStore.currentRoom.userId, content: messageContent.value, messageType: 'text' })
    } else {
      chatSocket.socket.emit('groupMessage', { userId: chatStore.currentUser.userId, groupId: chatStore.currentRoom.groupId, content: messageContent.value, messageType: 'text' })
    }
  }
}

onMounted(() => {})
</script>

<style scoped lang='scss'>
#ChatContent {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.5s ease-out;

  .chat-content {
    height: calc(100% - 50px);
    width: 100%;
    overflow: scroll;
    overflow-x: hidden;
    scroll-behavior: smooth;

    .tip-message {
      position: fixed;
      left: 50%;
      top: 20px;
      padding: 10px;
      border-radius: 10px;
      background: #000000;
    }

    .chat-messages {
      padding: 0 5px;

      .single-msg {
        height: 60px;
        display: flex;
        align-items: center;
        gap: 8px;

        .msg {
          color: black;
          background-color: #fff;
          font-size: medium;
          padding: 8px;
          border-radius: 7px;
        }
      }

      .single-msg-right {
        flex-direction: row-reverse;

        .msg {
          background-color: #ffe101;
        }
      }
    }
  }

  .chat-content-input {
    width: 100%;
    height: 50px;
    position: sticky;
    bottom: 0;
    background-color: #ffffff2c;
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    // justify-content: center;

    .emoji-btn {
      width: 10%;
      height: 100%;
    }

    .input-panel {
      width: 90%;
    }
  }
  .input-mask {
    height: 50px;
  }
}
</style>