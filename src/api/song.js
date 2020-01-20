import {commonParams} from "./config";
import axios from 'axios'

export function getVkey(songmid) {
  const url = '/api/vkey';
  const data = Object.assign({},commonParams,{
    hostUin:0,
    format:'json',
    platform:'yqq',
    needNewCode:0 ,
    cid:205361747,
    songmid:songmid,
    filename:`C400${songmid}.m4a`,
    guid:7332953645,
  })
  return axios.get(url,{
    params:data
  }).then(res=>{
    return Promise.resolve(res.data);
  })
}
