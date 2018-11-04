import {mapGetters} from 'vuex'

export const playerMixin = {
  computed:{
    ...mapGetters([
      'playlist'
    ])
  },
  mounted(){
    this.handlePlaylist(this.playlist)
  },
  activited(){
    this.handlePlaylist(this.playlist)
  },
  watch:{
    playlist(newVal){
      this.handlePlaylist(this.playlist)
    }
  },
  methods:{
    handlePlaylist(){
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
