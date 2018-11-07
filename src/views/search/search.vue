<template>
  <div class='search'>
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shorcutWrapper">
      <scroll class="shortcut" :refresh-delay="refreshDelay" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h3 class="title">热门搜索</h3>
            <ul>
              <li class="item" v-for="item in hotKeys" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchList.length">
            <h3 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h3>
            <search-list :searches="searchList" @add="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>

      </scroll>
    </div>
    <div class="search-result" v-show="query"  ref="searchResult">
      <suggest :query="query" :show-singer="showSigner" ref="suggest" @select="saveSearchList"></suggest>
    </div>
    <router-view></router-view>
    <confirm ref="confirm" text="是否清空所有搜索历史？" confirm-btn-text="清空" @confirm="clearSearchHistory"></confirm>
  </div>
</template>

<script>
  import SearchBox from "../../base/search-box/search-box";
  import {getHotkeyData} from "../../api/search";
  import {ERR_OK} from "../../api/config";
  import Suggest from "../../components/suggest/suggest";
  import {mapActions, mapGetters} from 'vuex';
  import SearchList from "../../base/search-list/search-list";
  import Scroll from "../../base/scroll/scroll";
  import Confirm from "../../base/confirm/confirm";
  import {playerMixin} from "../../assets/js/mixins";

  export default {
    name: 'search',
    components: {Confirm, Scroll, SearchList, Suggest, SearchBox},
    mixins:[playerMixin],
    data() {
      return {
        hotKeys: [],
        query: '',
        showSigner: true,
        refreshDelay: 100
      }
    },
    computed: {
      shortcut() {
        return this.hotKeys.concat(this.searchList);
      },
      ...mapGetters([
        'searchList'
      ])
    },
    created() {
      this._getHotKeys();
    },
    methods: {
      handlePlaylist(playlist){
        const bottom = playlist.length>0?'60px':0;
        this.$refs.shorcutWrapper.style.bottom = bottom;
        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.shortcut.refresh();
        this.$refs.suggest.refresh();
      },
      addQuery(key) {
        this.$refs.searchBox.addQuery(key);
      },
      onQueryChange(query) {
        this.query = query;
      },
      saveSearchList() {
        this.saveSearchHistory(this.query);
      },
      showConfirm() {
        console.log(1);
        this.$refs.confirm.show();
      },
      _getHotKeys() {
        getHotkeyData().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKeys = res.data.hotkey.slice(0, 10);
          }
        })
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ])
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "./../../assets/scss/variable";
  @import "./../../assets/scss/mixin";

  .search {
    .search-box-wrapper {
      margin: 40px;
    }
    .shortcut-wrapper {
      position: fixed;
      left: 0;
      right: 0;
      top: 356px;
      bottom: 0;
      .shortcut {
        height: 100%;
        overflow: hidden;
        .hot-key {
          margin: 0 40px 40px 40px;
          .title {
            margin-bottom: 40px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .item {
            display: inline-block;
            padding: 10px 20px;
            margin: 0 40px 20px 0;
            border-radius: 12px;
            background: $color-highlight-background;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
        .search-history {
          position: relative;
          margin: 0 40px;
          .title {
            display: flex;
            align-items: center;
            height: 80px;
            font-size: $font-size-medium;
            color: $color-text-l;
            .text {
              flex: 1;
            }
            .clear {
              @include extend-click();
              .icon-clear {
                font-size: $font-size-medium;
                color: $color-text-d;
              }
            }
          }
        }
      }
    }
    .search-result {
      position: fixed;
      left: 0;
      right: 0;
      top: 356px;
      bottom: 0;
    }
  }
</style>
