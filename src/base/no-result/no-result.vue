<template>
  <div class='no-result'>
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{text}}</p>
  </div>
</template>

<script>
  export default {
    name: "no-result",
    props:{
      text:{
        type:String,
        default:''
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";
  @import "./../../assets/scss/mixin";

  .no-result{
    text-align: center;
    .no-result-icon{
      width: 180px;
      height: 180px;
      margin: 0 auto;
      background: url("./no-result.png") no-repeat;
      background-size: 180px 180px;
    }
    .no-result-text{
      margin-top: 60px;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
</style>
