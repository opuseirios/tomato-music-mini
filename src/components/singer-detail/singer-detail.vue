<template>
    <transition name="slide">
      <div class='singer-detail'>
        singer-detail
      </div>
    </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from "../../api/singer";
  import {ERR_OK} from "../../api/config";
  import {createSong} from "../../assets/js/song";

  export default {
    name: "singer-detail",
    computed:{
      ...mapGetters([
        'singer'
      ])
    },
    data(){
      return {
        songs:[]
      }
    },
    created(){
      this._getDetail()
    },
    methods:{
      _getDetail(){
        if(!this.singer.id){
          this.$router.push('/singer');
          return;
        }
        getSingerDetail(this.singer.id).then(res=>{
          if(res.code === ERR_OK){
            this.songs = this._normaliseSongList(res.data.list);
            console.log(this.songs);
          }
        })
      },
      _normaliseSongList(list){
        let ret = [];
        list.forEach(item=>{
          const {musicData} = item;
          createSong(musicData).then(song=>{
            ret.push(song)
          })
        })
        return ret;
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "../../assets/scss/variable";
.singer-detail{
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
  .slide-enter-active,.slide-leave-active{
    transition: all .3s
  }
  .slide-enter,.slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
