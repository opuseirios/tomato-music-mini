<template>
  <div class='search-list' v-show="searches.length">
    <transition-group tag="ul" name="list">
      <li :key="item" class="search-item" v-for="item in searches">
        <span class="text" @click="add(item)">{{item}}</span>
        <div class="icon" @click="deleteOne(item)">
          <i class="icon-delete"></i>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
  export default {
    name: 'search-list',
    props:{
      searches:{
        type:Array,
        default:[]
      }
    },
    methods:{
      add(item){
        this.$emit('add',item)
      },
      deleteOne(item){
        this.$emit('delete',item)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "./../../assets/scss/variable";
  @import "./../../assets/scss/mixin";
  .search-list{
    .search-item{
      display: flex;
      align-items: center;
      height: 80px;
      overflow: hidden;
      &.list-enter-active,&.list-leave-active{
        transition: all .1s;
      }
      &.list-enter,&.list-leave-to{
        height: 0;
      }
      .text{
        flex: 1;
        color: $color-text-l;
      }
      .icon{
        @include extend-click();
        .icon-delete{
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
</style>
