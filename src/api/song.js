import axios from 'axios'
import {commonParams, options} from "./config";

export function getLyricData(songmid) {
  const url = '/api/getLyric';
  const data = Object.assign({}, commonParams, {
    pcachetime: +new Date(),
    songmid,
    format: 'json',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data);
  })
}
