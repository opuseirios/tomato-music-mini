export const singer = state => state.singer;

export const playing = state =>state.playing;

export const fullScreen = state => state.fullScreen;

export const playlist = state => state.playlist;

export const sequenceList = state => state.sequenceList;

export const mode = state => state.mode;

export const currentIndex = state => state.currentIndex;

export const currentSong = state => state.playlist[state.currentIndex];

export const disc = state => state.disc;

export const searchList = state => state.searchList;

export const playHistory = state => state.playHistory;

export const favoriteList = state => state.favoriteList;
