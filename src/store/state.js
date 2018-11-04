import {playMode} from "../assets/js/config";

const state = {
  /*歌手*/
  singer:{},

  /*是否播放*/
  playing:false,
  /*是否全屏*/
  fullScreen:false,
  /*歌曲列表*/
  playlist:[],
  /*播放列表*/
  sequenceList:[],
  /*播放模式*/
  mode:playMode.sequence,
  /*当前顺序*/
  currentIndex:-1,
  /*歌单*/
  disc:{}
}

export default state;
