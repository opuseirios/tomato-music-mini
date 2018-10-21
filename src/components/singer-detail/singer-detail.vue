<template>
  <transition name="slide">
    <music-list :bg-image="bgImage" :title="title" :song-list="songList"></music-list>
  </transition>
</template>

<script>
  import MusicList from "../music-list/music-list";
  import {mapGetters} from 'vuex'
  import {getSongListData} from "../../api/singer";
  import {ERR_OK} from "../../api/config";
  import {createSong} from "../../assets/js/song";

  export default {
    name: "singer-detail",
    components: {MusicList},
    created(){
      setTimeout(()=>{
        this._getSongList();
      },20)
    },
    data(){
      return{
        songList:[]
      }
    },
    computed:{
      bgImage(){
        if(!this.singer){
          return
        }
        return this.singer.imgUrl;
      },
      title(){
        if(!this.singer){
          return
        }
        return this.singer.name;
      },
      ...mapGetters([
        'singer'
      ])
    },
    methods:{
      _getSongList(){
        if(!this.singer){
          this.$router.back();
        }
        getSongListData(this.singer.mid).then((res)=>{
           if(res.code === ERR_OK){
            this.songList = this._normaliseSongList(res.data.list);
           }
        })
      },
      _normaliseSongList(list){
        let songs = [];
        list.forEach((item)=>{
          songs.push(createSong(item.musicData))
        })
        return songs;
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
