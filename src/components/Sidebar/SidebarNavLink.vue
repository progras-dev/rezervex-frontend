<template>
  <div v-if="isExternalLink">
    <a :href="url" :class="classList">
      <i :class="icon"></i> {{name}}
      <b-badge v-if="badge && badge.text" :variant="badge.variant">{{badge.text}}</b-badge>
      <span class="badge badge-info" v-if="isnew"><span v-lang.new></span></span>
    </a>
  </div>
  <div v-else>
    <router-link :to="url" :class="classList">
      <i :class="icon"></i> {{name}}
      <b-badge v-if="badge && badge.text" :variant="badge.variant">{{badge.text}}</b-badge>
      <span class="badge badge-info" v-if="isnew"><span v-lang.new></span></span>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'sidebar-nav-link',
    props: {
      name: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      },
      badge: {
        type: Object,
        default: () => {}
      },
      variant: {
        type: String,
        default: ''
      },
      classes: {
        type: String,
        default: ''
      },
      isnew: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      classList () {
        return [
          'nav-link',
          this.linkVariant,
          ...this.itemClasses
        ]
      },
      linkVariant () {
        return this.variant ? `nav-link-${this.variant}` : ''
      },
      itemClasses () {
        return this.classes ? this.classes.split(' ') : []
      },
      isExternalLink () {
        if (this.url.substring(0, 4) === 'http') {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>
