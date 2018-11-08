<template>
    <div class='mainHeader'>
      <div class="header">
        <i class="icon-logo"></i>
        <h3 class="title">Tomato Music</h3>
      </div>
      <router-link tag="div" class="user" to="/user">
        <i class="icon-mine"></i>
      </router-link>
    </div>
</template>

<script>
    export default {
        name: 'main-header'
    }
</script>

<style lang='scss' scoped>
  @import "./../../assets/scss/mixin";
  @import "./../../assets/scss/variable";
.mainHeader{
  position: relative;
  .header{
    width: 100%;
    height: 88px;
    font-size: 0;
    text-align: center;
    .icon-logo{
      display: inline-block;
      width: 60px;
      height: 60px;
      background-size: 60px 60px;
      vertical-align: top;
      margin-top: 10px;
      @include bg-image('logo');
    }
    .title{
      display: inline-block;
      margin-left: 20px;
      font-size: $font-size-large;
      font-weight: 700;
      line-height: 88px;
      color: $color-theme;
    }
  }
  .user{
    position: absolute;
    right: 0;
    top: 0;
    padding: 20px;
    .icon-mine{
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
}
</style>
