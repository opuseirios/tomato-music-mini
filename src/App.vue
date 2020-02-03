<template>
  <div id="app">
    <main-header></main-header>
    <tabs></tabs>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <Player />
  </div>
</template>

<script>
  import MainHeader from "./components/mainHeader/mainHeader";
  import Tabs from "./components/tabs/tabs";
  import Player from './components/player/player'

  export default {
    name: 'App',
    components: {Tabs, MainHeader, Player}
  }
</script>

<style>
  #app {

  }
</style>
