<template>
  <div class='singer'>

  </div>
</template>

<script>
  import {getSingerList} from "../../api/singer";
  import {ERR_OK} from "../../api/config";
  import Singer from '../../assets/js/singer'

  const HOT_NAME = '热门';
  const HOT_LIST_LEN = 10;
  export default {
    name: 'singer',
    data(){
      return{
        singers:[]
      }
    },
    created(){
      this._getSingerList();
    },
    methods:{
      _getSingerList(){
        getSingerList().then(res=>{
          console.log(res);
          if(res.code === ERR_OK){
            this.singers = this._normalizeSingerList(res.data.list);
            console.log(this.singers);
          }
        })
      },
      _normalizeSingerList(list){
        let map = {
          hot:{
            title:HOT_NAME,
            items:[]
          }
        }
        list.forEach((item,index)=>{
          if(index<HOT_LIST_LEN){
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex;
          if(!map[key]){
            map[key] = {
              title:key,
              items:[]
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        let hot = [],rest = [];
        for(let key in map){
          const val = map[key];
          if(val.title.match(/[a-zA-Z]/)){
            rest.push(val)
          }else if(val.title === HOT_NAME){
            hot.push(val)
          }
        }
        rest.sort((a,b)=>{
          return a.title.charCodeAt(0)-b.title.charCodeAt(0)
        })
        return hot.concat(rest);
      }
    }
  }
</script>

<style lang='scss' scoped>
  .singer {
    position: fixed;
    top: 176px;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
