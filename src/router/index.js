import Vue from 'vue'
import Router from 'vue-router'
import Recommend from './../views/recommend/recommend'
import Singer from './../views/singer/singer'
import Rank from './../views/rank/rank'
import Search from './../views/search/search'
import SingerDetail from './../components/singer-detail/singer-detail'
import TopList from '../views/rank/children/top-list/top-list'
import Disc from '../views/recommend/children/disc/disc'
import UserCenter from './../views/user-center/user-center'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: '/recommend/:id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: "/singer/:id",
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: '/rank/:id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
