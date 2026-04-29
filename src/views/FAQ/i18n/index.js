import { FAQ_TW } from './FAQ_TW'
import { FAQ_EN } from './FAQ_EN'

export const LIST_FAQ = [
  { id: 1, name: 'general', label: '一般問題' },
  { id: 2, name: 'account', label: '帳號問題' },
  { id: 3, name: 'topup', label: '儲值問題' },
  { id: 4, name: 'game', label: '遊戲相關' }
]

export const I18N_FAQ = {
  'zh-TW': FAQ_TW,
  'en-US': FAQ_EN
}
