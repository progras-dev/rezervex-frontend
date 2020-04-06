<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="itemsNav"/>
      <main class="main">
        <!--<breadcrumb :list="list"/>-->
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
  import superAdminNav from '../_superadminNav'
  import { Headersuper as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb } from '../components/'
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
        itemsNav: superAdminNav.items,
      }
    },
    computed: {
      name() {
        return this.$route.name
      },
      list() {
        return this.$route.matched
      },
      language () {
        return store.getters.getLanguage
      },
      user () {
        return store.getters.getUser
      },
    },
    mounted() {
      console.log(this.itemsNav)
    }
  }
</script>
