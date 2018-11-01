import * as types from './mutation-types'
import {shuffle} from "../assets/js/shuffle";
import {playMode} from "../assets/js/config";

export const selectPlay = function({commit,state},{list,index}){
  commit(types.SET_CURRENT_INDEX,index);
  commit(types.SET_PLAY_LIST,list);
  commit(types.SET_SEQUENCE_LIST,list);
  commit(types.SET_FULL_SCREEN,true);
  commit(types.SET_PLAYING_STATE,true);
}

/*随机播放全部*/
export const randomPlay = function ({commit,state},list) {
  let randomList = shuffle(list);
  commit(types.SET_CURRENT_INDEX,0);
  commit(types.SET_PLAY_LIST,randomList);
  commit(types.SET_SEQUENCE_LIST,list);
  commit(types.SET_FULL_SCREEN,true);
  commit(types.SET_PLAYING_STATE,true);
  commit(types.SET_PLAY_MODE,playMode.random);
}
