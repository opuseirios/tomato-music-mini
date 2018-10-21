<template>
  <div class='singer'>
    <listview :singer-list="singerList" @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerListData} from "../../api/singer";
  import {ERR_OK} from "../../api/config";
  import {Singer} from "../../assets/js/singer";
  import Scroll from "../../base/scroll/scroll";
  import Listview from "../../components/listview/listview";
  import {mapMutations} from 'vuex'

  const HOT_KEY = '热门';
  const HOT_SINGER_LENGTH = 10;

  export default {
    name: 'singer',
    components: {Listview, Scroll},
    created() {
      this._getSingerList();
    },
    data() {
      return {
        singerList: []
      }
    },
    methods: {
      selectSinger(singer) {
        this.setSinger(singer);
        this.$router.push({
          path:`/singer/${singer.mid}`
        })
      },
      _getSingerList() {
        getSingerListData().then((res) => {
          if (res.code === ERR_OK) {
            this.singerList = this._normaliseSingerList(res.data.list);
          }
        })
      },
      _normaliseSingerList(list) {
        let map = {
          hot: {
            title: HOT_KEY,
            items: []
          }
        };
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LENGTH) {
            map.hot.items.push(new Singer({
              mid: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            mid: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        let hot = [];
        let rest = [];
        for (let key in map) {
          let val = map[key];
          if (val.title.match(/[a-zA-Z]/)) {
            rest.push(val);
          } else if (val.title === HOT_KEY) {
            hot.push(val)
          }
        }
        rest.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return [...hot, ...rest];
      },
      ...mapMutations({
        setSinger:"SET_SINGER"
      })
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
