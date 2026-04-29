import request from '@/api/request'

export const gameList = inputData => {
  const url = 'Game/GameList'
  const method = 'get'
  const data = {
    Locale: inputData.locale
  }

  return request({
    method,
    url,
    data
  })
}

export const gameInfo = inputData => {
  const url = 'Game/GameInfo'
  const method = 'get'
  const data = {
    GameID: inputData.gameID ?? '',
    Locale: inputData.locale
  }

  return request({
    method,
    url,
    data
  })
}

export const hotGameList = inputData => {
  const url = 'Game/HomeHotGame'
  const method = 'get'
  const data = {
    Locale: inputData.locale
  }

  return request({
    method,
    url,
    data
  })
}

export const recommendGame = () => {
  const url = 'Game/RecommendGame'
  const method = 'get'

  return request({
    method,
    url
  })
}

export const gameLink = ({ body }) => {
  const url = 'Game/GameLink'
  const method = 'get'
  const data = {
    Platform: body.platform,
    PointTypeID: body.pointTypeID,
    GameID: body.gameID,
    GameProvider: body.gameProvider,
    GameProviderGameID: body.gameProviderGameID,
    ReturnUrl: body.returnUrl,
    Locale: body.Locale
  }

  if (body.checkProviderMember) data.CheckProviderMember = body.checkProviderMember
  if (body.forceTransfer) data.ForceTransfer = body.forceTransfer
  if (body.accessToken) data.AccessToken = body.accessToken

  return request({
    method,
    url,
    data
  })
}

export const getGameLeaderboard = inputData => {
  const url = 'Game/Leaderboard'
  const method = 'get'
  const data = {
    Locale: inputData.locale
  }

  return request({
    method,
    url,
    data
  })
}

// 遊戲排行
export const getGameRankingByPoints = inputData => {
  const url = 'Game/RankingByPoints'
  const method = 'get'
  const data = {
    Locale: inputData.locale
  }

  return request({
    method,
    url,
    data
  })
}

// 直播版本排行榜＝＝＝＝＝＝＝＝＝＝
//取得收禮排行榜 直播主
export const getGameDonateRankStreamer = input => {
  const url = 'Game/DonateRankStreamer'
  const method = 'get'
  const data = {
    ReportMonth: input.reportMonth,
    ReportDay: input.reportDay,
    PageSize: 10,
    Page: 1
  }

  return request({
    method,
    url,
    data
  })
}

//取得送禮排行榜 玩家
export const getGameDonateRankPlayer = input => {
  const url = 'Game/DonateRankPlayer'
  const method = 'get'
  const data = {
    ReportMonth: input.reportMonth,
    PageSize: 10,
    Page: 1,
    ...(input?.reportDay && { ReportDay: input.reportDay })
  }

  return request({
    method,
    url,
    data
  })
}

// 首頁-輪播用-取得直播頻道
export const getStreamChannel = () => {
  const url = 'Stream/GetStreamChannel'
  const method = 'get'
  const data = {
    GameId: 1
  }

  return request({
    method,
    url,
    data
  })
}
