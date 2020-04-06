<template>
  <b-nav-item-dropdown right no-caret>
    <template slot="button-content">
      <i class="icon-bell" style="font-size: 24px;"></i>
      <b-badge pill :class="{'badge-info': notifications.length === 0, 'badge-warning': notifications.length >= 1}">{{notifications.length}}</b-badge>
    </template>
    <div class="dropdown-menu-lg">
      <b-dropdown-header tag="div" class="text-center">
        <strong>
          <!--<span v-lang.youHave></span>
          <span v-lang.notifications></span>-->
          <span v-if="language === 'en'">You have {{notifications.length}} notifications</span>
          <span v-if="language === 'tr'">{{notifications.length}} bildirimler var</span>
        </strong>
      </b-dropdown-header>
      <div :class="{'scrollingArea': notifications.length > 0 }">
        <template v-if="notifications.length > 0">
          <b-dropdown-item v-for="(notification, index) in notifications" :key="index" @click="goToReservation(notification, $event)">
            <div class="message">
              <div class="pt7 pl7 float-left">
                <div class="avatar">
                  <i class="fa fa-calendar-o fa-2x iconColorLight"></i>
                </div>
              </div>
              <div>
                <small v-if="notification.client && notification.client.full_name.length < 15">{{ notification.client.full_name }}</small>
                <small v-if="notification.client && notification.client.full_name.length > 15">{{ notification.client.full_name.substring(0,15)+".." }}</small>
                <small class="float-right mt-1">{{ notification.dateFormatted }}</small>
              </div>
              <div class="text-truncate text-info" v-if="notification.daysLeft === 1">
                <!--<span v-lang.expireTomorrow></span> -->
                <span v-if="language === 'en'">Expire tomorrow</span>
                <span v-if="language === 'tr'">Yarın sona eriyor</span>
              </div>
              <div class="text-truncate text-warning" v-if="notification.daysLeft === 0 && !notification.expired">
                <!--<span v-lang.expireToday></span> -->
                <span v-if="language === 'en'">Expire today</span>
                <span v-if="language === 'tr'">Bügun sona eriyor</span>
              </div>
              <div class="text-truncate text-danger" v-if="notification.daysLeft === 0 && notification.expired">
                <span class="fa fa-exclamation text-danger"></span>
                <!--<span v-lang.expired></span> -->
                <span v-if="language === 'en'">Expired</span>
                <span v-if="language === 'tr'">Sonlandı</span>
              </div>
              <!-- <div class="small text-muted text-truncate"> <i class="fa fa-building" style="width: 30px; margin-right: 0px;"></i> {{ notification.property.name }}</div>
              <div class="small text-muted text-truncate"> <i class="fa fa-user" style="width: 30px; margin-right: 0px;"></i> {{ notification.user.first_name }} {{ notification.user.last_name }}</div> -->
            </div>
          </b-dropdown-item>
        </template>
      </div>
      <b-dropdown-item class="text-center" @click="markAllAsRead()" v-if="notifications.length > 0">
        <span v-if="language === 'en'">Mark all as read</span>
        <span v-if="language === 'tr'">Okundu olarak işaretle</span>
        <!--<span v-lang.markAllAsRead></span>-->
      </b-dropdown-item>
    </div>
  </b-nav-item-dropdown>
</template>
<script>
  import store from '../vuex/store'
  import { updateNotifications } from '../mixins/updateNotifications'
  export default {
    name: 'header-dropdown-notifications',
    mixins: [updateNotifications],
    data: () => {
      return {
        notificationsListScoped: [],
      }
    },
    computed: {
      notifications() {
        return store.getters.getNotifications
      },
      user() {
        return store.getters.getUser
      },
      language() {
        return store.getters.getLanguage
      },
    },
    created() {
      this.$language = this.language
      console.log('notifications from component')
      console.log(this.notifications)
    },
    methods: {
      goToReservation(reservation, event) {
        event.preventDefault()

        // Set current reservation
        this.$localStorage.set('currentReservation', JSON.stringify(reservation))
        store.dispatch({
          type: 'setAppCurrentReservation',
          currentReservation: reservation
        })

        this.updateNotifications({...reservation})

        // Redirect
        if (this.user.role === 'admin') {
          this.$router.push({name: 'reservation-o'})
        } else if (this.user.role === 'manager') {
          this.$router.push({name: 'reservation-m'})
        }
      },
      markAllAsRead() {
        let notificationsScoped = this.notifications.map(item => ({...item}))

        for (let i = 0; i < notificationsScoped.length; i++) {
          let notification = {...notificationsScoped[i]}

          // Add reservation to array of read
          let readNotifications = JSON.parse(this.$localStorage.get('readNotifications', null))
          if (readNotifications === null) {
            readNotifications = []
          }
          readNotifications.push(notification.id)
          this.$localStorage.set('readNotifications', JSON.stringify(readNotifications))
        }

        store.dispatch({
          type: 'setAppNotifications',
          notifications: []
        })
        this.$localStorage.set('notifications', JSON.stringify([]))
      },
    }
  }
</script>

<style scoped>

  .scrollingArea {
    overflow: scroll;
    height: 212px;
  }
  /* ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(0,0,0,.5);
    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
  } */
</style>
