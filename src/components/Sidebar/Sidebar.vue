<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <div slot="header"></div>
      <ul class="nav">
        <li class="nav-title text-center">
          <span v-lang.general></span>
        </li>
        <span v-for="(item, index) in navItems" :key="index">
          <li class="nav-title text-center" v-if="(item.order === 2 && role === 'admin') || (item.order === 1 && role === 'manager')">
            <span v-lang.propertiesSetup></span>
          </li>
          <li class="nav-title text-center" v-if="(item.order === 6 && role === 'admin') || (item.order === 3 && role === 'manager')">
            <span v-lang.booking></span>
          </li>
          <li class="nav-title text-center" v-if="(item.order === 11 && role === 'admin') || (item.order === 8 && role === 'manager')">
            <span v-lang.other></span>
          </li>
          <template v-if="item.title">
            <SidebarNavTitle :name="item.name" :classes="item.class" :wrapper="item.wrapper"/>
          </template>
          <template v-else-if="item.divider">
            <SidebarNavDivider :classes="item.class"/>
          </template>
          <template v-else-if="item.label">
            <SidebarNavLabel :name="item.name" :url="item.url" :icon="item.icon" :label="item.label" :classes="item.class"/>
          </template>
          <template v-else>
            <template v-if="item.children">
              <!-- First level dropdown -->
              <SidebarNavDropdown :name="item.name" :url="item.url" :icon="item.icon">
                <span v-for="(childL1, index1) in item.children" :key="index1">
                  <template v-if="childL1.children">
                    <!-- Second level dropdown -->
                    <SidebarNavDropdown :name="childL1.name" :url="childL1.url" :icon="childL1.icon">
                      <li class="nav-item" v-for="(childL2, index2) in childL1.children" :key="index2">
                        <SidebarNavLink :name="childL2.name" :url="childL2.url" :icon="childL2.icon" :badge="childL2.badge" :variant="item.variant"/>
                      </li>
                    </SidebarNavDropdown>
                  </template>
                  <template v-else>
                    <SidebarNavItem :classes="item.class">
                      <SidebarNavLink :name="childL1.name" :url="childL1.url" :icon="childL1.icon" :badge="childL1.badge" :variant="item.variant"/>
                    </SidebarNavItem>
                  </template>
                </span>
              </SidebarNavDropdown>
            </template>
            <template v-else>
              <SidebarNavItem :classes="item.class">
                <!--Reservation page new-->
                <SidebarNavLink :name="item.name" :url="item.url" :icon="item.icon" :badge="item.badge" :variant="item.variant" :isnew="((item.order === 8 || item.order === 10 || item.order === 11) && role === 'admin') || ((item.order === 5 || item.order === 7 || item.order === 8) && role === 'manager')"/>
              </SidebarNavItem>
            </template>
          </template>
        </span>
      </ul>
      <slot></slot>
    </nav>
    <SidebarMinimizer/>
  </div>
</template>
<script>
import SidebarMinimizer from './SidebarMinimizer'
import SidebarNavDivider from './SidebarNavDivider'
import SidebarNavDropdown from './SidebarNavDropdown'
import SidebarNavLink from './SidebarNavLink'
import SidebarNavTitle from './SidebarNavTitle'
import SidebarNavItem from './SidebarNavItem'
import SidebarNavLabel from './SidebarNavLabel'
export default {
  name: 'sidebar',
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    },
    role: {
      type: String,
      default: ''
    }
  },
  components: {
    SidebarMinimizer,
    SidebarNavDivider,
    SidebarNavDropdown,
    SidebarNavLink,
    SidebarNavTitle,
    SidebarNavItem,
    SidebarNavLabel
  },
  methods: {
    handleClick (e) {
      e.preventDefault()
      e.target.parentElement.classList.toggle('open')
    }
  }
}
</script>

<style lang="css">
  .nav-link {
    cursor:pointer;
  }
</style>
