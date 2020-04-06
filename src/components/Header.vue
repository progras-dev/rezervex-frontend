<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="#"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none mr-auto" type="button" @click="sidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>

    <b-navbar-nav class="ml-auto" style="margin-right: 23px;">
      <b-nav-item style="margin-right: 5px!important; margin-top: 5px;">
        <HeaderDropdownNotifications/>
      </b-nav-item>
      <HeaderDropdownAccnt/>
    </b-navbar-nav>
  </header>
</template>
<script>
  import vSelect from 'vue-select'
  import store from '../vuex/store'
  import router from '../router'
  import HeaderDropdownNotifications from './HeaderDropdownNotifications.vue'
  import HeaderDropdownAccnt from './HeaderDropdownAccnt.vue'

  export default {
    name: 'header',

    components: { vSelect, HeaderDropdownNotifications, HeaderDropdownAccnt },

    router: router,

    data() {
      return {
        hasComponentMounted: false,
        selected: {},
      }
    },

    computed: {
      options() {
        return [{label: 'Turkçe', value: 'tr'}, {label: 'English', value: 'en'}]
      },
      language () {
        return store.getters.getLanguage
      },
      user () {
        return store.getters.getUser
      },
    },

    created() {
      /* console.log('language from header')
      console.log(this.language) */
      for (let i = 0; i < this.options.length; i++) {
        if (this.language === this.options[i].value) {
          this.selected = {...this.options[i]}
        }
      }
    },

    methods: {
      sidebarToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-hidden')
      },
      sidebarMinimize (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-minimized')
      },
      mobileSidebarToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-mobile-show')
      },
      asideToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('aside-menu-hidden')
      },
      selectLang() {
        if (this.selected !== null) {
          this.$language = this.selected.value
          store.dispatch({
            type: 'setAppLanguage',
            language: this.selected.value
          })
          this.updateLabels()
          this.$localStorage.set('appLanguage', this.selected.value)
        }
      },
      updateLabels() {
        let labelsObject = {}
        if (this.$language === 'en') {
          labelsObject.totalBookings = 'Total Bookings'
          store.dispatch({
            type: 'setAppLabels',
            labels: labelsObject
          })
        } else if (this.$language === 'tr') {
          labelsObject.totalBookings = 'Toplam rezervasyonlar'
          store.dispatch({
            type: 'setAppLabels',
            labels: labelsObject
          })
        }
      },
    }
  }
</script>

<style lang="scss">

  .customDropdown {

    border: 1px solid rgba(60,60,60,.26)!important;
    border-radius: 4px;
    margin-right: 46px;

    .btn {
      /*border: none;*/
      background-color: transparent;
    }

    .btn:hover {
      background-color: white!important;
    }

    .btn.btn-default:hover, .btn.btn-default.active, .btn.btn-default:active, .btn.btn-default:focus, .show > .btn.btn-default.dropdown-toggle, .btn.btn-secondary:hover, .btn.btn-secondary.active, .btn.btn-secondary:active, .btn.btn-secondary:focus, .show > .btn.btn-secondary.dropdown-toggle, .btn.btn-default:hover, .btn.btn-default.active, .btn.btn-default:active, .btn.btn-default:focus, .show > .btn.btn-default.dropdown-toggle, .btn.btn-secondary:hover, .btn.btn-secondary.active, .btn.btn-secondary:active, .btn.btn-secondary:focus {
      background-color: white!important;
    }

    .profileImage {
      width: 43px;
      margin-top: -10px!important;
    }

    .nav-link.dropdown-toggle:after, .btn.dropdown-toggle:after {
      content: "";
    }
    .dropdown-toggle.btn-secondary {
      border: none;
      height: 38px;
    }

    .fa-caret-down {
      color: #999;
    }
  }

  .langSelect {
    display: inline-block;
    width:64px;
    margin-right: 7px;

    .dropdown-menu {
      width: 60px!important;
      min-width: 0px !important;
    }
  }

  /*.dropdown-toggle {
    height: 40px;
  }*/


  .customUserIcon {
    font-size: 1.8rem;
    vertical-align: middle;
    margin-top: -2px;
    margin-left: -4px;
    color: #999;
  }

  .app-header.navbar .navbar-brand {
    background-image: url("../assets/img/logo.png");
  }




  .navbar .nav-item .nav-link.nav-pill, .navbar .nav-item .nav-pill.dropdown-toggle {
    width: 32px;
    height: 32px;
    padding: 0;
    line-height: 32px;
    border: 1px solid #c0cadd;
    border-radius: 50em;
  }




</style>
