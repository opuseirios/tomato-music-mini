<template>
  <div class='recommend'>

  </div>
</template>

<script>
  import {getRecommendData} from "../../api/recommend";
  import {ERR_OK} from "../../api/config";

  export default {
    name: 'recommend',
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
