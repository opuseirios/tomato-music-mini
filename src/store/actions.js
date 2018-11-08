import * as types from './mutation-types'
import {shuffle} from "../assets/js/shuffle";
import {playMode} from "../assets/js/config";
import {saveSearch,deleteAllSearch,deleteSearch,savePlay} from "../assets/js/cache";

function findIndex(list,song) {
  return list.findIndex((item)=>{
    return item.id === song.id;
  })
}

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

export const insertSong = function ({commit,state},song) {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  /*记录当前歌曲*/
  let currentSong = playlist[currentIndex];
  /*查找当期那列表中是否有当前歌曲并返回索引*/
  let fpIndex = findIndex(playlist,song);
  currentIndex++;
  /*插入这首歌到当前索引位置*/
  playlist.splice(currentIndex,0,song);
  /*如果已经包含这首歌*/
  if(fpIndex>-1){
    if(currentIndex>fpIndex){
      playlist.splice(fpIndex,1);
      currentIndex--
    }else {
      playlist.splice(fpIndex+1,1)
    }
  }

  let currentSIndex = findIndex(sequenceList,currentIndex)+1;
  let fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentSIndex, 0, song);
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  commit(types.SET_PLAY_LIST,playlist);
  commit(types.SET_SEQUENCE_LIST,sequenceList);
  commit(types.SET_CURRENT_INDEX,currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}


/*保存搜索记录*/
export const saveSearchHistory = function ({commit},query) {
  commit(types.SET_SEARCH_LIST,saveSearch(query));
}
/*删除搜索记录*/
export const deleteSearchHistory = function ({commit},query) {
  commit(types.SET_SEARCH_LIST,deleteSearch(query))
}
/*删除所有搜索记录*/
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_LIST,deleteAllSearch());
}

/*删除歌曲*/
export const deleteSong = function ({commit,state},song) {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;

  let pIndex = findIndex(playlist,song);
  playlist.splice(pIndex,1);
  let sIndex =findIndex(sequenceList,song);
  sequenceList.splice(sIndex,1);

  if(currentIndex>pIndex || currentIndex === playlist.length){
    currentIndex--
  }

  commit(types.SET_PLAY_LIST,playlist);
  commit(types.SET_SEQUENCE_LIST,sequenceList);
  commit(types.SET_CURRENT_INDEX,currentIndex);

  if(!playlist.length){
    commit(types.SET_PLAYING_STATE,false);
  }else {
    commit(types.SET_PLAYING_STATE,true);
  }
}

/*清空列表*/
export const deleteSonglist = function ({commit}) {
  commit(types.SET_PLAYING_STATE,false);
  commit(types.SET_SEQUENCE_LIST,[]);
  commit(types.SET_PLAY_LIST,[]);
  commit(types.SET_CURRENT_INDEX,-1);
}

/*保存播放记录*/
export const savePlayHistory = function ({commit},song) {
  commit(types.SET_PLAY_HISTORY,savePlay(song));
}
