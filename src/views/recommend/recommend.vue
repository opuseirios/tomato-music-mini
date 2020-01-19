<template>
  <div class='recommend'>
    <scroll ref="scroll" class="recommend-container" :data="distList">
      <div>
        <div v-if="recommends.length" class="slider">
          <Slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needclick" @load="loadImage" :src="item.picUrl" alt="">
              </a>
            </div>
          </Slider>
        </div>
        <div class="recommend-content">
          <h4 class="title">热门歌单推荐</h4>
          <ul>
            <li class="item" v-for="item in distList">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="">
              </div>
              <div class="content">
                <h4 class="creator">{{item.creator.name}}</h4>
                <p class="name">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="loading-container" v-show="!distList.length">
      <Loading />
    </div>
  </div>
</template>

<script>
  import Slider from '../../base/slider/slider'
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import {getRecommendData,getDiscList} from "../../api/recommend";
  import {ERR_OK} from "../../api/config";

  export default {
    name: 'recommend',
    created(){
      this._getRecommend();
      this._getDiscList();
    },
    components: {Loading, Scroll, Slider},
    data(){
      return{
        recommends:[],
        distList:[]
      }
    },
    methods:{
      //获取轮播图数据
      _getRecommend(){
        getRecommendData().then(res=>{
          if(res.code === ERR_OK){
            this.recommends = res.data.slider;
          }
        })
      },
      //获取首页歌单数据
      _getDiscList(){
        getDiscList().then(res=>{
          if(res.code === ERR_OK){
            this.distList = res.data.list;
          }
        })
      },
      loadImage(){
        if(!this.checkLoaded){
          this.$refs.scroll.refresh()
        }
        this.checkLoaded = true;
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "./../../assets/scss/variable";
  @import "./../../assets/scss/mixin";
  .recommend {
    position: fixed;
    top: 176px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .recommend-container{
      height: 100%;
      overflow: hidden;
    }
    .recommend-content{
      .title{
        line-height: 128px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item{
        display: flex;
        padding: 0 40px 40px 40px;
        .icon{
          flex: 0 0 120px;
          width: 120px;
          height: 120px;
          img{
            width: 100%;
          }
        }
        .content{
          flex: 1;
          margin-left: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          @include no-wrap();
          .creator{
            font-size: $font-size-medium;
            color: $color-text-ll;
            margin-bottom: 30px;
          }
          .name{
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
    }
  }
  .loading-container{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
