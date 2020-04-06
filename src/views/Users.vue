<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow usersPages">
      <div class="flex-center pageTitleContainer pt-3">
        <span class="white pageTitle">
          <i class="fa fa-users" aria-hidden="true"></i>
          <span v-lang.users></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.usersSubtitle></span></div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">

        <b-card>

          <div class="form-group row">
            <div class="col-sm-3">
              <button type="submit" class="btn btn-lg btn-block btn-info white buttonMain" @click="goToUserAdd($event)">
                <i class="fa fa-plus"></i>
                <span v-lang.addUser></span>
              </button>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <b-table class="table-outline table-responsive-sm mb-0" hover
                       :items="userListScoped"
                       :fields="tableFields"
                       head-variant="light"
                       responsive="xl"
              >

                <template v-slot:cell(avatar)="item">
                  <avatar :username="item.item.fullName" :size="40"></avatar>
                </template>

                <template v-slot:cell(name)="item">
                  {{ item.item.first_name }} {{ item.item.last_name }}
                </template>

                <template v-slot:cell(actions)="item">
                  <b-button v-if="language === 'en'" variant="outline-success" class="actionButton" @click="goToUserView(item.item, $event)" v-b-tooltip.hover title="Go to User page">
                    <i class="fa fa-search"></i>
                  </b-button>
                  <b-button v-if="language === 'tr'" variant="outline-success" class="actionButton" @click="goToUserView(item.item, $event)" v-b-tooltip.hover title="Kullanıcı sayfasına git">
                    <i class="fa fa-search"></i>
                  </b-button>
                  <b-button v-if="language === 'en'" variant="outline-primary" class="actionButton" @click="goToUserEdit(item.item, $event)" v-b-tooltip.hover title="Edit User">
                    <i class="fa fa-edit"></i>
                  </b-button>
                  <b-button v-if="language === 'tr'" variant="outline-primary" class="actionButton" @click="goToUserEdit(item.item, $event)" v-b-tooltip.hover title="Güncelle">
                    <i class="fa fa-edit"></i>
                  </b-button>
                  <b-button v-if="language === 'en'" variant="outline-danger" class="actionButton" @click="openModalRemoveUser(item.item, $event)" v-b-tooltip.hover title="Remove User">
                    <i class="fa fa-trash"></i>
                  </b-button>
                  <b-button v-if="language === 'tr'" variant="outline-danger" class="actionButton" @click="openModalRemoveUser(item.item, $event)" v-b-tooltip.hover title="Kullanıcı Sil">
                    <i class="fa fa-trash"></i>
                  </b-button>
                </template>

              </b-table>

              <p class="card-text lead noItems" v-if="userListScoped.length === 0"> <span v-lang.noUsers></span></p>
            </div>
          </div>

        </b-card>

      </div><!--/.col-->
    </div><!--/.row-->


    <b-modal ref="removeUserModal" class="modal-danger">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.userRemoval></span></h5>
      </template>
      <span v-lang.alertuserRemoveAsk></span>

      <template slot="modal-footer">
        <b-btn variant="default" @click="clickModalBtn('CANCEL')">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="danger" @click="clickModalBtn('REMOVE')">
          <span v-lang.removeUser></span>
        </b-btn>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import router from '../router'
  import store from '../vuex/store'
  import Avatar from 'vue-avatar'
  import { savePropertiesInStorage } from '../mixins/savePropertiesInStorage'

  export default {
    components: {Avatar},
    mixins: [savePropertiesInStorage],
    data() {
      return {
        userToRemove: {},
        indexUserToRemove: 0,
        userListScoped: [],
      }
    },
    computed: {
      language() {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      properties () {
        return store.getters.getProperties
      },
      user() {
        return store.getters.getUser
      },
      users () {
        return store.getters.getUsers
      },
      admin() {
        return store.getters.getUser
      },
      tableFields() {
        if (this.$language === 'en') {
          return [
            {
              label: '',
              class: ['text-center', 'usersTable'],
              key: 'avatar',
            },
            {
              label: 'Name',
              class: ['text-center', 'usersTable'],
              key: 'name',
            },
            {
              label: 'Role',
              class: ['text-center', 'usersTable'],
              key: 'role',
            },
            {
              label: 'Email',
              class: ['text-center', 'usersTable'],
              key: 'email',
            },
            {
              label: 'Phone',
              class: ['text-center', 'usersTable'],
              key: 'phone',
            },
            {
              label: 'Actions',
              class: ['text-center', 'usersTable'],
              key: 'actions',
            },
          ]
        } else if (this.$language === 'tr') {
          return [
            {
              label: '',
              class: ['text-center', 'usersTable'],
              key: 'avatar',
            },
            {
              label: 'Adı',
              class: ['text-center', 'usersTable'],
              key: 'name',
            },
            {
              label: 'Yetki',
              class: ['text-center', 'usersTable'],
              key: 'role',
            },
            {
              label: 'E-posta',
              class: ['text-center', 'usersTable'],
              key: 'email',
            },
            {
              label: 'Telefon',
              class: ['text-center', 'usersTable'],
              key: 'phone',
            },
            {
              label: 'İşlemler',
              class: ['text-center', 'usersTable'],
              key: 'actions',
            },
          ]
        }
      }
    },
    router: router,
    created() {
      this.$language = this.language
      this.initUsers()

      let isAlert = this.$route.params.isAlert
      let alertType = this.$route.params.alertType

      if (isAlert) {
        if (alertType === 'user-create-success') {
          if (this.language === 'en') {
            this.$toasted.show('You have successfully added a new user', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Yeni kullanıcı eklendi', {icon: 'fa-check-circle', type: 'success'})
          }
        } else if (alertType === 'user-update-success') {
          if (this.language === 'en') {
            this.$toasted.show('You have successfully updated a user', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Kullanıcı güncellendi', {icon: 'fa-check-circle', type: 'success'})
          }
        }
      }
    },
    methods: {
      initUsers() {
        this.userListScoped = []
        for (let i = 0; i < this.users.length; i++) {
          let user = {...this.users[i]}
          user.fullName = user.first_name + ' ' + user.last_name
          this.userListScoped.push(user)
        }
      },
      goToUserAdd(event) {
        event.preventDefault()

        this.$localStorage.set('userFormType', 'add')
        store.dispatch({
          type: 'setAppUserFormType',
          userFormType: 'add'
        })
        router.push({name: 'userForm'})
      },
      goToUserEdit(user, event) {
        event.preventDefault()

        this.$localStorage.set('userFormType', 'edit')
        store.dispatch({
          type: 'setAppUserFormType',
          userFormType: 'edit'
        })

        this.$localStorage.set('currentUser', JSON.stringify(user))
        store.dispatch({
          type: 'setAppCurrentUser',
          currentUser: user
        })
        router.push({name: 'userForm'})
      },
      openModalRemoveUser(user, event) {
        event.preventDefault()
        this.userToRemove = {...user}
        for (let i = 0; i < this.users.length; i++) {
          if (user.id === this.users[i].id) {
            this.indexUserToRemove = i
          }
        }
        this.$refs.removeUserModal.show()
      },
      clickModalBtn(btn) {
        if (btn === 'CANCEL') {
          this.$refs.removeUserModal.hide()
        } else if (btn === 'REMOVE') {
          this.userListScoped.splice(this.indexUserToRemove, 1)

          let formData = {
            'user_id': this.userToRemove.id,
            'admin_id': this.admin.id
          }

          this.$http.post(this.appApiPath + '/api/user_remove', formData)
            .then(response => {
              console.log('remove success')
              console.log(response.body)

              this.$localStorage.set('users', JSON.stringify(response.body.data.users))
              store.dispatch({
                type: 'setAppUsers',
                users: response.body.data.users
              })

              // Refresh properties (with updated properties - manager relationship)
              store.dispatch({
                type: 'setAppProperties',
                properties: response.body.data.properties
              })
              this.savePropertiesInStorage(response.body.data.properties, 'admin')

              if (this.$language === 'en') {
                this.$toasted.show('User successfully removed!', {icon: 'fa-check-circle', type: 'success'})
              } else if (this.$language === 'tr') {
                this.$toasted.show('Kullanıcı Silindi', {icon: 'fa-check-circle', type: 'success'})
              }
            }, response => {
              console.log('remove error')
              console.log(response)
            })

          this.$refs.removeUserModal.hide()
        }
      },
      goToUserView(user, event) {
        event.preventDefault()

        this.$localStorage.set('currentUser', JSON.stringify(user))
        store.dispatch({
          type: 'setAppCurrentUser',
          currentUser: user
        })
        router.push({name: 'userView'})
      },
    }
  }
</script>

<style scoped>

</style>
