import request from '@/utils/request'

// 課程列表
export function getLessonList(queryObj) {
  return request({
    url: '/subject/',
    method: 'get',
    params: queryObj,
  })
}

// 課程詳情
export function getLessonDetail(id) {
  return request({
    url: `/subject/${id}/`,
    method: 'get',
  })
}

// 課程購買
export function buyLesson(data) {
  return request({
    url: `/subject/buy/`,
    method: 'post',
    data,
  })
}

// 章節列表
export function getSectionList(queryObj) {
  return request({
    url: '/subject/section/',
    method: 'get',
    params: queryObj,
  })
}

// 章節詳情
export function getSectionDetail(id) {
  return request({
    url: `/subject/section/${id}/`,
    method: 'get',
  })
}

// 章節學習
export function learnSection(data) {
  return request({
    url: `/subject/section/learn/`,
    method: 'post',
    data,
  })
}
