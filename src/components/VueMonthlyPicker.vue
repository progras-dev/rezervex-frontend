<template>
  <div class="vue-monthly-picker">
    <div class="month-picker-wrapper"
         :class="{ 'active visible':showMenu }">
      <div class="month-year-label picker" type="text" autocomplete="off" tabindex="0" @click="openMenu">
        <div  @click="openMenu"
              class="month-year-display"
              :disabled="disabled"
              :class="[inputClass, {'placeholder': !value}]">
          <input class="form-control m-input" type="text" :placeholder="inputPlaceholder">
          <!-- <span v-if="isMonthChanged && !isYearChanged">{{ month | formatDateMedium }} / {{year}}</span>
          <span v-if="isYearChanged && !isMonthChanged">{{year}}</span>
          <span v-if="!isYearChanged && !isMonthChanged">2017</span> -->
        </div>
      </div>
      <div class="text"></div>
      <div class="date-popover" :class="menuClass" :style="menuStyle" tabindex="-1">
        <div class="picker" style="text-align: center">
          <div class="flexbox">
            <span class="prev" @click="prevYear"></span>
            <div @click="selectYear">{{year}}</div>
            <span class="next" @click="nextYear"></span>
          </div>
          <div class="flexbox monthItem">
            <template v-for="(month, idx) in monthLabels">
              <div class="item" @click="selectMonth(idx)" :key="idx">{{month | formatDateMedium}}</div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'vue-monthly-picker',
    props: {
      'value': {
        default: null
      },
      'disabled': {
        type: Boolean,
        default: false
      },
      'inputClass': {
        default: ''
      },
      'placeHolder': {
        type: String,
        default: ''
      },
      monthLabels: {
        type: Array,
        default: function () {
          return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        }
      }
    },
    data () {
      return {
        showMenu: false,
        year: moment().format('YYYY'),
        month: moment().format('MM'),
        isMonthChanged: false,
        isYearChanged: false,
        inputPlaceholder: '',
      }
    },
    created() {
      this.inputPlaceholder = this.year // assign current year to placeholder
    },
    mounted () {
      this.init()
    },
    filters: {

      formatDateMedium(value) {
        if (value) {
          return moment(String(value)).format('MMM')
        }
      },
      formatDateLong(value) {
        if (value) {
          return moment(String(value)).format('MMMM')
        }
      }
    },
    watch: {
      value: function (value) {
        this.setValue(value)
      }
    },
    computed: {
      menuClass () {
        return {
          visible: this.showMenu,
          hidden: !this.showMenu
        }
      },
      menuStyle () {
        return {
          display: this.showMenu ? 'block' : 'none'
        }
      },
    },
    methods: {
      init () {
        document.addEventListener('click', (e) => {
          if (this.$el && !this.$el.contains(e.target)) {
            this.closeMenu()
          }
        }, false)

        this.setValue(this.value)
      },
      openMenu () {
        if (!this.disabled) {
          this.showMenu = true
        }
      },
      closeMenu () {
        if (this.showMenu) {
          this.showMenu = false
          this.selectPicker()
        }
      },
      prevYear () {
        let newYear = parseInt(this.year) - 1
        this.year = newYear.toString()
      },
      nextYear () {
        let newYear = parseInt(this.year) + 1
        this.year = newYear.toString()
      },
      selectMonth (idx) {
        this.month = (parseInt(idx) + 1).toString()
        this.isMonthChanged = true
        this.isYearChanged = false
        this.inputPlaceholder = this.month + ' / ' + this.year

        this.$emit('monthChanged', [this.month, this.formatDate(this.month, 'MMMM'), this.year])

        this.closeMenu()
      },
      selectYear() {
        this.isMonthChanged = false
        this.isYearChanged = true
        this.closeMenu()
        // console.log('select year')
        // console.log(this.year)
        this.inputPlaceholder = this.year
        this.$emit('yearChanged', [this.year])
      },
      selectPicker () {
        const yrMonth = this.year + '/' + (this.month.length < 2 ? '0' + this.month : this.month)
        this.$emit('input', moment(yrMonth, 'YYYY/MM'))
        this.$emit('selected', moment(yrMonth, 'YYYY/MM'))
      },
      formatDate(value, format) {
        if (value) {
          return moment(String(value)).format(format)
        }
      },
      setValue (value) {
        if (typeof value === 'string') {
          value = moment(value)
        }
        if (value) {
          // console.log('value')
          // console.log(value)

          // console.log('isMonthChanged')
          // console.log(this.isMonthChanged)

          // console.log('yearChanged')
          // console.log(this.isYearChanged)

          // if (this.isMonthChanged) {
          //   this.$emit('monthChanged', [ this.month, value.format('MMM'), this.year])
          // } else if (this.isYearChanged) {
          //   this.$emit('yearChanged', [ this.year])
          // }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  $lightgray: #d4d4d4;

  .picker {
    .next,
    .prev {
      &:hover {
        cursor: pointer;
      }
    }

    .monthItem {
      .item {
        border-top: 1px solid $lightgray;
        &:hover {
          cursor: pointer;
          background-color: $lightgray;
        }
      }
    }

    .flexbox {
      padding: 0px;
      display: flex;
      flex-wrap: wrap;
      div {
        flex-grow: 1;
        padding: 15px 0;
      }
      .item {
        flex: 1;
        flex-basis: 25%;
      }
    }
  }

  .placeholder {
    color: #8b8b8b;
  }

  .date-popover {
    overflow-x: hidden;
    overflow-y: hidden;
    outline: none;
    margin: 0 -1px;
    min-width: 100%;
    width: 100%;
    border-radius: 0 0 .28571429rem .28571429rem;
    box-shadow: 0 2px 3px 0 rgba(34,36,38,.15);
    background: #fff;
    transition: opacity .1s ease;
    position: absolute;
    left: 0;
    top: 103%;
    z-index: 10;
    border: 1px solid $lightgray;
    font-size: 1rem;
    font-weight: 200;
  }

  .month-picker-wrapper {
    position: relative;
    display: block;
    min-width: 200px;
  }

  .month-year-label {
    outline: none;
  }
  .text {
    position: relative;
    z-index: 2;
  }
  .month-year-display {
    &:hover {
      cursor: pointer;
    }
  }

  .next,
  .prev {
    width: 16%;
    float: left;
    text-indent: -10000px;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translateX(-50%) translateY(-50%);
      transform: translateX(-50%) translateY(-50%);
      border: 6px solid transparent;
    }
  }
  .next {
    &:after {
      border-left: 10px solid #000;
      margin-left: 5px;
    }

  }

  .prev {
    &:after {
      border-right: 10px solid #000;
      margin-left: -5px;
    }
  }

</style>
