<template>
  <transition name="list-fade">
    <div class='playlist' v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h2 class="title">
            <i class="icon" :class="modeIcon" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h2>
        </div>
        <scroll :refresh-delay="refreshDelay" class="list-content" :data="sequenceList" ref="listContent">
          <ul>
            <li class="item" ref="listItem" v-for="(item,index) in sequenceList" @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like"  @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲列表</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" confirm-btn-text="清空" @confirm="confirmClear"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
  import {playMode} from "../../assets/js/config";
  import Scroll from "../../base/scroll/scroll";
  import {playlistMixin} from "../../assets/js/mixins";
  import {mapActions} from 'vuex'
  import Confirm from "../../base/confirm/confirm";
  import AddSong from "../add-song/add-song";

  export default {
    name: "playlist",
    components: {AddSong, Confirm, Scroll},
    mixins: [playlistMixin],
    computed: {
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '循环播放' : '随机播放';
      },
    },
    data() {
      return {
        showFlag: false,
        refreshDelay: 100
      }
    },
    methods: {
      show() {
        this.showFlag = true;
        setTimeout(() => {
          this.$refs.listContent.refresh();
          this.scrollToCurrent(this.currentSong)
        }, 20)
      },
      hide() {
        this.showFlag = false;
      },
      selectItem(item, index) {
        if (this.mode === playMode.random) {
          index = this.playlist.findIndex((song) => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index);
        this.setPlayingState(true);
      },
      scrollToCurrent(current) {
        const index = this.sequenceList.findIndex((song) => {
          return current.id === song.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
      },
      getCurrentIcon(item) {
        if (item.id === this.currentSong.id) {
          return 'icon-play'
        }
        return ''
      },
      deleteOne(item) {
        console.log(item);
        this.deleteSong(item);
        if (!this.playlist.length) {
          this.hide();
        }
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      confirmClear() {
        this.deleteSonglist();
        this.hide();
      },
      showAddSong(){
        this.$refs.addSong.show();
      },
      ...mapActions([
        'deleteSong',
        'deleteSonglist'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return;
        }
        this.scrollToCurrent(newSong);
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";
  @import "./../../assets/scss/mixin";

  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 20px;
            font-size: 60px;
            color: $color-theme;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            color: $color-text-d;
          }
        }
      }
      .list-content {
        max-height: 480px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 80px;
          padding: 0 60px 0 40px;
          overflow: hidden;
          &.list-enter-active, &.list-leave-active {
            transition: all .1s;
          }
          &.list-enter, &.list-leave-to {
            height: 0;
          }
          .current {
            flex: 0 0 40px;
            width: 40px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .like {
            @include extend-click();
            margin-right: 30px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
          }
        }
      }
      .list-operate {
        width: 280px;
        margin: 40px auto 60px;
        .add {
          display: flex;
          align-items: center;
          padding: 16px 32px;
          border: 2px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 10px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small-s;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 100px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
