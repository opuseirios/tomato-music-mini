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
        <div class="middle"
             ref="middle"
             @touchstart="middleTouchStart"
             @touchmove="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="playCls">
                <img :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="play-lyric-wrapper">
              <div class="play-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" ref="lineEl" :class="{'current':index===currentLineNum}"
                   v-for="(line,index) in currentLyric.lines">
                  {{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dots-wrapper">
            <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{_formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{_formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
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
          <progress-circle :radius="radius" :percent="percent">
            <i class="icon-mini" :class="playMiniIcon" @click.stop="togglePlay"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlaylist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
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
  import {playMode} from "../../assets/js/config";
  import Lyric from 'lyric-parser'
  import Scroll from "../../base/scroll/scroll";
  import ProgressCircle from "../../base/progress-circle/progress-circle";
  import Playlist from "../playlist/playlist";
  import {playlistMixin} from "../../assets/js/mixins";

  const transform = prefixStyle('transform');
  export default {
    name: "play",
    mixins:[playlistMixin],
    components: {Playlist, ProgressCircle, Scroll, ProgressBar},
    computed: {
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      playCls() {
        return this.playing ? 'play' : 'play pause'
      },
      playMiniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      ...mapGetters([
        'fullScreen',
        'playing',
      ])
    },
    data() {
      return {
        /*歌曲就绪*/
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        playingLyric: '',
        currentShow: 'cd',
        radius: 32
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      /*中间部分滑动，歌词和cd面来回切换*/
      middleTouchStart(e) {
        this.touch.initialed = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.startY = e.touches[0].pageY;
      },
      middleTouchMove(e) {
        if (!this.touch.initialed) {
          return;
        }
        const deltaX = e.touches[0].pageX - this.touch.startX;
        const deltaY = e.touches[0].pageY - this.touch.startY;
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          return;
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0, Math.max(left + deltaX, -window.innerWidth))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.middleL.style.opacity = 1 - this.touch.percent;
        this.$refs.lyricList.$el.style.duration = 0;
        this.$refs.middleL.style.duration = 0;
      },
      middleTouchEnd() {
        this.touch.initialed = false;
        let offsetWidth = 0;
        let opacity = 0;
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            this.currentShow = 'lyric';
            offsetWidth = -window.innerWidth;
            opacity = 0;
          } else {
            offsetWidth = 0;
            opacity = 1;
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0;
            opacity = 1;
            this.currentShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        const time = 300;
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.middleL.style.opacity = opacity;
        this.$refs.lyricList.$el.style.duration = time + 'ms';
        this.$refs.middleL.style.duration = time + 'ms';
      },
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
        if (!this.songReady) {
          return;
        }
        this.setPlayingState(!this.playing);
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      /*上一首*/
      prev() {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex;
        if (index === 0) {
          index = this.playlist.length
        }
        index--;
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlay();
        }
      },
      /*下一首*/
      next() {
        if (!this.songReady) {
          return;
        }
        let index = this.currentIndex;
        if (index === this.playlist.length - 1) {
          index = -1;
        }
        index++;
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlay();
        }
      },
      /*循环播放*/
      loop(){
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if(this.currentLyric){
          this.currentLyric.seek(0);
        }
      },
      /*audio标签就绪的函数*/
      ready() {
        this.songReady = true;
      },
      /*audio标签错误的函数*/
      error() {
        this.next();
      },
      /*audio结束后*/
      end() {
        if(this.mode === playMode.loop){
          this.loop()
        }else {
          this.next();
        }
      },
      /*audio的实时*/
      updateTime() {
        const audio = this.$refs.audio;
        if (audio) {
          this.currentTime = audio.currentTime;
          /*歌词同步*/
          if (this.currentLyric) {
            this.currentLyric.seek(this.currentTime * 1000);
          }
        }
      },
      percentChange(percent) {
        let time = percent * this.currentSong.duration;
        this.$refs.audio.currentTime = time;
        if (!this.playing) {
          this.togglePlay();
        }
      },
      /*获取歌词*/
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum;
        if (lineNum > 5) {
          let lineEl = this.$refs.lineEl[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      showPlaylist(){
        this.$refs.playlist.show();
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
      _formatTime(currentTime) {
        let time = parseInt(currentTime);
        const min = parseInt(time / 60);
        const sec = this._pad(time % 60);
        return `${min}:${sec}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num;
      },
      ...mapMutations({
        setFullScreen: "SET_FULL_SCREEN",
      })
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!newSong) {
          return;
        }
        if (oldSong && oldSong.id === newSong.id) {
          return;
        }
        if(this.currentLyric){
          this.currentLyric.stop();
          this.playingLyric = '';
          this.currentTime = 0;
          this.currentLineNum = 0;
        }
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.getLyric();
        })
      },
      playing(newPlaying) {
        const audio = this.$refs.audio;
        if (audio) {
          newPlaying ? audio.play() : audio.pause();
        }
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
        position: relative;
        flex: 0 0 60px;
        width: 60px;
        height: 60px;
        padding: 0 20px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 60px;
          color: $color-theme-d;
        }
        .icon-mini {
          font-size: 64px;
          position: absolute;
          left: 0;
          top: 2px;
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
