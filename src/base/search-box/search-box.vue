<template>
  <div class='search-box'>
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" type="text" v-model="query">
    <i class="icon-dismiss" v-show="query.length" @click="clearQuery"></i>
  </div>
</template>

<script>
  import {debounce} from "../../assets/js/util";

  export default {
    name: "search-box",
    data() {
      return {
        query: ''
      }
    },
    props:{
      placeholder:{
        type:String,
        default:'搜索歌手、歌曲'
      }
    },
    created() {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      },200));
    },
    methods: {
      clearQuery() {
        this.query = '';
      },
      setQuery(query){
        this.query = query;
      },
      blur(){
        this.$refs.query.blur();
      },
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";

  .search-box{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 12px;
    height: 80px;
    background: $color-highlight-background;
    border-radius: 12px;
    .icon-search{
      font-size: 48px;
      color: $color-background;
    }
    .box{
      flex: 1;
      margin: 0 10px;
      line-height: 36px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      &::placeholder{
        color: $color-text-d;
      }
    }
    .icon-dismiss{
      font-size: 32px;
      color: $color-background;
    }
  }

</style>
