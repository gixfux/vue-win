import { initUserData } from '@/api/apis/modules/user'
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chatStore', {
  state: () => {
    return {
      friendGather: [] as FriendData[],
      groupGather: [] as GroupData[],
      userGather: {} as { [key: string]: UserData | User },
      roomGather: [] as Array<FriendData | GroupData>,
      messageGather: {} as { [key: string]: Array<FriendMessage | GroupMessage> },
      currentRoom: {} as (GroupData | FriendData),
      currentUser: {} as User
    }
  },
  actions: {
    initFriendGather(friendData: FriendData[]) {
      friendData.forEach(item => {
        item.avatar = import.meta.env.VITE_AVATAR_URL + item.avatar
        item.updateAt = item.messages ? item.messages[0].time : ((item.messages = []) && 0)
        item.type = 'user'
        item.messages.reverse()
      })
      this.friendGather = friendData.sort((a, b) => b.updateAt! - a.updateAt!)
    },

    initGroupGather(groupData: GroupData[]) {
      groupData.forEach(item => {
        item.updateAt = item.messages ? item.messages[0].time : ((item.messages = []) && 0)
        item.type = 'group'
        item.messages.reverse()
        if (item.groupName === '公共聊天室') {
          this.currentRoom = item
        }
      })
      this.groupGather = groupData.sort((a, b) => b.updateAt! - a.updateAt!)
    },

    initUserGather(userData: UserData[]) {
      userData.forEach(item => {
        item.avatar = import.meta.env.VITE_AVATAR_URL + item.avatar
        this.userGather[item.userId] = item
      })
      this.userGather[this.currentUser.userId] = this.currentUser
    },

    initMessageGather() {
      this.roomGather.forEach((room) => {
        // @ts-ignore
        const roomId: string = room.groupId ? room.groupId : room.userId
        this.messageGather[roomId] = room.messages
      })
    },

    async initRoomGather() {
      const res: { data: UserInfo } = await initUserData()
      console.log(res);


      this.initFriendGather(res.data.friendData)
      this.initGroupGather(res.data.groupData)
      this.initUserGather(res.data.userData)
      this.roomGather = [...this.groupGather, ...this.friendGather].sort((a, b) => b.updateAt! - a.updateAt!)
      this.initMessageGather()
    }
  }
})