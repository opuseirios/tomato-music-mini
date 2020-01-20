import {getVkey} from "../../api/song";

export class Song {
  constructor({id,mid,singer,name,album,duration,url,image}){
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.url = url;
    this.image = image;
  }
}

export const createSong = async (musicData)=> {
  const res = await getVkey(musicData.songmid);
  const {filename,vkey} = res.data.items[0]
  return new Song({
    id:musicData.songid,
    mid:musicData.songmid,
    singer:filterSinger(musicData.singer),
    name:musicData.songname,
    album:musicData.albumname,
    duration:musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url:`http://dl.stream.qqmusic.qq.com/${filename}?vkey=${vkey}&guid=7332953645&fromtag=66`
  })
}

function filterSinger(singer) {
  let ret = [];
  if(!singer){
    return ''
  }
  singer.forEach(s=>{
    ret.push(s.name)
  })
  return ret.join('/')
}
