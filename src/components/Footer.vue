<template>
  <footer class="app-footer">
    <span><a href="http://rezervex.com">Rezervex</a> &copy;{{ date }}</span>
    <span class="ml-auto">Powered by <a href="http://rezervex.com">Rezervex</a></span>
  </footer>
</template>
<script>
import moment from 'moment'

export default {
  name: 'footer',
  computed: {
    date() {
      return moment().year()
    }
  }
}
</script>
