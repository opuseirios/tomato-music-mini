<template>
  <div class='player' v-if="playlist.length>0">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.image" alt="">
      </div>
      <div class="top">
        <div class="back" @click="down">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h4 class="name" v-html="currentSong.singer"></h4>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd">
              <img :src="currentSong.image" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="bottom"></div>
    </div>
    <div class="mini-player" v-show="!fullScreen" @click="up">
      <div class="icon">
        <img :src="currentSong.image" alt="">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex'
  export default {
    name: "player",
    computed:{
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong'
      ])
    },
    methods:{
      down(){
        this.setFullScreen(false);
      },
      up(){
        this.setFullScreen(true);
      },
      ...mapMutations({
        setFullScreen:'SET_FULL_SCREEN'
      })
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";
  @import "./../../assets/scss/mixin";

  .player {
    .normal-player {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: $color-background;
      z-index: 150;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: .8;
        filter: blur(40px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        .back {
          position: absolute;
          top: 0;
          left: 20px;
          padding: 10px;
          transform: rotate(-90deg);
          .icon-back {
            font-size: $font-size-large-x;
            color: $color-theme;
          }
        }
        .title {
          width: 80%;
          margin: 0 auto;
          color: $color-text;
          font-size: $font-size-large;
          @include no-wrap();
          text-align: center;
          line-height: 70px;
        }
        .name {
          line-height: 40px;
          color: $color-text;
          text-align: center;
          font-size: $font-size-medium;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        left: 0;
        top: 160px;
        bottom: 340px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            width: 80%;
            top: 0;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, .1);
              border-radius: 50%;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
              &.play {
                animation: rotate 20s linear infinite;
              }
              &.pause {
                animation-play-state: paused;
              }
            }
          }
          .play-lyric-wrapper {
            width: 80%;
            margin: 60px auto 0;
            text-align: center;
            .play-lyric {
              height: 40px;
              line-height: 40px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 64px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 100px;
        left: 0;
        width: 100%;
        .dots-wrapper{
          margin: 20px auto;
          text-align: center;
          font-size: 0;
          .dot{
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: $color-text-l;
            &:last-child{
              margin-left: 16px;
            }
            &.active{
              width: 40px;
              border-radius: 10px;
              background: $color-text;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          width: 80%;
          margin: 0 auto;
          align-items: center;
          .time {
            flex: 0 0 60px;
            width: 60px;
            font-size: $font-size-small;
            color: $color-text;
            line-height: 60px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            i {
              font-size: 60px;
            }
            &.i-left {
              text-align: right;
            }
            &.i-center {
              padding: 0 40px;
              text-align: center;
              i {
                font-size: 80px;
              }
            }
            &.i-right {
              text-align: left;
            }
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .4s;
        .top, .bottom {
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0);
        }
      }
    }
    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 120px;
      opacity: 1;
      background: $color-highlight-background;
      &.mini-enter-active, &.mini-leave-active {
        transition: all .4s;
      }
      &.mini-enter, &.mini-leave-to {
        opacity: 0;
      }
      .icon {
        flex: 0 0 80px;
        width: 80px;
        padding: 0 20px 0 40px;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          &.play {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            -webkit-animation-play-state: paused;
            -moz-animation-play-state: paused;
            -o-animation-play-state: paused;
            animation-play-state: paused;
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 40px;
        overflow: hidden;
        .name {
          margin-bottom: 4px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
      .control {
        flex: 0 0 60px;
        width: 60px;
        padding: 0 20px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 60px;
          color: $color-theme-d;
        }
        .icon-mini {
          font-size: 64px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
