import {playMode} from "../assets/js/config";

const state = {
  //歌手信息
  singer:{},
  //播放状态
  playing: false,
  //是否全屏
  fullScreen: false,
  //播放列表
  playlist:[],
  //顺序列表
  sequenceList:[],
  //播放模式
  mode: playMode.sequence,
  //当前索引
  currentIndex:-1
}

export default state;
