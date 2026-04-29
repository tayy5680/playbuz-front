// 禮包
export const TYPE_LIST = [
  { id: 0, label: '禮包', route: { name: 'deposit', params: { depositPageType: 'giftpack' } } },
  { id: 1, label: '序號', route: { name: 'deposit', params: { depositPageType: 'orderno' } } }
]

export const CLASS_LIST = [
  { id: 'limit', label: '限量禮包' },
  { id: 'time', label: '活動禮包' },
  { id: 'cycle', label: '超值禮包' },
  { id: 'first', label: '首購禮包' }
]

// 禮包內容：金銀幣圖示
export const REWARD_COIN = [
  {
    id: 0,
    label: 'GoldPoint',
    img: process.env.VUE_APP_IMG_URL + '/img/coin/i_money_gold.svg',
    background: 'linear-gradient(180deg ,#000 0,#3d3d3d)',
    border: '1px solid #8940a7',
    text: '#fff'
  },
  {
    id: 1,
    label: 'SilverPoint',
    img: process.env.VUE_APP_IMG_URL + '/img/coin/i_money_silver.svg',
    background: 'linear-gradient(180deg ,#000 0,#3d3d3d)',
    border: '1px solid #8940a7',
    text: '#fff'
  },
  {
    id: 2,
    label: 'Exp',
    img: process.env.VUE_APP_IMG_URL + '/img/coin/i_vip_color.svg',
    background: 'linear-gradient(180deg, #fff 0%, #B7B3AF 75%, #fff 100%)',
    // background: 'linear-gradient(180deg,#fff 0,#b7b7b7 90%,#fff)',
    text: '#dc0000',
    point: '+'
  },
  {
    id: 3,
    label: 'DragonBoat',
    img: process.env.VUE_APP_IMG_URL + '/img/coin/i_vip_color.svg',
    point: 'x'
  }
]

/** 支付方式
  0-註冊免費送;
  1-ATM;
  2-信用卡;
  3-超商;
  4-0元禮包;
  5-小額付款;
  6-金幣;
  7-銀幣;
  8-WebATM;
  9-ApplePay;
  100-PHPGO
 */

export const DEPOSIT_TYPE_LIST = [
  // { id: 0, type: 'register-free', label: '註冊免費送' },
  { id: 1, type: 'atm', label: 'ATM轉帳' },
  { id: 2, type: 'card', label: '信用卡' },
  { id: 3, type: 'code', label: '超商代碼繳費' },
  { id: 4, type: 'zero', label: '0元禮包' },
  { id: 5, type: 'little', label: '小額付款' },
  { id: 6, type: 'gold', label: '金幣' },
  { id: 7, type: 'silver', label: '銀幣' },
  { id: 8, type: 'webATM', label: 'WebATM' },
  { id: 9, type: 'apple-pay', label: 'Apple Pay' },
  { id: 100, type: 'phpgopay', label: 'PHPGOPAY' }
]
