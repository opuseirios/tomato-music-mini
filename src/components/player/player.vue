<template>
  <div class='player' v-if="playlist.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
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
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar :percent="percent" @percentChange="changePercent"/>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="iconPlay" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="up">
        <div class="icon">
          <img :class="cdCls" :src="currentSong.image" alt="">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i :class="iconMini" @click.stop="togglePlay"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="timeUpdate"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from "../../assets/js/dom";
  import ProgressBar from '../../base/progress-bar/progress-bar'

  const transform = prefixStyle('transform');

  export default {
    name: "player",
    data() {
      return {
        songReady: false,
        currentTime: 0,
      }
    },
    components: {ProgressBar},
    computed: {
      iconPlay() {
        return !this.playing ? 'icon-play' : 'icon-pause'
      },
      iconMini() {
        return !this.playing ? 'icon-play-mini' : 'icon-pause-mini'
      },
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex'
      ])
    },
    methods: {
      down() {
        this.setFullScreen(false);
      },
      up() {
        this.setFullScreen(true);
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale();
        const animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.2)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },
      afterEnter() {
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style.animation = '';
      },
      leave(el, done) {
        const {x, y, scale} = this._getPosAndScale();
        this.$refs.cdWrapper.style.transition = 'all .4s';
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done);
      },
      afterLeave() {
        this.$refs.cdWrapper.style[transform] = '';
        this.$refs.cdWrapper.style.transition = '';
      },
      togglePlay() {
        if (!this.songReady) {
          return;
        }
        this.setPlayState(!this.playing);
      },
      next() {
        if (!this.songReady) {
          return;
        }
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlay();
        }
        this.songReady = false;
      },
      prev() {
        if (!this.songReady) {
          return;
        }
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlay();
        }
        this.songReady = false;
      },
      ready() {
        this.songReady = true;
      },
      error() {
        this.songReady = true;
      },
      timeUpdate(e) {
        this.currentTime = e.target.currentTime;
      },
      format(time) {
        time = time | 0;
        const m = time / 60 | 0;
        const s = this._pad(time % 60);
        return `${m}:${s}`
      },
      changePercent(percent) {
        this.$refs.audio.currentTime = percent * this.currentSong.duration;
        if (!this.playing) {
          this.togglePlay();
        }
      },
      _pad(num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num;
      },
      _getPosAndScale() {
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const paddingTop = 80;
        const width = window.innerWidth * 0.8;
        const scale = targetWidth / width;
        const x = -(window.innerWidth / 2 - paddingLeft - targetWidth / 2);
        const y = (window.innerHeight - targetWidth / 2 - paddingTop - paddingBottom - width / 2);
        return {x, y, scale};
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayState: 'SET_PLAY_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX'
      })
    },
    watch: {
      currentSong() {
        this.$nextTick(() => {
          this.$refs.audio.play();
        })
      },
      playing(newPlaying) {
        this.$nextTick(() => {
          const audio = this.$refs.audio;
          newPlaying ? audio.play() : audio.pause()
        })
      }
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
        .dots-wrapper {
          margin: 20px auto;
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: $color-text-l;
            &:last-child {
              margin-left: 16px;
            }
            &.active {
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
            &.disable {
              color: $color-text-l
            }
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
