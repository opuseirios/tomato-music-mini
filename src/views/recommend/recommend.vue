<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-container" :data="data" ref="scroll">
      <div>
        <div class="slider-wrapper">
          <slider v-if="slider.length>0">
            <div v-for="item in slider">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-content">
          <h4 class="title">热门歌单推荐</h4>
          <ul>
            <li class="item" v-for="item in discList">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="">
              </div>
              <div class="content">
                <h2 class="creator">{{item.creator.name}}</h2>
                <p class="name">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="loading-container" v-show="discList.length===0">
      <loading></loading>
    </div>
  </div>

</template>

<script>
  import {getRecommendData,getDistListData} from "../../api/recommend";
  import {ERR_OK} from "../../api/config";
  import Slider from "../../base/slider/slider";
  import Scroll from "../../base/scroll/scroll";
  import Loading from "../../base/loading/loading";

  export default {
    name: 'recommend',
    components: {Loading, Scroll, Slider},
    created(){
      this._getRecommend();
      this._getDistList();
    },
    computed:{
      data(){
        return this.slider.concat(this.discList);
      }
    },
    data(){
      return{
        slider:[],
        discList:[]
      }
    },
    methods:{
      loadImage(){
        if(!this.checkLoaded){
          this.$refs.scroll.refresh();
          this.checkLoaded=true;
        }
      },
      _getRecommend(){
        getRecommendData().then((res)=>{
          if(res.code === ERR_OK){
            this.slider = res.data.slider;
          }
        })
      },
      _getDistList(){
        getDistListData().then((res)=>{
          if(res.code === ERR_OK){
            this.discList = res.data.list;
          }
        })
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
