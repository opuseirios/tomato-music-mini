<template>
    <transition name="slide">
      <music-list :song-list="songs" :title="title" :bg-image="bgImage"></music-list>
    </transition>
</template>

<script>
  import MusicList from "../../../../components/music-list/music-list";
  import {getDiscData} from "../../../../api/rank";
  import {mapGetters} from 'vuex'
  import {ERR_OK} from "../../../../api/config";
  import {createSong} from "../../../../assets/js/song";

  export default {
    name: "disc",
    components: {MusicList},
    computed:{
      title(){
        return this.info.ListName;
      },
      bgImage(){
        return this.info.pic
      },
      ...mapGetters([
        'disc'
      ])
    },
    created(){
      this._getDiscSongs();
    },
    data(){
      return{
        info:{},
        songs:[]
      }
    },
    methods:{
      _getDiscSongs(){
        if(!this.disc.id){
          this.$router.back();
        }
        getDiscData(this.disc.id).then((res)=>{
          if(res.code === ERR_OK){
            this.info = res.topinfo;
            this.songs = this._normaliseSong(res.songlist);
          }
        })
      },
      _normaliseSong(list){
        let ret = [];
        list.forEach((song)=>{
          if(song.data.songid&&song.data.albumid){
            ret.push(createSong(song.data))
          }
        })
        return ret;
      }
    }
  }
</script>

<style scoped lang='scss'>
  .slide-enter-active, .slide-leave-active {
    transition: all .3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
