<template>
  <transition name="confirm-fade">
    <div class='confirm' v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'confirm',
    data(){
      return{
        showFlag:false
      }
    },
    props:{
      text:{
        type:String,
        default:''
      },
      confirmBtnText:{
        type:String,
        default:"确定"
      },
      cancelBtnText:{
        type:String,
        default:'取消'
      }
    },
    methods:{
      show(){
        this.showFlag = true;
      },
      hide(){
        this.showFlag = false;
      },
      confirm(){
        this.hide();
        this.$emit('confirm');
      },
      cancel(){
        this.hide();
        this.$emit('cancel');
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "./../../assets/scss/variable";

  .confirm{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background: $color-background-d;
    &.confirm-fade-enter-active{
      animation: confirm-fadein 0.3s;
      .confirm-content {
        animation: confirm-zoom 0.3s;
      }
    }
    .confirm-wrapper{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      z-index: 999;
      .confirm-content{
        width: 540px;
        border-radius: 26px;
        background: $color-highlight-background;
        .text{
          padding: 40px 30px;
          line-height: 44px;
          text-align: center;
          font-size: $font-size-large;
          color: $color-text-l;
        }
        .operate{
          display: flex;
          align-items: center;
          text-align: center;
          font-size: $font-size-large;
          .operate-btn{
            flex: 1;
            line-height: 44px;
            padding: 20px 0;
            border-top: 2px solid $color-background-d;
            color: $color-text-d;
            &.left{
              border-right: 2px solid $color-background-d;
            }
          }
        }
      }
    }
  }
  @keyframes confirm-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes confirm-zoom {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
