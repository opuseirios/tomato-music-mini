<template>
  <div class='tabs'>
    <router-link class="tab-item" tag="div" to="/recommend">
      <span class="item">推荐</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/singer">
      <span class="item">歌手</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/rank">
      <span class="item">排行</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/search">
      <span class="item">搜索</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/radio">
      <span class="item">电台</span>
    </router-link>

  </div>
</template>

<script>
  export default {
    name: "tabs"
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";
.tabs{
  height: 88px;
  display: flex;
  .tab-item{
    flex: 1;
    text-align: center;
    .item{
      line-height: 88px;
      color: $color-text-l;
      font-size: $font-size-medium;
      padding-bottom: 12px;
    }
    &.router-link-active{
      .item{
        color: $color-theme;
        border-bottom: 4px solid $color-theme;
      }
    }
  }
}
</style>
