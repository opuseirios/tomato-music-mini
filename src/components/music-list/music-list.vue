<template>
  <div class='music-list'>
    <div class="back" ref="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-btn-wrapper" ref="playBtn" v-show="songs.length>0">
        <div class="play-btn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll class="list" @scroll="scroll" :data="songs" :probe-type="probeType" :listen-scroll="listenScroll"
            ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"/>
      </div>
    </scroll>
  </div>
</template>

<script>
  import SongList from '../../base/song-list/song-list'
  import Scroll from '../../base/scroll/scroll'
  import {prefixStyle} from "../../assets/js/dom";

  const transform = prefixStyle('transform');
  const backdrop = prefixStyle('backdrop-filter');

  export default {
    name: "music-list",
    components: {SongList, Scroll},
    props: {
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true;
    },
    mounted() {
      setTimeout(() => {
        this.imageHeight = this.$refs.bgImage.clientHeight;
        this.reserve_height = this.$refs.back.clientHeight;
        this.minTranslateY = -this.imageHeight + this.reserve_height;
        this.$refs.list.$el.style.top = `${this.imageHeight}px`
      }, 20)
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y;
      },
      back() {
        this.$router.back();
      }
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(this.minTranslateY, newY);
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        let zIndex = 0, scale = 1, blur = 0;
        const percent = Math.abs(newY / this.imageHeight);
        if (newY > 0) {
          scale = 1 + percent;
          zIndex = 10;
        } else {
          blur = Math.min(20 * percent, 20);
        }
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        if (newY < this.minTranslateY) {
          zIndex = 10;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = `${this.reserve_height}px`;
          this.$refs.playBtn.style.display = 'none';
        } else {
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.height = 0;
          this.$refs.playBtn.style.display = '';
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`;
        this.$refs.bgImage.style.zIndex = zIndex;
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
    .back {
      position: absolute;
      left: 0;
      top: 0;
      padding: 20px;
      z-index: 99;
      .icon-back {
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      z-index: 99;
      position: absolute;
      left: 10%;
      top: 20px;
      width: 80%;
      text-align: center;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      background-size: cover;
      .play-btn-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 40px;
        z-index: 12;
        .play-btn {
          width: 270px;
          height: 60px;
          margin: 0 auto;
          border: 2px solid $color-theme;
          border-radius: 60px;
          color: $color-theme;
          font-size: 0;
          .icon-play {
            padding-left: 40px;
            line-height: 60px;
            font-size: $font-size-medium-x;
            vertical-align: top;
          }
          .text {
            line-height: 60px;
            margin-left: 10px;
            font-size: $font-size-medium;
            vertical-align: top;
          }
        }
      }
      .filter {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .3);
      }
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $color-background;
    .song-list-wrapper {
      padding: 40px 60px;
    }
    .loading-container {
      position: absolute;
      left: 50%;
      top: 30%;
      transform: translateX(-50%);
    }
  }
</style>
