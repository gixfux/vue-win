<template>
  <div id="chat-room">
    <div class="chat-left">
      <ul class="chat-list">
        <li class="chat-item" v-for="(room,index) in chatStore.roomGather" :key="index" @click="changeActiveRoom(room)">
          <div v-if="room.type === 'user'" class="chat-single-room" :class="{'active-room':chatStore.currentRoom.type === 'user' ? chatStore.currentRoom.userId === room.userId ? true : false : false}">
            <a-avatar :size="40" :src="room.avatar">
            </a-avatar>
            <div>{{ room.username }}</div>
          </div>
          <div v-if="room.type === 'group'" class="chat-single-room" :class="{'active-room':chatStore.currentRoom.type === 'group' ? chatStore.currentRoom.groupId === room.groupId ? true : false : false}">
            <a-avatar style="background-color:aquamarine; font-weight: 700; font-size: 25px;" :size="40">G</a-avatar>
            <div>{{ room.groupName }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="chat-right">
      <ChatContent></ChatContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chatStore'
import ChatContent from './ChatContent.vue'

const chatStore = useChatStore()

function changeActiveRoom(room: FriendData | GroupData) {
  // @ts-ignore
  chatStore.currentRoom = room
}
</script>

<style scoped lang='scss'>
#chat-room {
  width: 100%;
  height: 100%;
  color: white;
  display: flex;

  .chat-left {
    width: 200px;
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    background-color: #ffffff2c;
    backdrop-filter: blur(5px);

    .chat-list {
      .chat-item {
        border-radius: 7px;
        transition: background-color 0.2s linear;

        .chat-single-room {
          display: flex;
          width: 100%;
          gap: 10px;
          align-items: center;
          padding: 5px 0 0 5px;
          height: 60px;
        }

        &:hover {
          background-color: #00000069;
        }
      }

      .active-room {
        background-color: #00000067;
      }
    }
  }

  .chat-right {
    width: calc(100% - 200px);
    height: 100%;
  }
}
</style>