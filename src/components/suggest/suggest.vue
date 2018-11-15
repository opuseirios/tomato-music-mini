<template>
  <scroll class='suggest'
          :data="result"
          ref="suggest"
          :pull-up="pullUp"
          @scrollToEnd="searchMore"
          :before-scroll="beforeScroll"
          @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="this.hasMore" text=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore&&!result.length">
      <no-result text="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
  import {getSearchResult} from "../../api/search";
  import {ERR_OK} from "../../api/config";
  import {createSong} from "../../assets/js/song";
  import {getVkey} from "../../api/song";
  import Scroll from "../../base/scroll/scroll";
  import Loading from "../../base/loading/loading";
  import NoResult from "../../base/no-result/no-result";
  import {Singer} from "../../assets/js/singer";
  import {mapActions,mapMutations} from 'vuex';

  const TYPE_SINGER = 'singer';
  const PER_PAGE = 20;

  export default {
    name: "suggest",
    components: {NoResult, Loading, Scroll},
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
        result: [],
        hasMore:true,
        page:1,
        pullUp:true,
        beforeScroll:true
      }
    },
    methods: {
      refresh(){
        this.$refs.suggest.refresh();
      },
      search() {
        this.page = 1;
        this.hasMore = true;
        this.$refs.suggest.scrollTo(0,0);
        getSearchResult(this.query, this.showSinger,this.page,PER_PAGE).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data);
            console.log(this.result);
            this._checkMore(res.data);
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
      searchMore(){
        if(!this.hasMore){
          return;
        }
        this.page++;
        getSearchResult(this.query, this.showSinger,this.page,PER_PAGE).then((res) => {
          if (res.code === ERR_OK) {
            let data = this._genResult(res.data);
            if(data.length>PER_PAGE){
              data = data.slice(1);
            }
            this.result = this.result.concat(data);
            this._checkMore(res.data);
          }
        });
      },
      listScroll(){
        this.$emit('listScroll');
      },
      selectItem(item){
        /*如果选择歌手*/
        if(item.type === TYPE_SINGER){
          const singer = new Singer({
            mid:item.singermid,
            name:item.singername
          })
          this.$router.push({
            path:`/search/${singer.mid}`
          })
          this.setSinger(singer);
        }else {
          this.insertSong(item);
        }
        this.$emit('select')
      },
      /*将数据分为歌手和歌曲两部分*/
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
        list.forEach((musicData) => {
          // getVkey(musicData.songmid).then((res)=>{
          //   if(res.code === ERR_OK){
          //     let data = res.data.items[0];
          //     let url = `http://dl.stream.qqmusic.qq.com/${data.filename}?vkey=${data.vkey}&guid=7332953645&fromtag=66`;
              ret.push(createSong(musicData,''));
            // }
          // })
        })
        console.log(ret);
        return ret;
      },
      _checkMore(data){
        const song = data.song;
        if(!song.list.length||(song.curnum+song.curpage*PER_PAGE)>song.totalnum){
          this.hasMore = false;
        }
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
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
