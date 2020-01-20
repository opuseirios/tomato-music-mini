<template>
  <scroll
    class='listview'
    :data="data"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    ref="listview"
    @scroll="scroll"
  >
    <ul>
      <li class="list-group" v-for="group in data" ref="group">
        <h4 class="title">{{group.title}}</h4>
        <ul>
          <li class="list-group-item" v-for="item in group.items" @click="selectItem(item)">
            <div class="icon">
              <img v-lazy="item.avatar" alt="">
            </div>
            <p class="name">{{item.name}}</p>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
         @touchstart="onShortcutTouchStart"
         @touchmove="onShortcutTouchMove"
    >
      <ul>
        <li
          ref="shortcutItem"
          class="item"
          :class="{'current':index===currentIndex}"
          v-for="(item,index) in shortcutList"
          :data-index="index"
        >{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <Loading />
    </div>
  </scroll>
</template>

<script>
  import Scroll from '../scroll/scroll'
  import {getData} from "../../assets/js/dom";
  import Loading from '../loading/loading'

  export default {
    name: "listview",
    components: {
      Loading,
      Scroll
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff:0
      }
    },
    created() {
      this.touch = {};
      this.listenScroll = true;
      this.probeType = 3;
      this.heightList = [];
    },
    mounted() {
      setTimeout(() => {
        this.fixedTitleHeight = this.$refs.fixed.clientHeight;
      }, 200)
    },
    computed: {
      shortcutList() {
        return this.data.map(item => {
          return item.title.slice(0, 1);
        })
      },
      fixedTitle(){
        if(this.scrollY>0){
          return ''
        }
        return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        const anchorIndex = getData(e.target, 'index');
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;
        this.touch.shortcutHeight = parseInt(this.$refs.shortcutItem[0].clientHeight)
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        const delta = (this.touch.y2 - this.touch.y1) / this.touch.shortcutHeight | 0;
        const anchorIndex = parseInt(this.touch.anchorIndex) + delta;
        console.log(anchorIndex);
        this._scrollTo(anchorIndex)
      },
      //监听页面滚动
      scroll(pos) {
        this.scrollY = pos.y;
      },
      selectItem(item){
        this.$emit('select',item);
      },
      _scrollTo(index) {
        if(!index&&index!==0){
          return;
        }
        if(index<0){
          index=0
        }else if(index>this.heightList.length-2){
          index = this.heightList.length-2;
        }
        this.scrollY = -this.heightList[index];
        this.$refs.listview.scrollToElement(this.$refs.group[index], 0);
      },
      _calculateHeight() {
        this.heightList = [];
        let height = 0;
        this.heightList.push(height);
        for (let i = 0; i < this.$refs.group.length; i++) {
          const group = this.$refs.group[i];
          height += group.clientHeight;
          this.heightList.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight();
        }, 20)
      },
      scrollY(newY) {
        let heightList = this.heightList;
        if (newY > 0) {
          this.currentIndex = 0;
          return
        }
        for (let i = 0; i < heightList.length - 1; i++) {
          const height1 = heightList[i];
          const height2 = heightList[i + 1];
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i;
            this.diff = newY+height2;
            return;
          }
        }
        this.currentIndex = heightList.length - 2;
      },
      diff(newDiff){
        let fixedTop = (newDiff > 0 && newDiff < this.fixedTitleHeight)
          ? newDiff - this.fixedTitleHeight : 0;
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";

  .listview {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .list-group {
      .title {
        height: 60px;
        background: $color-highlight-background;
        color: $color-text-l;
        font-size: $font-size-small;
        padding-left: 40px;
        line-height: 60px;
      }
      .list-group-item {
        display: flex;
        padding-top: 40px;
        padding-left: 60px;
        &:last-child {
          padding-bottom: 40px;
        }
        .icon {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
          }
        }
        .name {
          flex: 1;
          margin-left: 40px;
          display: flex;
          align-items: center;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
    }
    .list-shortcut {
      position: fixed;
      right: 0;
      top: 22%;
      width: 40px;
      padding: 40px 0;
      border-radius: 40px;
      background: $color-background-d;
      .item {
        text-align: center;
        color: $color-text-l;
        font-size: $font-size-small-s;
        line-height: 40px;
        &.current {
          color: $color-theme;
        }
      }
    }
  }

  .list-fixed {
    position: absolute;
    left: 0;
    right: 0;
    top: -2px;
    .fixed-title {
      height: 60px;
      background: $color-highlight-background;
      color: $color-text-l;
      font-size: $font-size-small;
      padding-left: 40px;
      line-height: 60px;
    }
  }

  .loading-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
