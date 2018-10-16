import jsonp from './../assets/js/jsonp'
import {options,commonParams} from "./config";

export function getRecommendData() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({},commonParams,{
    platform:'h5',
    needNewCode:1
  });
  return jsonp(url,data,options)
}
