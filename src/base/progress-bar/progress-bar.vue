<template>
  <div class='progress-bar' ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtnWrapper"
        @touchstart.prevent="onProgressTouchStart"
        @touchmove.prevent="onProgressTouchMove"
        @touchend="onProgressTouchEnd"
      >
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from "../../assets/js/dom";

  const transform = prefixStyle('transform');

  export default {
    name: "progress-bar",
    created() {
      this.touch = {};
    },
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    methods: {
      onProgressTouchStart(e) {
        this.touch.initialied = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth;
      },
      onProgressTouchMove(e) {
        if (!this.touch.initialied) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX;
        const barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth;
        const offsetWidth = Math.min(Math.max(0, this.touch.left + deltaX), barWidth);
        this._offsetStyle(offsetWidth);
      },
      onProgressTouchEnd() {
        this.touch.initialied = false;
        this._triggerPercent();
      },
      progressClick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect();
        const offsetWidth = e.pageX - rect.left;
        this._offsetStyle(offsetWidth);
        this._triggerPercent();
      },
      _offsetStyle(offsetWidth) {
        this.$refs.progressBtnWrapper.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.progress.style.width = offsetWidth + 'px';
      },
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth;
        const percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit('percentChange', percent);
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initialied) {
          const barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth;
          const offsetWidth = newPercent * barWidth;
          this._offsetStyle(offsetWidth);
        }
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "./../../assets/scss/variable";

  .progress-bar {
    height: 60px;
    .bar-inner {
      position: relative;
      top: 26px;
      height: 8px;
      background: rgba(0, 0, 0, .3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        top: -26px;
        left: -16px;
        width: 60px;
        height: 60px;
        .progress-btn {
          position: relative;
          top: 14px;
          left: 14px;
          box-sizing: border-box;
          width: 32px;
          height: 32px;
          border: 6px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
