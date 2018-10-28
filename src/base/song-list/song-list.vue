<template>
  <div class='song-list'>
    <ul>
      <li class="item" v-for="(item,index) in songList" @click="selectItem(item,index)">
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="text">{{item.singer}}-{{item.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "song-list",
    props: {
      songList: {
        type: Array,
        default: null
      }
    },
    methods: {
      selectItem(item, index) {
        this.$emit('select', item, index)
      }
    }

  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";
  @import "./../../assets/scss/mixin";

  .song-list {
    .item {
      height: 128px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      font-size: $font-size-small;
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-items: center;
        @include no-wrap();
        .name {
          color: $color-text;
          margin-bottom: 20px;
        }
        .text {
          color: $color-text-l;
        }
      }
    }
  }
</style>
