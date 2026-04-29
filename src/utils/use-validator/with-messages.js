import {
  required as rawRequired,
  email as rawemail,
  maxLength as rawMaxLength,
  minLength as rawMinLength
} from '@vuelidate/validators/dist/raw.esm'
import i18n from '@/configs/locales'
const {
  global: { t }
} = i18n

export function required() {
  return {
    $validator: rawRequired,
    $message: t('必填')
  }
}

export function email() {
  return {
    $validator: rawemail,
    $message: t('信箱錯誤')
  }
}

export function donate() {
  return {
    $validator: rawDonate,
    $message: t('愛心碼錯誤')
  }
}

export function barcode() {
  return {
    $validator: rawBarcode,
    $message: t('手機條碼錯誤')
  }
}

export function certificate() {
  return {
    $validator: rawCertificate,
    $message: t('自然人憑證')
  }
}

export function betweenLength(min, max) {
  return {
    $validator: rawBetweenLength(min, max),
    $message: `${t('長度需為')}: ${min}-${max}`
  }
}

export function taiwanPhoneNumber() {
  return {
    $validator: rawTaiwanPhone,
    $message: t('手機號碼格式錯誤')
  }
}

export function uniform() {
  return {
    $validator: rawUniform,
    $message: '統編格式錯誤'
  }
}

// 愛心碼
function rawDonate(value) {
  return /^[0-9]{3,7}$/.test(value)
}

// 手機條碼
function rawBarcode(value) {
  return /^\/[\dA-Z+-.]{7}$/.test(`/${value}`)
}

// 自然人憑證
function rawCertificate(value) {
  return /^[A-Z]{2}[0-9]{14}$/.test(value)
}

// 範圍長度
function rawBetweenLength(min, max) {
  return value => !required(value) || (rawMinLength(min)(value) && rawMaxLength(max)(value))
}

// 台灣手機號碼
function rawTaiwanPhone(value) {
  return /^09\d{8}$/.test(value)
}

// 統一編號驗證
export function rawUniform(value) {
  if (!/^\d{8}$/.test(value)) return false

  const validateOperator = [1, 2, 1, 2, 1, 2, 4, 1]

  const calculate = unm => {
    const ones = unm % 10
    const tens = (unm - ones) / 10
    return ones + tens
  }

  let sum = 0
  for (const [index, val] of Object.entries(value.toString().split(''))) {
    sum += calculate(parseInt(val) * validateOperator[index])
  }

  return sum % 10 === 0 || (value.toString()[6] === '7' && (sum + 1) % 10 === 0)
}
