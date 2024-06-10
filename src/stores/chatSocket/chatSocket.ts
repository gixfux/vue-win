import { defineStore } from 'pinia'
import { Socket, io } from 'socket.io-client'
import { useChatStore } from '../chatStore'

export const useChatSocketStore = defineStore('chatSocketStore', {
  state: () => {
    return {
      socket: {} as Socket
    }
  },
  getters: {
    currentRoomId: () => {
      return useChatStore().currentRoom.type === 'group' ? useChatStore().currentRoom.groupId : useChatStore().currentRoom.userId
    }
  },
  actions: {
    connectSocket() {
      const chatStore = useChatStore()
      console.log('connecting socket');
      this.socket = io(`${import.meta.env.VITE_WS_URL}?userId=${chatStore.currentUser.userId}`, {
        transports: ['websocket']
      })

      this.socket.on('connect', () => {
        console.log('连接成功');
        this.initSocketConnected()
      })

      this.socket.on('activeGroupUser', (data: any) => {
        console.log('activeGroupUser', data);
      })

      // 新建群组
      this.socket.on('addGroup', (data: any) => {
        console.log('addGroup', data);
      })

      // 加入群组
      this.socket.on('joinGroup', (data: any) => {
        console.log('joinGroup', data);
      })

      // 加入群组socket连接
      this.socket.on('joinGroupSocket', (data: any) => {
        console.log('joinGroupSocket', data);
      })

      // 发送群消息
      this.socket.on('groupMessage', (data: any) => {
        console.log('groupMessage', data);
        chatStore.messageGather[data.data.groupId].push(data.data)
      })

      // 加好友
      this.socket.on('addFriend', (data: any) => {
        console.log('addFriend', data);
      })

      //加入私聊socket连接
      this.socket.on('joinFriendSocket', (data: any) => {
        console.log('joinFriendSocket', data);
      })

      // 发送私聊消息
      this.socket.on('friendMessage', (data: any) => {
        console.log('friendMessage', data);
        chatStore.messageGather[data.data.userId]?.push(data.data)
        chatStore.messageGather[data.data.friendId]?.push(data.data)
      })

      // 退出群聊
      this.socket.on('exitGroup', (data: any) => {
        console.log('exitGroup', data);
      })

      // 删除好友
      this.socket.on('exitFriend', (data: any) => {
        console.log('exitFriend', data);
      })

      this.socket.on('connect_error', (error) => {
        console.log(error);
      })

    },

    initSocketConnected() {
      const chatStore = useChatStore()
      if (chatStore.friendGather.length > 0) {
        for (let i = 0; i < chatStore.friendGather.length; i++) {
          this.socket.emit('joinFriendSocket', { friendId: chatStore.friendGather[i].userId })
        }
      }

      if (chatStore.groupGather.length > 0) {
        for (let i = 0; i < chatStore.groupGather.length; i++) {
          this.socket.emit('joinGroupSocket', { groupId: chatStore.groupGather[i].groupId })
        }
      }
    }
  }
})