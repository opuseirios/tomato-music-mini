import jsonp from '../assets/js/jsonp'
import {commonParams, options} from "./config";

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pageSize: 100,
    pagenum: 1,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}
