declare interface authDto {
  username: string
  password: string
  confirmPassword?: string
}

declare interface User {
  type: 'user'
  userId: string
  username: string
  avatar: string
  role: string
  tag: string
  createTime: number
}

declare interface Group {
  type: 'group'
  groupId: string
  userId: string
  groupName: string
  notice: string
  createTime: number
}

declare interface LoginRes {
  msg: string
  data: {
    token: string
    user: User
  },
  statusCode?: number
}

declare interface Message {
  id: number
  userId: string
  content: string
  messageType: string
  time: number
}

declare interface FriendMessage extends Message {
  friendId: string
}

declare interface GroupMessage extends Message {
  groupId: string
}

declare interface FriendData extends User {
  updateAt: number
  messages: FriendMessage[]
}

declare interface UserData extends FriendData {

}

declare interface GroupData extends Group {
  updateAt: number
  messages: GroupMessage[]
}

declare interface UserInfo {
  groupData: GroupData[]
  friendData: FriendData[]
  userData: UserData[]
}
