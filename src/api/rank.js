import jsonp from './../assets/js/jsonp'
import {options,commonParams} from "./config";
import axios from 'axios'

export function getRankData() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
  const data = Object.assign({},commonParams,{
    uin:0,
    notice:0,
    platform:'h5',
    needNewCode:1
  })
  return jsonp(url,data,options);
}

export function getDiscData(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  const data = Object.assign({},commonParams,{
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid
  })
  return jsonp(url,data,options)
}
