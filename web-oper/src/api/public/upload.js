import request from '@/utils/UploadHttpUtils'

// Empty 文件上传
export function apiEmptyImport(data) {
  return request({
    url: '/o/empty/import',
    method: 'post',
    data: data
  })
}

// Portable 文件上传
export function apiPortableImport(data) {
  return request({
    url: '/o/portable/import',
    method: 'post',
    data: data
  })
}

// Sectionnum 文件上传
export function apiSectionnumImport(data) {
  return request({
    url: '/o/sectionnumber/import',
    method: 'post',
    data: data
  })
}

// Blacklist 文件上传
export function apiBlacklistImport(data) {
  return request({
    url: '/o/blacklist/import',
    method: 'post',
    data: data
  })
}

// Blackdict 文件上传
export function apiBlackdictImport(data) {
  return request({
    url: '/o/blackdictionary/import',
    method: 'post',
    data: data
  })
}

// Channelunsub 文件上传
export function apiChannelunsubImport(data) {
  return request({
    url: '/o/channelunsubscribe/import',
    method: 'post',
    data: data
  })
}

// Redlist 文件上传
export function apiRedlistImport(data) {
  return request({
    url: '/o/redlist/import',
    method: 'post',
    data: data
  })
}
