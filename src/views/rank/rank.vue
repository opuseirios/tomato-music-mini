<template>
  <div class='rank' ref="rank">
    <scroll class="topList" ref="topList" :data="topList">
      <ul>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.picUrl" alt="">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-container" v-show="!topList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getRankData} from "../../api/rank";
  import {ERR_OK} from "../../api/config";
  import Scroll from "../../base/scroll/scroll";
  import Loading from "../../base/loading/loading";
  import {playerMixin} from "../../assets/js/mixins";
  import {mapMutations} from 'vuex';

  export default {
    name: 'rank',
    components: {Loading, Scroll},
    mixins: [playerMixin],
    created() {
      this._getTopList();
    },
    data() {
      return {
        topList: []
      }
    },
    methods: {
      handlePlaylist(list) {
        const bottom = list.length > 0 ? '60px' : 0;
        this.$refs.rank.style.bottom = bottom;
        this.$refs.topList.refresh();
      },
      selectItem(item) {
        this.setDisc(item);
        this.$router.push({
          path:`/rank/${item.id}`
        })
      },
      _getTopList() {
        getRankData().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList;
          }
        })
      },
      ...mapMutations({
        setDisc:"SET_DISC"
      })
    }
  }
</script>

<style lang='scss' scoped>
  @import "./../../assets/scss/variable";
  @import "./../../assets/scss/mixin";

  .rank {
    position: fixed;
    top: 176px;
    bottom: 0;
    left: 0;
    right: 0;
    background: $color-background;
    .topList {
      height: 100%;
      overflow: hidden;
      .item {
        display: flex;
        margin: 0 40px;
        padding-top: 40px;
        height: 200px;
        &:last-child {
          padding-bottom: 40px;
        }
        .icon {
          flex: 0 0 200px;
          width: 200px;
          height: 200px;
          img {
            width: 200px;
            height: 200px;
          }
        }
        .songlist {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 40px;
          overflow: hidden;
          background: $color-highlight-background;
          color: $color-text-d;
          font-size: $font-size-small;
          .song {
            @include no-wrap();
            line-height: 50px;
          }
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
