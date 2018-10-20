import jsonp from './../assets/js/jsonp'
import {options,commonParams} from "./config";
import axios from 'axios'

export function getRecommendData() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({},commonParams,{
    platform:'h5',
    needNewCode:1
  });
  return jsonp(url,data,options)
}


export function getDistListData() {
  /*因为数据在后端，不用jsonp获取，而用axios*/
  const url = '/api/getDiscList';
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data);
  })
}
