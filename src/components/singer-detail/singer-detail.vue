<template>
    <transition name="slide">
      <div class='singer-detail'>
        singer-detail
      </div>
    </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "singer-detail",
    computed:{
      ...mapGetters([
        'singer'
      ])
    }
  }
</script>

<style scoped lang='scss'>
  @import "../../assets/scss/variable";
.singer-detail{
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
  .slide-enter-active,.slide-leave-active{
    transition: all .3s
  }
  .slide-enter,.slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
