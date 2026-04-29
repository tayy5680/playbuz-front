import request from '@/api/request'

// 聊天室列表
export const getChatRoomList = () => {
  const url = 'Chat/ChatRoomList'
  const method = 'get'

  return request({
    method,
    url,
    noCache: true,
  })
}

// 聊天室房號
export const getChatGroup = ({ body }) => {
  const url = 'Chat/ChatGroup'
  const method = 'get'
  const data = {
    FriendID: body.friendID,
  }
  return request({
    method,
    url,
    data,
    noCache: true,
  })
}

// 聊天內容
export const getChatRoomText = ({ body }) => {
  const url = 'Chat/ChatRoomText'
  const method = 'get'
  const data = {
    GroupID: body.groupID,
    Skip: 0,
    Show: body.show ?? 100,
  }
  return request({
    method,
    url,
    data,
    noCache: true,
  })
}

// 已讀聊天室
export const postInitUnReadCount = ({ body }) => {
  const url = 'Chat/InitUnReadCount'
  const method = 'post'
  const data = {
    GroupID: body.groupID,
  }
  return request({
    method,
    url,
    data,
    noCache: true,
  })
}

// 送出聊天內容
export const postSendChatText = ({ body }) => {
  const url = 'Chat/SendChatText'
  const method = 'post'
  const data = {
    GroupID: body.groupID,
    Content: body.content,
  }
  return request({
    method,
    url,
    data,
    noCache: true,
  })
}

// 搜尋好友
export const getSearchFriend = ({ body }) => {
  const url = 'Friend/SearchFriend'
  const method = 'get'
  const data = {
    SearchKeyword: body.searchKeyword ?? '',
  }
  return request({
    method,
    url,
    data,
    noCache: true,
  })
}

// 新增好友
export const postFriendAdd = ({ body }) => {
  const url = 'Friend/FriendAdd'
  const method = 'post'
  const data = {
    FriendID: body.friendID,
    reCAPTCHA: body.recaptcha,
  }
  return request({
    method,
    url,
    data,
  })
}

// 刪除好友
export const delFriendDel = ({ body }) => {
  const url = 'Friend/FriendDel'
  const method = 'post'
  const data = {
    FriendID: body.friendID,
  }
  return request({
    method,
    url,
    data,
  })
}

// 確認好友
export const checkFriend = ({ body }) => {
  const url = 'Friend/CheckFriend'
  const method = 'post'
  const data = {
    FriendID: body.friendID,
  }
  return request({
    method,
    url,
    data,
  })
}

// 好友列表
export const getFriendList = () => {
  const url = 'Friend/FriendList'
  const method = 'get'

  return request({
    method,
    url,
    noCache: true,
  })
}

// 推薦好友列表
export const getFriendRecommendList = () => {
  const url = 'Friend/RecommendList'
  const method = 'get'

  return request({
    method,
    url,
  })
}

// 待確認好友列表
export const getFriendCheckList = () => {
  const url = 'Friend/CheckList'
  const method = 'get'

  return request({
    method,
    url,
  })
}
