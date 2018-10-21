<template>
  <div class='music-list'>
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="title">{{title}}</div>
    <div class="bg-image" :style="bgStyle">
      <div class="filter"></div>
    </div>
    <div class="song-list-wrapper">
      <song-list :song-list="songList"></song-list>
    </div>
  </div>
</template>

<script>
  import SongList from "../../base/song-list/song-list";
  export default {
    name: "music-list",
    components: {SongList},
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      songList:{
        type:Array,
        default:null
      }
    },
    computed:{
      bgStyle(){
        return `background-image:url(${this.bgImage})`
      }
    },
    methods:{
      back(){
        this.$router.back();
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";
  @import "./../../assets/scss/mixin";

  .music-list {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: $color-background;
    .back{
      position: absolute;
      left: 0;
      top: 0;
      padding: 20px;
      z-index: 9;
      .icon-back{
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title{
      z-index: 9;
      position: absolute;
      left: 10%;
      top: 20px;
      width: 80%;
      text-align: center;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image{
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      background-size: cover;
      .filter{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.3);
      }
    }
  }
  .song-list-wrapper{
    padding: 40px 60px;
  }
</style>
