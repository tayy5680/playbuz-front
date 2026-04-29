import request from '@/api/request'

// 取得維護狀態
export const getSystemMainenance = () => {
  const url = 'System/Mainenance'
  const method = 'get'
  return request({
    method,
    url
  })
}
