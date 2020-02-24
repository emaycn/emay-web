
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 密码规则校验
 */
export function validPassword(str) {
  const reg = /((?=.*[a-zA-Z])(?=.*\d)|(?=[a-zA-Z])(?=.*[^a-zA-Z0-9])).{6,16}$/
  return reg.test(str)
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
/**
 系统管理----->用户管理
 */
export function user_name(str) {
  const reg = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/
  return reg.test(str)
}
export function real_name(str) {
  const reg = /^[\u2E80-\u9FFFa-zA-Z]+$/
  return reg.test(str)
}
export function phone(str) {
  const reg = /^1[0-9]{10}$/
  return reg.test(str)
}
export function userEmail(str) {
  const reg = /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[\u4e00-\u9fa5a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]*[\u4e00-\u9fa5a-zA-Z0-9]+\.[a-zA-Z]*[\u4e00-\u9fa5a-zA-Z0-9]{2,3}$/
  return reg.test(str)
}
/**
 系统管理----->角色管理
 */
export function allroleName(str) {
  const reg = /^([\u4E00-\u9FA5]|\w)*$/
  return reg.test(str)
}
/**
 基础数据管理----->系统配置
 */
export function setValueReg(str) {
  const reg = /^(?:(?!0{1,3})\d{1,3})$/
  return reg.test(str)
}

export function setValueDecimalReg(str) {
  const reg = /^0(\.\d{2})$/
  return reg.test(str)
}

/**
 标签规则管理----->标签版本管理
 */
export function versionrule(str) {
  const reg = /^\d+\.\d+$|^\d+\.\d+\.\d+$/
  return reg.test(str)
}
/**
 客户管理管理----->客户信息
 */
// 客户编号
export function cNumber(str) {
  const reg = /^[1-9][0-9]{0,7}$/
  return reg.test(str)
}
// 联系人
export function clinkman(str) {
  const reg = /^[\u2E80-\u9FFFa-zA-Z]+$/
  return reg.test(str)
}
// 电话号
export function cmobile(str) {
  const reg = /^1\d{10}$/
  return reg.test(str)
}
// 邮箱
export function cemail(str) {
  const reg = /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[\u4e00-\u9fa5a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]*[\u4e00-\u9fa5a-zA-Z0-9]+\.[a-zA-Z]*[\u4e00-\u9fa5a-zA-Z0-9]{2,3}$/
  return reg.test(str)
}
/**
 接口管理
 */
// 渠道编码
export function channelcode(str) {
  const reg = /^(?!_)(?!\d+$)(?!.*?_$)[a-zA-Z0-9_]+$/
  return reg.test(str)
}
// 服务端点
export function endpoint(str) {
  const reg = /^(?!\d+$)[\da-zA-Z]+$/
  return reg.test(str)
}
// 成本价正则
export function priceall(str) {
  const reg = /^([1-9][0-9]{0,1}|0)(\.(?![0]{1,2}$)[0-9]{1,4})?$/
  return reg.test(str)
}
// 成本价正则
export function pricemodify(str) {
  const reg = /^([1-9][0-9]{0,9}|0)(\.(?![0]{1,2}$)[0-9]{1,4})?$/
  return reg.test(str)
}
// 超时事件正则
export function timeout(str) {
  const reg = /^([12][0-9]|30|[1-9])$/
  return reg.test(str)
}
// 请求地址
export function url(str) {
  const reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/
  return reg.test(str)
}
/**
 应用管理----->应用账务
 */
export function rede(str) {
  const reg = /^([1-9]\d{0,7}|0)(\.(?![0]{1,2}$)[0-9]{1,3})?$/
  return reg.test(str)
}
/**
 应用管理----->规则配置
 */
// 预警次数
export function warningNum(str) {
  const reg = /^\+?[1-9]\d{0,3}$/
  return reg.test(str)
}
// 预警频率
export function drNumber(str) {
  const reg = /^\+?[1-9]\d{0,8}$/
  return reg.test(str)
}
/**
 运营分析-----
 */
// 签名分类名称
export function signExt(str) {
  const reg = /^[\u4E00-\u9FA5A-Za-z0-9]{2,20}$/
  return reg.test(str)
}
// 签名编码
export function signServiceCodeReg(str) {
  const reg = /^[0-9]\d{0,6}$/
  return reg.test(str)
}
