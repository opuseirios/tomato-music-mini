<template>
  <div class='slider' ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span v-for="(item,index) in dots" class="dot" :class="{'active':index===pageNum-1}"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import {addClass} from "../../assets/js/dom";

  export default {
    name: "slider",
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 1,
        pageNum: 1
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return;
        }
        this._setSliderWidth(true);
        this.slider.refresh();
      })
    },
    methods: {
      //计算轮播图的宽度
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;

        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');
          child.style.width = sliderWidth + 'px';
          width += sliderWidth;
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      //初始化dot
      _initDots() {
        this.dots = new Array(this.children.length);
      },
      _initSlider() {
        if(!this.$refs.slider){
          return;
        }
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            speed: 4000,
            threshold: 0.3
          }
        })
        //监听滚动后
        this.slider.on('scrollEnd', () => {
          this.currentPageIndex = this.slider.getCurrentPage().pageX;
          this.currentPageIndex++;
          this.pageNum = this.currentPageIndex;
          if (this.currentPageIndex >= this.children.length - 2) {
            this.currentPageIndex = 0;
          }
          if (this.autoPlay) {
            this._play();
          }
        })

        this.slider.on('beforeScrollStart', () => {
          clearTimeout(this.timer);
        })
      },
      _play() {
        this.timer = setTimeout(() => {
          this.slider.goToPage(this.currentPageIndex, 0, 400)
        }, this.interval)
      }
    },
    destroyed(){
      clearTimeout(this.timer);
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";

  .slider {
    min-height: 1px;
    position: relative;
    .slider-group {
      position: relative;
      overflow: hidden;
      .slider-item {
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        a {
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
          img {
            display: block;
            width: 100%;
          }
        }
      }
    }
    .dots {
      position: absolute;
      bottom: 12px;
      width: 100%;
      left: 0;
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        margin: 0 8px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: $color-text-l;
        &.active {
          width: 40px;
          border-radius: 10px;
          background: $color-text-ll;
        }
      }
    }
  }
</style>
