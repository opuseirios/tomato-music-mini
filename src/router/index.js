import Vue from 'vue'
import Router from 'vue-router'
import Recommend from './../views/recommend/recommend'
import Singer from './../views/singer/singer'
import Rank from './../views/rank/rank'
import Search from './../views/search/search'
import Radio from './../views/radio/radio'
import SingerDetail from './../components/singer-detail/singer-detail'
import Disc from './../components/disc/disc'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/singer',
      component: Singer,
      children:[
        {
          path:"/singer/:id",
          component:SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path:'/rank/:id',
          component:Disc
        }
      ]
    },
    {
      path: '/search',
      component: Search,
    },
    {
      path: '/radio',
      component: Radio
    }
  ]
})
