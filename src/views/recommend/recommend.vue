<template>
  <div class='recommend'>
    <div v-if="recommends.length" class="slider">
      <Slider>
        <div v-for="item in recommends">
          <a :href="item.linkUrl">
            <img :src="item.picUrl" alt="">
          </a>
        </div>
      </Slider>
    </div>
  </div>
</template>

<script>
  import Slider from '../../base/slider/slider'
  import {getRecommendData} from "../../api/recommend";
  import {ERR_OK} from "../../api/config";

  export default {
    name: 'recommend',
    created(){
      this._getRecommend();
    },
    components: {Slider},
    data(){
      return{
        recommends:[]
      }
    },
    methods:{
      _getRecommend(){
        getRecommendData().then(res=>{
          if(res.code === ERR_OK){
            this.recommends = res.data.slider;
          }
        })
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
