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
          <div class="back" @click="hide">
            <i class="icon-back"></i>
          </div>
          <h2 class="title">{{currentSong.name}}</h2>
          <h4 class="name">{{currentSong.singer}}</h4>
        </div>
        <div class="middle" ref="middle">
          <div class="middle-l">
            <div class="cd-wrapper"  ref="cdWrapper">
              <div class="cd" :class="playCls">
                <img :src="currentSong.image" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{_formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{_formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="show">
        <div class="icon" ref="miniIcon">
          <img :class="playCls" :src="currentSong.image" alt="">
        </div>
        <div class="text">
          <h2 class="title">{{currentSong.name}}</h2>
          <h4 class="name">{{currentSong.singer}}</h4>
        </div>
        <div class="control">
          <i class="icon-play" :class="playMiniIcon" @click.stop="togglePlay"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @error="error"
      @ended="end"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from "../../assets/js/dom";
  import ProgressBar from "../../base/progress-bar/progress-bar";

  const transform = prefixStyle('transform');
  export default {
    name: "play",
    components: {ProgressBar},
    computed: {
      playIcon() {
        return this.playing ? 'icon-pause':'icon-play'
      },
      playCls() {
        return this.playing ? 'play' : 'play pause'
      },
      playMiniIcon(){
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      percent(){
        return this.currentTime/this.currentSong.duration;
      },
      ...mapGetters([
        'currentSong',
        'playlist',
        'currentIndex',
        'sequenceList',
        'fullScreen',
        'playing'
      ])
    },
    data(){
      return{
        /*歌曲就绪*/
        songReady:false,
        currentTime:0
      }
    },
    mounted() {

    },
    methods: {
      hide() {
        this.setFullScreen(false);
      },
      show() {
        this.setFullScreen(true);
      },
      /*transition的钩子函数*/
      enter(el, done) {
        let {x, y, scale} = this._getPosAndScale();
        let animation = {
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
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.transform = ''
      },
      leave(el, done) {
        let {x, y, scale} = this._getPosAndScale();
        this.$refs.cdWrapper.style.transition = 'all .4s';
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = '';
        this.$refs.cdWrapper.style[transform] = '';
      },
      /*播放暂停*/
      togglePlay() {
        this.setPlaying(!this.playing);
      },
      /*上一首*/
      prev(){
        if(!this.songReady){
          return
        }
        let index = this.currentIndex;
        if(index === 0){
          index = this.playlist.length
        }
        index--;
        this.setCurrentIndex(index);
      },
      /*下一首*/
      next(){
        if(!this.songReady){
          return;
        }
        let index = this.currentIndex;
        if(index===this.playlist.length-1){
          index = -1;
        }
        index++;
        this.setCurrentIndex(index);
      },
      /*audio标签就绪的函数*/
      ready(){
        this.songReady = true;
      },
      /*audio标签错误的函数*/
      error(){
        this.next();
      },
      /*audio结束后*/
      end(){
        this.next();
      },
      /*audio的实时*/
      updateTime(){
        this.currentTime = this.$refs.audio.currentTime;
      },
      percentChange(percent){
        let time = percent * this.currentSong.duration;
        this.$refs.audio.currentTime = time;
        if(!this.playing){
          this.togglePlay();
        }
      },
      _getPosAndScale() {
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const pattingTop = 80;
        const width = window.innerWidth * 0.8;
        const scale = targetWidth / width;
        const x = -(window.innerWidth / 2 - paddingLeft - targetWidth / 2);
        const y = (window.innerHeight - targetWidth / 2 - pattingTop - paddingBottom - width / 2);
        return {x, y, scale};
      },
      /*将时间格式化*/
      _formatTime(currentTime){
        let time = parseInt(currentTime);
        const min = parseInt(time/60);
        const sec = this._pad(time%60);
        return `${min}:${sec}`
      },
      _pad(num,n=2){
        let len = num.toString().length;
        while (len<n){
          num = '0'+num;
          len++;
        }
        return num;
      },
      ...mapMutations({
        setFullScreen: "SET_FULL_SCREEN",
        setPlaying: "SET_PLAYING_STATE",
        setCurrentIndex:'SET_CURRENT_INDEX'
      })
    },
    watch: {
      currentSong(newSong) {
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.setPlaying(true);
        })
      },
      playing(newPlaying){
        newPlaying?this.$refs.audio.play():this.$refs.audio.pause();
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
        }
      }
      .bottom {
        position: absolute;
        bottom: 100px;
        left: 0;
        width: 100%;
        .progress-wrapper{
          display: flex;
          width: 80%;
          margin: 0 auto;
          align-items: center;
          .time{
            flex: 0 0 60px;
            width: 60px;
            font-size: $font-size-small;
            color: $color-text;
            line-height: 60px;
            &.time-l{
              text-align: left;
            }
            &.time-r{
              text-align: right;
            }
          }
          .progress-bar-wrapper{
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
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      z-index: 180;
      opacity: 1;
      height: 120px;
      align-items: center;
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
        height: 80px;
        border-radius: 50%;
        padding: 0 20px 0 40px;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          &.play {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
      .text {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title {
          color: $color-text;
          font-size: $font-size-medium;
          margin-bottom: 20px;
          @include no-wrap();
        }
        .name {
          color: $color-text-l;
          font-size: $font-size-small;
          @include no-wrap();
        }
      }
      .control {
        flex: 0 0 60px;
        width: 60px;
        height: 60px;
        padding: 0 20px;
        i {
          font-size: 60px;
          color: $color-theme;
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
