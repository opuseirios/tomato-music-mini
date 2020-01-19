<template>
  <div class='loading'>
    <img src="./loading.gif" alt="">
    <p class="text">{{text}}</p>
  </div>
</template>

<script>
  export default {
    name: "loading",
    props: {
      text: {
        type: String,
        default: '加载中。。。'
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";

  .loading {
    text-align: center;
  }

  img {
    width: 48px;
    height: 48px;
  }

  .text {
    margin-top: 10px;
    text-align: center;
    font-size: $font-size-small;
    color: $color-text-l;
  }
</style>
