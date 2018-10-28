<template>
  <div class='music-list'>
    <div class="back" @click="back" ref="back">
      <i class="icon-back"></i>
    </div>
    <div class="title">{{title}}</div>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-btn-wrapper" ref="playBtn">
        <div class="play-btn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll
      class="list"
      ref="list"
      :listen-scroll="listenScroll"
      :probe-type="probeType"
      @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <song-list :song-list="songList" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!songList.length">
        <loading text=""></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import SongList from "../../base/song-list/song-list";
  import Scroll from "../../base/scroll/scroll";
  import {prefixStyle} from "../../assets/js/dom";
  import Loading from "../../base/loading/loading";
  import {mapActions} from 'vuex'

  const transform = prefixStyle('transform');
  const backDrop = prefixStyle('backdrop-filter');

  export default {
    name: "music-list",
    components: {Loading, Scroll, SongList},
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      songList: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        scrollY: -1
      }
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true;
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight;
      this.reserve_height = this.$refs.back.clientHeight;
      this.$refs.list.$el.style.top = this.imageHeight + 'px';
      this.minTranslateY = -this.imageHeight + this.reserve_height;
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    methods: {
      back() {
        this.$router.back();
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      selectItem(item,index) {
        this.selectPlay({
          list:this.songList,
          index:index
        })
      },
      ...mapActions([
        'selectPlay'
      ])
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(newY, this.minTranslateY);
        let zIndex = 0;
        let blur = 0;
        let scale = 1;
        const percent = Math.abs(newY / parseFloat(this.imageHeight));
        this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`
        if (newY > 0) {
          scale = percent + 1;
        } else {
          blur = Math.min(20, 20 * percent);
        }
        this.$refs.filter.style[backDrop] = `blur(${blur}px)`
        if (newY <= this.minTranslateY) {
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = this.reserve_height + 'px';
          this.$refs.playBtn.style.display = 'none'
          zIndex = 10;
        } else {
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.height = 0;
          this.$refs.playBtn.style.display = ''
          zIndex = 0;
        }
        this.$refs.bgImage.style.zIndex = zIndex;
        this.$refs.bgImage.style[transform] = `scale(${scale})`;
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
