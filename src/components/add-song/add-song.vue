<template>
  <transition name="slide">
    <div class='add-song' v-show="showFlag" @click.stop>
      <div class="header">
        <h4 class="title">添加歌曲到列表</h4>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :current-index="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" v-if="currentIndex===0" :data="playHistory" class="list-scroll">
            <div class="list-inner">
              <song-list :song-list="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll" v-if="currentIndex===1" :data="searchList" ref="searchList" :refresh-delay="refreshDelay">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @add="addQuery" :searches="searchList"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :show-singer="showSinger"  @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
  import SearchBox from "../../base/search-box/search-box";
  import Switches from "../../base/switches/switches";
  import SongList from "../../base/song-list/song-list";
  import {mapGetters,mapActions} from 'vuex'
  import {searchMixin} from "../../assets/js/mixins";
  import Scroll from "../../base/scroll/scroll";
  import SearchList from "../../base/search-list/search-list";
  import Suggest from "../suggest/suggest";
  import Song from '../../assets/js/song'
  import TopTip from "../../base/top-tip/top-tip";

  export default {
    name: "add-song",
    components: {TopTip, Suggest, SearchList, Scroll, SongList, Switches, SearchBox},
    mixins: [searchMixin],
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    data() {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        switches: [
          {name: '最近播放'},
          {name: '搜索历史'},
        ]
      }
    },
    methods: {
      switchItem(index) {
        this.currentIndex = index;
      },
      show() {
        this.showFlag = true;
        setTimeout(()=>{
          if(this.currentIndex === 0){
            this.$refs.songList.refresh();
          }else {
            this.$refs.searchList.refresh();
          }
        },20)
      },
      hide() {
        this.showFlag = false;
      },
      selectSuggest(){
        this.saveSearchList();
      },
      selectSong(item,index){
        if(index!==0){
          this.insertSong(new Song(item));
          this.showTip();
        }
      },
      showTip(){
        this.$refs.topTip.show();
      },
      ...mapActions([
        'insertSong'
      ])
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";
  @import "./../../assets/scss/mixin";

  .add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background: $color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all .3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .header {
      position: relative;
      height: 88px;
      text-align: center;
      .title {
        line-height: 88px;
        font-size: $font-size-large;
        color: $color-text;
      }
      .close {
        position: absolute;
        top: 0;
        right: 16px;
        .icon-close {
          display: block;
          padding: 24px;
          font-size: 40px;
          color: $color-theme;
        }
      }
    }
    .search-box-wrapper {
      margin: 40px;
    }
    .shortcut {
      .list-wrapper {
        position: absolute;
        top: 330px;
        bottom: 0;
        width: 100%;
        .list-scroll {
          height: 100%;
          overflow: hidden;
        }
        .list-inner {
          padding: 40px 60px;
        }
      }
    }
    .search-result {
      position: fixed;
      top: 248px;
      bottom: 0;
      width: 100%;
    }
    .tip-title {
      text-align: center;
      padding: 36px 0;
      font-size: 0;
      .icon-ok {
        font-size: $font-size-medium;
        color: $color-theme;
        margin-right: 8px;
      }
      .text {
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
  }
</style>
