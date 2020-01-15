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
    methods:{
      _getRecommend(){
        getRecommendData().then(res=>{
          if(res.code === ERR_OK){
            console.log(res.data);
          }
        })
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
