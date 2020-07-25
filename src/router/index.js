import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'
import SuperAdminLayout from '@/containers/SuperAdminLayout'

// Views
import Login from '@/views/Login'
import Dashboard from '@/views/Dashboard'
import Bookings from '@/views/Bookings'
import Properties from '@/views/Properties'
import Services from '@/views/Services'
import Booking from '@/views/Booking'
import Logs from '@/views/Logs'
import Prices from '@/views/Prices'
import Stats from '@/views/Stats'
import Users from '@/views/Users'
import PropertyForm from '@/views/PropertyForm'
import PropertyView from '@/views/PropertyView'
import ServiceView from '@/views/ServiceView'
import ServiceForm from '@/views/ServiceForm'
import BookingView from '@/views/BookingView'
import UserView from '@/views/UserView'
import UserForm from '@/views/UserForm'
import ProfileForm from '@/views/ProfileForm'
import PasswordChange from '@/views/PasswordChange'
import Register from '@/views/Register'
import PasswordForgot from '@/views/PasswordForgot'
import PasswordReset from '@/views/PasswordReset'
import Customers from '@/views/Customers'
import CustomerView from '@/views/CustomerView'
import Contracts from '@/views/Contracts'
import ContractForm from '@/views/ContractForm'
import ContractView from '@/views/ContractView'
import SuperadminDashboard from '@/views/SuperadminDashboard'
import Reservations from '@/views/Reservations'
import Settings from '@/views/Settings'
import Notifications from '@/views/Notifications'
import ReservationView from '@/views/ReservationView'
import Payments from '@/views/Payments'
import PaymentForm from '@/views/PaymentForm'
import Sms from '@/views/Sms'
import Subscription from '@/views/Subscription'
import Plans from '@/views/Plans'
import PlanForm from '@/views/PlanForm'
import Packages from '@/views/Packages'
import PackageForm from '@/views/PackageForm'
import Calendar from '@/views/Calendar'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/passwordForgot',
      name: 'passwordForgot',
      component: PasswordForgot
    },
    {
      path: '/passwordReset/:email/:token',
      name: 'passwordReset',
      component: PasswordReset
    },
    {
      path: '/o',
      name: 'o',
      redirect: '/o/dashboard',
      component: Full,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'properties',
          name: 'properties',
          component: Properties
        },
        {
          path: '/propertyForm',
          name: 'propertyForm-o',
          component: PropertyForm
        },
        {
          path: 'bookings',
          name: 'bookingsOwner',
          component: Bookings
        },
        {
          path: 'logs',
          name: 'logs',
          component: Logs
        },
        {
          path: 'prices',
          name: 'prices',
          component: Prices
        },
        {
          path: 'stats',
          name: 'stats-o',
          component: Stats
        },
        {
          path: 'users',
          name: 'users',
          component: Users
        },
        {
          path: 'propertyView',
          name: 'propertyView-o',
          component: PropertyView
        },
        {
          path: 'serviceView',
          name: 'serviceView-o',
          component: ServiceView,
        },
        {
          path: 'serviceForm',
          name: 'serviceForm-o',
          component: ServiceForm,
        },
        {
          path: 'userView',
          name: 'userView',
          component: UserView,
        },
        {
          path: 'userForm',
          name: 'userForm',
          component: UserForm,
        },
        {
          path: 'profileForm',
          name: 'profileForm-o',
          component: ProfileForm,
        },
        {
          path: 'passwordChange',
          name: 'passwordChange-o',
          component: PasswordChange,
        },
        {
          path: 'settings',
          name: 'settings-o',
          component: Settings,
        },
        {
          path: 'services',
          name: 'services-o',
          component: Services
        },
        {
          path: 'customers',
          name: 'customers-o',
          component: Customers
        },
        {
          path: 'customerView',
          name: 'customerView-o',
          component: CustomerView
        },
        {
          path: 'contracts',
          name: 'contracts',
          component: Contracts
        },
        {
          path: 'contractForm',
          name: 'contractForm',
          component: ContractForm
        },
        {
          path: 'contractView',
          name: 'contractView',
          component: ContractView
        },
        {
          path: 'bookingAdmin',
          name: 'bookingAdmin',
          component: Booking
        },
        {
          path: 'reservations',
          name: 'reservations-o',
          component: Reservations
        },
        {
          path: 'reservation',
          name: 'reservation-o',
          component: ReservationView
        },
        {
          path: 'notifications',
          name: 'notifications-o',
          component: Notifications
        },
        {
          path: 'payments',
          name: 'payments-o',
          component: Payments
        },
        {
          path: 'paymentForm',
          name: 'paymentForm-o',
          component: PaymentForm
        },
        {
          path: 'sms',
          name: 'sms-o',
          component: Sms
        },
        {
          path: 'subscription',
          name: 'subscription-o',
          component: Subscription
        },
        {
          path: 'calendar',
          name: 'calendar-o',
          component: Calendar
        },
      ]
    },
    {
      path: '/m',
      name: 'm',
      redirect: '/m/dashboard',
      component: Full,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: 'properties',
          name: 'properties',
          component: Properties
        },
        {
          path: '/propertyForm',
          name: 'propertyForm-m',
          component: PropertyForm
        },
        {
          path: 'bookings',
          name: 'bookingsManager',
          component: Bookings
        },
        {
          path: 'services',
          name: 'services-m',
          component: Services
        },
        {
          path: 'bookingManager',
          name: 'bookingManager',
          component: Booking
        },
        {
          path: 'stats',
          name: 'stats-m',
          component: Stats
        },
        {
          path: 'propertyView',
          name: 'propertyView-m',
          component: PropertyView
        },
        {
          path: 'serviceView',
          name: 'serviceView-m',
          component: ServiceView,
        },
        {
          path: 'serviceForm',
          name: 'serviceForm-m',
          component: ServiceForm,
        },
        {
          path: 'bookingView',
          name: 'bookingView',
          component: BookingView,
        },
        {
          path: 'profileForm',
          name: 'profileForm-m',
          component: ProfileForm,
        },
        {
          path: 'passwordChange',
          name: 'passwordChange-m',
          component: PasswordChange,
        },
        {
          path: 'settings',
          name: 'settings-m',
          component: Settings,
        },
        {
          path: 'customers',
          name: 'customers',
          component: Customers
        },
        {
          path: 'customerView',
          name: 'customerView-m',
          component: CustomerView
        },
        {
          path: 'reservations',
          name: 'reservations-m',
          component: Reservations
        },
        {
          path: 'reservation',
          name: 'reservation-m',
          component: ReservationView
        },
        {
          path: 'notifications',
          name: 'notifications-m',
          component: Notifications
        },
        {
          path: 'payments',
          name: 'payments-m',
          component: Payments
        },
        {
          path: 'paymentForm',
          name: 'paymentForm-m',
          component: PaymentForm
        },
        {
          path: 'sms',
          name: 'sms-m',
          component: Sms
        },
        {
          path: 'calendar',
          name: 'calendar-m',
          component: Calendar
        },
      ]
    },
    {
      path: '/s',
      name: 's',
      redirect: '/s/dashboard',
      component: SuperAdminLayout,
      children: [
        {
          path: 'superadminDashboard',
          name: 'superadminDashboard',
          component: SuperadminDashboard
        },
        {
          path: 'plans',
          name: 'plans',
          component: Plans
        },
        {
          path: '/planForm',
          name: 'planForm',
          component: PlanForm
        },
        {
          path: 'packages',
          name: 'packages',
          component: Packages
        },
        {
          path: 'packageForm',
          name: 'packageForm',
          component: PackageForm
        },
        {
          path: 'userView',
          name: 'userView',
          component: UserView,
        },
        {
          path: 'calendar',
          name: 'calendar-s',
          component: Calendar
        },
      ]
    }
  ]
})
