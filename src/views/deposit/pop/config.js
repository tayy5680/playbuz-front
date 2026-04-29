export const DONATE_MARK_LIST = [
  { id: 2, type: 'uniform', label: '統一編號' },
  { id: 0, type: 'device', label: '載具類型' },
  { id: 1, type: 'donate', label: '捐贈' }
]

export const TELECOM_CARRIER_LIST = [
  { value: 1, label: '中華電信' },
  { value: 2, label: '遠傳' },
  { value: 3, label: '台灣大哥大' },
  { value: 4, label: '台灣之星' },
  { value: 5, label: '亞太' }
]

export const DONATE_LIST = [
  { id: 'gswf', label: '創世基金會', value: '919' },
  { id: 'other', type: 'placeholder', label: '輸入愛心碼', value: '' }
]

export const MAIL_TEAMPLETE = { id: 'mail', label: 'E-mail', placeholder: '電子信箱為必填資訊', value: '' }

export const DEVICE_LIST = [
  { id: 'phone', label: '手機條碼', placeholder: '手機條碼', value: '', code: '3J0002' },
  { id: 'certificate', label: '自然人憑證', placeholder: '自然人憑證載具條碼', value: '', code: 'CQ0001' }
]

// 統編欄位
export const IDENTIFIER_LIST = [
  { id: 'buyerName', label: '抬頭', placeholder: '抬頭名稱', value: '' },
  { id: 'buyerIdentifier', label: '統一編號', placeholder: '統一編號', value: '' }
]

// 商城退款說明文字
export const REFUND_NOTICE_I18N = {
  'zh-TW': `若有需要申請退款，歡迎聯繫客服，我們會盡快為您服務。我們將依「消費者保護法」及「<a href="/userRules/user-guidelines" target="_blank"><u>使用者條款</u></a>」的規定，協助處理退款相關事宜。`,
  'en-US': `If you need to request a refund, please contact customer service and we will assist you as soon as possible. We will handle refund-related matters in accordance with the "Consumer Protection Act" and the "<a href="/userRules/user-guidelines" target="_blank"><u>Terms of Use</u></a>".  `,
  'zh-CN': `若您需要申请退款，欢迎联系客户服务，我们会尽快为您服务。我们将依「消费者保护法」及「<a href="/userRules/user-guidelines" target="_blank"><u>使用者条款</u></a>」的规定，协助处理退款相关事宜。`,
  'ja-JP': `返金をご希望の場合は、カスタマーサポートまでご連絡ください。速やかに対応いたします。「消費者保護法」および「<a href="/userRules/user-guidelines" target="_blank"><u>利用規約</u></a>」に基づき、返金に関する事案をサポートいたします。`
}

export const DONATE_TEMPLATE = data => {
  return `
    <script>
      const target = ${JSON.stringify(data)}

      window.onload = () => {
        const formElement = document.createElement('form')
        formElement.action = target.url
        formElement.method = 'post'


        for(const [ key, value ] of Object.entries(target.info)) {
          const inputElement = document.createElement('input')
          inputElement.name = key
          inputElement.value = value
          formElement.appendChild(inputElement)
        }

        window.document.body.appendChild(formElement)

        formElement.submit()
      }
    </script>
  `
}
