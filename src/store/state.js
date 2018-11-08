import {playMode} from "../assets/js/config";
import {loadSearch,loadPlay} from "../assets/js/cache";

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
  disc:{},
  /*搜索记录*/
  searchList:loadSearch(),
  /*播放列表*/
  playHistory:loadPlay(),
}

export default state;
