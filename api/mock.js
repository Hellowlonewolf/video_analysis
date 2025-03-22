import Mock from 'mockjs'
import pageApi from './mockData/pageApi.js'

// Mock.mock('http://localhost:5173/api')

// 正则匹配    mock 掉 getBanner 接口, 返回数据在 pageApi 里面配置
Mock.mock(/api\/user\/getBanner/, 'get', pageApi.getBanner)

