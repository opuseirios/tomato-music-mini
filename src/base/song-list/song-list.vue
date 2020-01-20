<template>
  <div class='song-list'>
    <ul>
      <li class="item" v-for="item in songs">
        <div class="content">
          <h4 class="name">{{item.name}}</h4>
          <p class="text">{{getDesc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "song-list",
    props: {
      songs: {
        type: Array,
        default: []
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer}-${song.album}`
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
