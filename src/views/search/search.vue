<template>
  <div class='search'>
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h3 class="title">热门搜索</h3>
          <ul>
            <li class="item" v-for="item in hotKeys" @click="selectHotKey(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script>
  import SearchBox from "../../base/search-box/search-box";
  import {getHotkeyData} from "../../api/search";
  import {ERR_OK} from "../../api/config";
  import Suggest from "../../components/suggest/suggest";

  export default {
    name: 'search',
    components: {Suggest, SearchBox},
    data(){
      return{
        hotKeys:[],
        query:''
      }
    },
    created(){
      this._getHotKeys();
    },
    methods:{
      selectHotKey(key){
        this.$refs.searchBox.addQuery(key);
      },
      onQueryChange(query){
        this.query = query;
      },
      _getHotKeys(){
        getHotkeyData().then((res)=>{
          if(res.code === ERR_OK){
            this.hotKeys = res.data.hotkey.slice(0,10);
          }
        })
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "./../../assets/scss/variable";

  .search {
    .search-box-wrapper{
      margin: 40px;
    }
    .shortcut-wrapper{
      position: fixed;
      left: 0;
      right: 0;
      top: 356px;
      bottom: 0;
      .shortcut{
        height: 100%;
        overflow: hidden;
        .hot-key{
          margin: 0 40px 40px 40px;
          .title{
            margin-bottom: 40px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .item{
            display: inline-block;
            padding: 10px 20px;
            margin: 0 40px 20px 0;
            border-radius: 12px;
            background: $color-highlight-background;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .search-result{
      position: fixed;
      left: 0;
      right: 0;
      top: 356px;
      bottom: 0;
    }
  }
</style>
