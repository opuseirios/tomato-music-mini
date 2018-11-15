<template>
  <transition name="slide">
    <music-list :song-list="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
  import MusicList from "../../../../components/music-list/music-list";
  import {getDiscSongs} from "../../../../api/recommend";
  import {mapGetters} from 'vuex'
  import {createSong} from "../../../../assets/js/song";
  import {ERR_OK} from "../../../../api/config";
  import {getVkey} from "../../../../api/song";

  export default {
    components: {MusicList},
    name: 'disc',
    computed:{
      title(){
        return this.data.dissname
      },
      bgImage(){
        return this.data.logo
      },
      ...mapGetters([
        'disc'
      ])
    },
    data(){
      return{
        songs:[],
        data:{}
      }
    },
    created(){
      this._getDiscSongs();
    },
    methods:{
      _getDiscSongs(){
        if(!this.disc.dissid){
          this.$router.back();
        }
        getDiscSongs(this.disc.dissid).then((res)=>{
          if(res.code === ERR_OK&&res.cdlist){
            this.data = res.cdlist[0];
            this.songs = this._normaliseSongs(this.data.songlist);
          }
        })
      },
      _normaliseSongs(list){
        let ret = [];
        list.forEach((musicData) => {
          getVkey(musicData.songmid).then((res)=>{
            if(res.code === ERR_OK){
              let data = res.data.items[0];
              let url = `http://dl.stream.qqmusic.qq.com/${data.filename}?vkey=${data.vkey}&guid=7332953645&fromtag=66`;
              ret.push(createSong(musicData,url));
            }
          })
        })
        return ret;
      }
    }
  }
</script>

<style lang='scss' scoped>
  .slide-enter-active, .slide-leave-active {
    transition: all .3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
