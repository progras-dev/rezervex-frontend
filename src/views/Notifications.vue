<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleNoMargin settingsPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle mb30">
          <i class="fa fa-bell" aria-hidden="true"></i>
          <span v-lang.notifications></span>
        </span>
      </div>
    </div>

    <div class="email-app mb-4">
      <nav>
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link" href="#"><i class="fa fa-inbox"></i> <span v-lang.read></span> <b-badge variant="danger">{{notificationListScoped.length}}</b-badge></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><i class="fa fa-star"></i> <span v-lang.unread></span> </a>
          </li>
        </ul>
      </nav>
      <main class="inbox">
        <div class="toolbar">
          <button type="button" class="btn btn-light"><span class="fa fa-trash-o"></span></button>
          <div class="btn-group float-right">
            <button type="button" class="btn btn-light"><span class="fa fa-chevron-left"></span></button>
            <button type="button" class="btn btn-light"><span class="fa fa-chevron-right"></span></button>
          </div>
        </div>

        <ul class="messages">
          <li class="message unread" v-for="(notification, index) in notificationListScoped" :key="index">
            <a href="#">
              <div class="actions">
                <span class="action"><i class="fa fa-square-o"></i></span>
              </div>
              <div class="header">
                <span class="from">{{ notification.client.full_name }}</span>
                <span class="date"><span class="fa fa-paper-clip"></span> {{ notification.dateFormatted }}</span>
              </div>
              <div class="notificationInfo">
                <span v-lang.status></span>:
                <span v-lang.expireTomorrow v-if="notification.daysLeft === 1" class="text-primary notificationStatus"></span>
                <span v-lang.expireToday v-if="notification.daysLeft === 0" class="text-warning notificationStatus"></span>
                <span v-lang.expired v-if="notification.daysLeft < 0" class="text-danger notificationStatus"></span>
              </div>
              <div class="notificationBody">
                <div class="notificationInfo">
                  <span v-lang.client></span>: <i class="fa fa-user" v-if="notification.client.full_name"></i> {{ notification.client.full_name }} <i class="fa fa-phone" v-if="notification.client.phone"></i> {{ notification.client.phone }} <i class="fa fa-envelope" v-if="notification.client.email"></i> {{ notification.client.email }}
                </div>
                <div class="notificationInfo">
                  <span v-lang.property></span>: <i class="fa fa-building"></i> {{ notification.property.name }}
                </div>
                <div class="notificationInfo">
                  <span v-lang.manager></span>: <i class="fa fa-user"></i> {{ notification.user.first_name }} {{ notification.user.last_name }} <i class="fa fa-phone"></i> {{ notification.user.phone }}
                </div>
              </div>
            </a>
          </li>
        </ul>
      </main>
    </div>
  </div>
</template>

<script>
  import router from '../router'
  import store from '../vuex/store'
  import Avatar from 'vue-avatar'

  export default {

    components: {Avatar},

    data() {
      return {
        notificationListScoped: []
      }
    },

    computed: {
      language() {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      user() {
        return store.getters.getUser
      },
      notifications() {
        return store.getters.getNotifications
      },
    },

    router: router,

    created() {
      this.$language = this.language
      console.log('notifications')
      console.log(this.notifications)
      this.notificationListScoped = this.notifications.map(item => ({...item}))
    },

    methods: {
    }
  }
</script>

<style scoped>
  .notificationInfo {
    font-size: 14px;
    font-weight: 300;
  }

  .notificationStatus {
    font-size: 16px;
    font-weight: 600;
  }

  .notificationBody i {
    font-weight: 300;
    color: #c9c9c9;
    margin-left: 8px;
  }

</style>
