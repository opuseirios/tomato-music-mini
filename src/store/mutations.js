import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_PLAY_LIST](state, list) {
    state.playlist = list;
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode;
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },
  [types.SET_DISC](state,disc){
    state.disc = disc;
  },
  [types.SET_SEARCH_LIST](state,list){
    state.searchList = list;
  },
  [types.SET_PLAY_HISTORY](state,list){
    state.playHistory = list;
  },
  [types.SET_FAVORITE_LIST](state,list){
    state.favoriteList = list;
  }
}

export default mutations;
