<template>
  <scroll class='listview' :data="singerList" ref="listview">
    <ul >
      <li class="list-group" v-for="singerGroup in singerList">
        <h4 class="title">{{singerGroup.title}}</h4>
        <ul>
          <li class="list-group-item" v-for="singer in singerGroup.items">
            <div class="icon">
              <img v-lazy="singer.imgUrl" alt="">
            </div>
            <div class="name">{{singer.name}}</div>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="listTouchStart">
      <ul>
        <li  ref="shortcutItem" class="item" :class="{'current':index===0}" :data-index="index" v-for="(item,index) in shorcutList" >{{item}}</li>
      </ul>
    </div>
  </scroll>
</template>

<script>
  import Scroll from "../../base/scroll/scroll";
  export default {
    name: "listview",
    components: {Scroll},
    props:{
      singerList:{
        type:Array,
        default:null
      }
    },
    computed:{
      shorcutList(){
        let list = [];
        if(!this.singerList){
          return;
        }
        this.singerList.forEach((item)=>{
          list.push(item.title.slice(0,1))
        })
        return list;
      }
    },
    methods:{
      listTouchStart(){

      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";
.listview{
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .list-group{
    .title{
      height: 60px;
      background: $color-highlight-background;
      color: $color-text-l;
      font-size: $font-size-small;
      padding-left: 40px;
      line-height: 60px;
    }
    .list-group-item{
      display: flex;
      padding-top: 40px;
      padding-left: 60px;
      &:last-child{
        padding-bottom: 40px;
      }
      .icon{
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        img{
          width: 100%;
        }
      }
      .name{
        flex: 1;
        margin-left: 40px;
        display: flex;
        align-items: center;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
    }
  }
  .list-shortcut{
    position: fixed;
    right: 0;
    top: 22%;
    width: 40px;
    padding: 40px 0;
    border-radius: 40px;
    background: $color-background-d;
    .item{
      text-align: center;
      color: $color-text-l;
      font-size: $font-size-small-s;
      line-height: 40px;
      &.current{
        color: $color-theme;
      }
    }
  }
}
</style>
