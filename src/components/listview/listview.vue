<template>
  <scroll
    class='listview'
    :data="singerList"
    ref="listview"
    :probe-type="probeType"
    :listen-scroll="listenScroll"
    @scroll="scroll"
  >
    <ul>
      <li class="list-group" v-for="singerGroup in singerList" ref="listGroup">
        <h4 class="title">{{singerGroup.title}}</h4>
        <ul>
          <li class="list-group-item" v-for="singer in singerGroup.items">
            <div class="icon">
              <img v-lazy="singer.imgUrl" alt="">
            </div>
            <div class="name">{{singer.name}}</div>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="listTouchStart" @touchmove="listTouchMove" ref="listShortCut">
      <ul>
        <li ref="shortcutItem" class="item" :class="{'current':index===currentIndex}" :data-index="index"
            v-for="(item,index) in shortcutList" @click="">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="listFixed">
      <h4 class="fixed-title">{{fixedTitle}}</h4>
    </div>
    <div class="loading-container" v-show="!singerList.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from "../../base/scroll/scroll";
  import {getData} from "../../assets/js/dom";
  import Loading from "../../base/loading/loading";

  export default {
    name: "listview",
    components: {Loading, Scroll},
    props: {
      singerList: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        scrollY: -1,
        listHeight: [],
        currentIndex: 0,
        diff: 0
      }
    },
    computed: {
      shortcutList() {
        let list = [];
        if (!this.singerList) {
          return;
        }
        this.singerList.forEach((item) => {
          list.push(item.title.slice(0, 1))
        })
        return list;
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.singerList[this.currentIndex] ? this.singerList[this.currentIndex].title : ''
      }
    },
    created() {
      this.touch = {};
      this.listenScroll = true;
      this.probeType = 3;
    },
    mounted() {
      setTimeout(() => {
        this.fixedTitleHeight = this.$refs.listFixed.clientHeight;
      }, 200)

    },
    methods: {
      listTouchStart(e) {
        const index = getData(e.target, 'index');
        this.touch.startY = e.touches[0].pageY;
        this.touch.anchorIndex = index;
        this.touch.shortcutHeight = parseInt(this.$refs.shortcutItem[0].clientHeight);
        this._scrollTo(index);
      },
      listTouchMove(e) {
        const deltaY = e.touches[0].pageY - this.touch.startY;
        const deltaIndex = (deltaY / this.touch.shortcutHeight | 0) + parseInt(this.touch.anchorIndex);
        this._scrollTo(deltaIndex);
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      _scrollTo(index) {
        if (!index) {
          return;
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2;
        }
        this.scrollY = -this.listHeight[index];
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 400);
      },
      _calculateHeight() {
        let height = 0;
        this.listHeight.push(height);
        this.$refs.listGroup.forEach((item) => {
          height += item.clientHeight;
          this.listHeight.push(height)
        })
      }
    },
    watch: {
      scrollY(newY) {
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (-newY < height2 && -newY >= height1) {
            this.currentIndex = i;
            this.diff = height2 + newY;
            return;
          }
        }
        this.currentIndex = this.listHeight.length - 2;
      },
      singerList() {
        setTimeout(() => {
          this._calculateHeight();
        }, 20)
      },
      diff(newDiff) {
        let fixedTop = (newDiff > 0 && newDiff < this.fixedTitleHeight)
          ? newDiff - this.fixedTitleHeight : 0;
        this.$refs.listFixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";

  .listview {
    position: relative;
    height: 100%;
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
    top: 0;
    .fixed-title {
      height: 60px;
      background: $color-highlight-background;
      color: $color-text-l;
      font-size: $font-size-small;
      padding-left: 40px;
      line-height: 60px;
    }
  }
  .loading-container{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
</style>
