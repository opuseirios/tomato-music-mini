<template>
  <div class='recommend'>
    <div class="slider-wrapper">
      <slider v-if="slider.length>0">
        <div v-for="item in slider">
          <a :href="item.linkUrl">
            <img :src="item.picUrl" alt="">
          </a>
        </div>
      </slider>
    </div>
  </div>
</template>

<script>
  import {getRecommendData} from "../../api/recommend";
  import {ERR_OK} from "../../api/config";
  import Slider from "../../base/slider/slider";

  export default {
    name: 'recommend',
    components: {Slider},
    created(){
      this._getRecommend();
    },
    data(){
      return{
        slider:[]
      }
    },
    methods:{
      _getRecommend(){
        getRecommendData().then((res)=>{
          if(res.code === ERR_OK){
            this.slider = res.data.slider;
          }
        })
      }
    }
  }
</script>

<style lang='scss' scoped>
  .recommend {
    position: fixed;
    top: 176px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }
</style>
