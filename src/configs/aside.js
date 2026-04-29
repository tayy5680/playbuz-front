import { getRoutes } from '@/router/routes'
import { LIST_FAQ } from '@/views/FAQ/i18n/index.js'
import { TAGS_NAME } from '@/configs/event/index.js'

const useRoutes = getRoutes()
const target = useRoutes.map(item => item.name).concat(['orderno', 'more', 'line'])
// 序號頁面orderno被歸類至商城下，如需多筆再另外設定變數做新增

// 側邊選單
export const ASIDE_MENU_2025 = [
  { id: 'home', iconFileName: 'i_home', label: '首頁', router: { name: 'home' } },
  { id: 'about', iconFileName: 'i_about', label: '關於玩霸', router: { name: 'about' } },
  { id: 'game', iconFileName: 'i_game', label: '熱門遊戲', router: { name: 'game', params: { gameType: 'all' } } },
  { id: 'event', iconFileName: 'i_news', label: '最新消息', router: { name: 'event' } },
  {
    id: 'deposit',
    iconFileName: 'i_deposit',
    label: '儲值購點',
    router: { name: 'deposit', params: { depositPageType: 'giftpack' } }
  },
  {
    id: 'FAQ',
    iconFileName: 'i_faq',
    label: '客服中心',
    router: { name: 'FAQ', params: { faqTypeName: LIST_FAQ[0].name } }
  }
]

export const ASIDE_MENU_2025_WITHOUT_HOME = ASIDE_MENU_2025.filter(item => item.id !== 'home')

export const MEMBER_MENU = [
  { id: 'center/edit', iconFileName: 'i_member_center', label: '會員資料', router: { name: 'center/edit' } },
  { id: 'center/record', iconFileName: 'i_order', label: '訂單', router: { name: 'center/record' } }
]
