export default class Song {
  constructor({id, mid, singer, name, album, duration, url, image}) {
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

export function createSong(musicData) {
  return new Song({
    id:musicData.songid,
    mid:musicData.songmid,
    singer:filteSinger(musicData.singer),
    name:musicData.songname,
    album:musicData.albumname,
    duration:musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url:`http://222.73.132.146/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=333924287&vkey=43683ED98F3A3AC55909F883C37CF20B5885AF8727150D6C4257267E4E78F63CCC192B5BEDB19D6A522C946835FDF0F015873B490AA99423&uin=0&fromtag=66`
  })
}

function filteSinger(singer) {
  let ret = [];
  if(!singer){
    return ''
  }
  singer.forEach((s)=>{
    ret.push(s.name)
  })
  return ret.join('/')
}
