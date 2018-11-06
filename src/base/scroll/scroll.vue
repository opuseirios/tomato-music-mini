<template>
    <div class='scroll' ref="scroll">
        <slot></slot>
    </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "scroll",
    props:{
      data:{
        type:Array,
        default:null
      },
      click:{
        type: Boolean,
        default: true
      },
      probeType:{
        type:Number,
        default:1
      },
      listenScroll:{
        type:Boolean,
        default:false
      },
      /*上拉刷新*/
      pullUp:{
        type:Boolean,
        default:false
      },
      beforeScroll:{
        type:Boolean,
        default:false
      },
      refreshDelay:{
        type:Number,
        default:20
      }
    },
    created(){
      setTimeout(()=>{
        this._initScroll()
      },20)
    },
    methods:{
      _initScroll(){
        this.scroll = new BScroll(this.$refs.scroll,{
          click:this.click,
          probeType: this.probeType
        })
        if(this.listenScroll){
          this.scroll.on('scroll',(pos)=>{
            this.$emit('scroll',pos);
          })
        }
        /*判断上啦刷新*/
        if(this.pullUp){
          this.scroll.on('scrollEnd',()=>{
            if(this.scroll.y<=(this.scroll.maxScrollY+50)){
              this.$emit('scrollToEnd')
            }
          })
        }
        if(this.beforeScroll){
          this.scroll.on('beforeScrollStart',()=>{
            this.$emit('beforeScroll');
          })
        }
      },
      enable(){
        this.scroll&&this.scroll.enable();
      },
      disable(){
        this.scroll&&this.scroll.disable();
      },
      refresh(){
        this.scroll&&this.scroll.refresh();
      },
      scrollTo(){
        this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments)
      },
      scrollToElement(){
        this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments)
      }
    },
    watch:{
      data(){
        setTimeout(()=>{
          this.refresh();
        },this.refreshDelay)
      }
    }
  }
</script>

<style scoped lang='scss'>

</style>
