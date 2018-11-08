<template>
  <transition name="slide">
    <div class='user-center'>
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :current-index="currentIndex" :switches="switches"></switches>
      </div>
      <div class="play-btn">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0">
          <div class="list-inner">
            <song-list></song-list>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from "../../base/switches/switches";
  import Scroll from "../../base/scroll/scroll";
  import SongList from "../../base/song-list/song-list";
  export default {
    name: "user-center",
    components: {SongList, Scroll, Switches},
    data(){
      return{
        currentIndex: 0,
        switches: [
          {name: '我喜欢的'},
          {name: '最近听的'}
        ]
      }
    },
    methods:{
      back(){
        this.$router.back();
      },
      switchItem(index){
        this.currentIndex = index;
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";
  .user-center{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    background: $color-background;
    &.slide-enter-active,&.slide-leave-active{
      transition: all .3s;
    }
    &.slide-enter,&.slide-leave-to{
      transform: translate3d(100%,0,0);
    }
    .back{
      position: absolute;
      top: 0;
      left: 12px;
      z-index: 50;
      .icon-back{
        display: block;
        padding: 20px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .switches-wrapper{
      margin: 20px 0 60px 0;
    }
    .play-btn{
      box-sizing: border-box;
      width: 270px;
      padding: 14px 0;
      margin: 0 auto;
      text-align: center;
      border: 2px solid $color-text-l;
      color: $color-text-l;
      border-radius: 100px;
      font-size: 0;
      .icon-play{
        display: inline-block;
        vertical-align: middle;
        margin-right: 12px;
        font-size: $font-size-medium-x;
      }
      .text{
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .list-wrapper{
      position: absolute;
      top: 220px;
      bottom: 0;
      width: 100%;
      .list-scroll{
        height: 100%;
        overflow: hidden;
        .list-inner{
          padding: 40px 60px;
        }
      }
    }
    .no-result-wrapper{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
