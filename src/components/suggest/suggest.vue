<template>
  <scroll class='suggest' :data="result">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </scroll>
</template>

<script>
  import {getSearchResult} from "../../api/search";
  import {ERR_OK} from "../../api/config";
  import {createSong} from "../../assets/js/song";
  import Scroll from "../../base/scroll/scroll";

  const TYPE_SINGER = 'singer'

  export default {
    name: "suggest",
    components: {Scroll},
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: false
      },

    },
    data() {
      return {
        result: []
      }
    },
    methods: {
      search() {
        getSearchResult(this.query, this.showSinger).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data);
            console.log(this.result);
          }
        });
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _genResult(data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normaliseSongs(data.song.list))
        }
        return ret;
      },
      _normaliseSongs(list) {
        let ret = [];
        list.forEach((item) => {
          ret.push(createSong(item))
        })
        return ret;
      }
    },
    watch: {
      query(newQuery) {
        if (newQuery.length) {
          this.search();
        }
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";
  @import "./../../assets/scss/mixin";

  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list{
      padding: 0 60px;
      .suggest-item{
        display: flex;
        align-items: center;
        padding-bottom: 40px;
      }
      .icon{
        flex: 0 0 60px;
        width: 60px;
        [class^='icon-']{
          font-size: 28px;
          color: $color-text-d;
        }
      }
      .name{
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text{
          @include no-wrap();
        }
      }
    }
  }
</style>
