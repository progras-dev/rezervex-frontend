<script>
  import { Line } from 'vue-chartjs'

  export default {
    extends: Line,
    props: ['data', 'options'],
    mounted () {
      this.renderChart(this.data, this.options)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
