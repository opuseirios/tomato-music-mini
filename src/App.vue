<template>
  <div id="app">
    <main-header></main-header>
    <tabs></tabs>
    <router-view/>
  </div>
</template>

<script>
import MainHeader from "./components/mainHeader/mainHeader";
import Tabs from "./components/tabs/tabs";
export default {
  name: 'App',
  components: {Tabs, MainHeader}
}
</script>

<style>
#app {

}
</style>
