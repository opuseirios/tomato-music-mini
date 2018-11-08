import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from "./config";
import {shuffle} from "./shuffle";

export const playerMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activited() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(this.playlist)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playlistMixin = {
  computed: {
    modeIcon() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    ...mapGetters([
      'sequenceList',
      'currentIndex',
      'currentSong',
      'playlist',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      /*更换歌曲列表*/
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      })
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAY_LIST"
    }),
  }
}

export const searchMixin = {
  computed:{
    ...mapGetters([
      'searchList'
    ])
  },
  data(){
    return{
      query: '',
      refreshDelay: 100
    }
  },
  methods:{
    addQuery(key) {
      this.$refs.searchBox.setQuery(key);
    },
    onQueryChange(query) {
      this.query = query;
    },
    saveSearchList() {
      this.saveSearchHistory(this.query);
    },
    blurInput(){
      this.$refs.searchBox.blur();
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
    ])
  }
}
