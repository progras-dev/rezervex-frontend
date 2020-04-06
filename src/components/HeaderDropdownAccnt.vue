<template>
  <b-nav-item-dropdown right no-caret>
    <template slot="button-content">
      <avatar :username="userScoped.fullName" :size="40"></avatar>
    </template>
    <b-dropdown-header tag="div" class="text-center">
      <strong>
        <span v-if="language === 'en'">Account</span>
        <span v-if="language === 'tr'">Hesap</span>
        <!--<span v-lang.account></span>-->
      </strong>
    </b-dropdown-header>
    <b-dropdown-item class="menuItem" @click="goToProfileForm">
      <i class="fa fa-user text-info"></i>
      <span v-if="language === 'en'">Edit Profile</span>
      <span v-if="language === 'tr'">Profil Güncelle</span>
      <!--<span v-lang.editProfile></span>-->
    </b-dropdown-item>
    <b-dropdown-item class="menuItem" @click="goToSubscription" v-if="user.role === 'admin'">
      <i class="fa fa-credit-card text-info"></i>
      <span v-if="language === 'en'">Subscription</span>
      <span v-if="language === 'tr'">Üyelik</span>
      <!--<span v-lang.editProfile></span>-->
    </b-dropdown-item>
    <b-dropdown-item class="menuItem" @click="goToSettings">
      <i class="fa fa-wrench text-info"></i>
      <span v-if="language === 'en'">Settings</span>
      <span v-if="language === 'tr'">Ayarlar</span>
      <!--<span v-lang.settings></span> -->
    </b-dropdown-item>
    <b-dropdown-item class="menuItem" @click="changePassword()">
      <i class="fa fa-key text-info"></i>
      <span v-if="language === 'en'">Change password</span>
      <span v-if="language === 'tr'">Şifre Değiştir</span>
      <!--<span v-lang.changePassword></span> -->
    </b-dropdown-item>
    <b-dropdown-item class="menuItem" @click="logout">
      <i class="fa fa-lock text-danger"></i>
      <span v-if="language === 'en'">Logout</span>
      <span v-if="language === 'tr'">Çıkış</span>
      <!--<span v-lang.logout></span> -->
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>
<script>
  import Avatar from 'vue-avatar'
  import store from '../vuex/store'

  export default {
    name: 'header-dropdown-accnt',
    components: {Avatar},
    data: () => {
      return {
        itemsCount: 42,
        userScoped: {}
      }
    },

    computed: {
      user() {
        return store.getters.getUser
      },
      language() {
        return store.getters.getLanguage
      },
    },

    created() {
      this.$language = this.language
      this.userScoped = {...this.user}
      this.userScoped.fullName = this.user.first_name + ' ' + this.user.last_name
    },

    methods: {
      logout() {
        // Update user data in store with authenticated = false
        let userData = {...this.user}
        userData.authenticated = false
        store.dispatch({
          type: 'setAppUser',
          user: userData
        })
        this.$localStorage.remove('user')
        // Redirect to login
        this.$router.push({name: 'Login'})
      },
      goToProfileForm() {
        if (this.user.role === 'manager') {
          this.$router.push({name: 'profileForm-m'})
        } else if (this.user.role === 'admin') {
          this.$router.push({name: 'profileForm-o'})
        }
      },
      changePassword() {
        if (this.user.role === 'manager') {
          this.$router.push({name: 'passwordChange-m'})
        } else if (this.user.role === 'admin') {
          this.$router.push({name: 'passwordChange-o'})
        }
      },
      goToSettings() {
        if (this.user.role === 'manager') {
          this.$router.push({name: 'settings-m'})
        } else if (this.user.role === 'admin') {
          this.$router.push({name: 'settings-o'})
        }
      },
      goToSubscription() {
        this.$router.push({name: 'subscription-o'})
      },
      goToPackages() {
        this.$router.push({name: 'packagesView'})
      }
    }
  }
</script>

<style>
</style>
