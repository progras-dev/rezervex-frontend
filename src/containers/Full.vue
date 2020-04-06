<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="navManager" :role="user.role" v-if="user.role === 'manager' && language === 'en'"/>
      <Sidebar :navItems="navManagerTr" :role="user.role" v-if="user.role === 'manager' && language === 'tr'"/>
      <Sidebar :navItems="navOwner" :role="user.role" v-if="user.role === 'admin' && language === 'en'"/>
      <Sidebar :navItems="navOwnerTr" :role="user.role" v-if="user.role === 'admin' && language === 'tr'"/>
      <main class="main">
        <!--<breadcrumb :list="list"/>-->
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <!--<AppAside/>-->
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import navManager from '../_navManager'
import navManagerTr from '../_navManagerTr'
import navOwner from '../_navOwner'
import navOwnerTr from '../_navOwnerTr'
import { Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb } from '../components/'
import store from '../vuex/store'

export default {
  name: 'full',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb
  },
  data() {
    return {
      navManager: navManager.items,
      navManagerTr: navManagerTr.items,
      navOwner: navOwner.items,
      navOwnerTr: navOwnerTr.items,
    }
  },
  computed: {
    name() {
      return this.$route.name
    },
    list() {
      return this.$route.matched
    },
    user () {
      return store.getters.getUser
    },
    language () {
      return store.getters.getLanguage
    },
  },
  mounted() {
    // console.log('app role: ' + this.role)
    // console.log(this.navManager)
  }
}
</script>
