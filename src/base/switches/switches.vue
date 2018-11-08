<template>
  <ul class='switches'>
    <li class="switch-item"
        v-for="(item,index) in switches"
        :class="{'active':index===currentIndex}"
        @click="switchItem(index)"
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "switches",
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem(index) {
        this.$emit('switch', index);
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";

  .switches {
    display: flex;
    align-items: center;
    width: 480px;
    margin: 0 auto;
    border: 2px solid $color-highlight-background;
    border-radius: 10px;
    .switch-item {
      flex: 1;
      padding: 16px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text-d;
      &.active {
        background: $color-highlight-background;
        color: $color-text;
      }
    }
  }
</style>
