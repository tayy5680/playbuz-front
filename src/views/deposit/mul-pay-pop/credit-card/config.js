const commonStyle = {
  base: {
    backgroundColor: '#EFEFEF',
    lineHeight: '24px',
    fontSize: '14px',
    color: '#222935',
    '::placeholder': {
      color: '#8492aa'
    }
  },
  invalid: {
    color: '#dc2626'
  }
}

/** 卡號樣式 */
export const cardInputStyle = { ...commonStyle }

/** 有效期限樣式 */
export const expiryInputStyle = { ...commonStyle }

/** 安全碼樣式 */
export const cvcInputStyle = { ...commonStyle }
