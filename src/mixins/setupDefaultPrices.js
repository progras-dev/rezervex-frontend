import moment from 'moment'
export const setupDefaultPrices = {
  data: function () {
    return {
    }
  },
  created: function () {
  },
  methods: {
    setupDefaultPrices(property) {
      this.yearCurrent = moment().year()
      this.yearNext = moment().add(1, 'year').year()

      // Setup current year
      this.defaultPricesData[this.yearCurrent] = {}
      this.defaultPricesData[this.yearCurrent]['high'] = {}
      this.defaultPricesData[this.yearCurrent]['low'] = {}
      this.defaultPricesData[this.yearCurrent]['high']['day'] = {}
      this.defaultPricesData[this.yearCurrent]['high']['night'] = {}
      this.defaultPricesData[this.yearCurrent]['low']['day'] = {}
      this.defaultPricesData[this.yearCurrent]['low']['night'] = {}
      this.defaultPricesData[this.yearCurrent]['high']['day']['working_day'] = property.default_prices_current_year[0].default_price_high_season_working_days_day
      this.defaultPricesData[this.yearCurrent]['high']['day']['friday'] = property.default_prices_current_year[0].default_price_high_season_friday_day
      this.defaultPricesData[this.yearCurrent]['high']['day']['saturday'] = property.default_prices_current_year[0].default_price_high_season_saturday_day
      this.defaultPricesData[this.yearCurrent]['high']['day']['sunday'] = property.default_prices_current_year[0].default_price_high_season_sunday_day
      this.defaultPricesData[this.yearCurrent]['high']['night']['working_day'] = property.default_prices_current_year[0].default_price_high_season_working_days_night
      this.defaultPricesData[this.yearCurrent]['high']['night']['friday'] = property.default_prices_current_year[0].default_price_high_season_friday_night
      this.defaultPricesData[this.yearCurrent]['high']['night']['saturday'] = property.default_prices_current_year[0].default_price_high_season_saturday_night
      this.defaultPricesData[this.yearCurrent]['high']['night']['sunday'] = property.default_prices_current_year[0].default_price_high_season_sunday_night
      this.defaultPricesData[this.yearCurrent]['low']['day']['working_day'] = property.default_prices_current_year[0].default_price_low_season_working_days_day
      this.defaultPricesData[this.yearCurrent]['low']['day']['friday'] = property.default_prices_current_year[0].default_price_low_season_friday_day
      this.defaultPricesData[this.yearCurrent]['low']['day']['saturday'] = property.default_prices_current_year[0].default_price_low_season_saturday_day
      this.defaultPricesData[this.yearCurrent]['low']['day']['sunday'] = property.default_prices_current_year[0].default_price_low_season_sunday_day
      this.defaultPricesData[this.yearCurrent]['low']['night']['working_day'] = property.default_prices_current_year[0].default_price_low_season_working_days_night
      this.defaultPricesData[this.yearCurrent]['low']['night']['friday'] = property.default_prices_current_year[0].default_price_low_season_friday_night
      this.defaultPricesData[this.yearCurrent]['low']['night']['saturday'] = property.default_prices_current_year[0].default_price_low_season_saturday_night
      this.defaultPricesData[this.yearCurrent]['low']['night']['sunday'] = property.default_prices_current_year[0].default_price_low_season_sunday_night

      // Setup next year
      this.defaultPricesData[this.yearNext] = {}
      this.defaultPricesData[this.yearNext]['high'] = {}
      this.defaultPricesData[this.yearNext]['low'] = {}
      this.defaultPricesData[this.yearNext]['high']['day'] = {}
      this.defaultPricesData[this.yearNext]['high']['night'] = {}
      this.defaultPricesData[this.yearNext]['low']['day'] = {}
      this.defaultPricesData[this.yearNext]['low']['night'] = {}
      this.defaultPricesData[this.yearNext]['high']['day']['working_day'] = property.default_prices_next_year[0].default_price_high_season_working_days_day || ''
      this.defaultPricesData[this.yearNext]['high']['day']['friday'] = property.default_prices_next_year[0].default_price_high_season_friday_day || ''
      this.defaultPricesData[this.yearNext]['high']['day']['saturday'] = property.default_prices_next_year[0].default_price_high_season_saturday_day || ''
      this.defaultPricesData[this.yearNext]['high']['day']['sunday'] = property.default_prices_next_year[0].default_price_high_season_sunday_day || ''
      this.defaultPricesData[this.yearNext]['high']['night']['working_day'] = property.default_prices_next_year[0].default_price_high_season_working_days_night || ''
      this.defaultPricesData[this.yearNext]['high']['night']['friday'] = property.default_prices_next_year[0].default_price_high_season_friday_night || ''
      this.defaultPricesData[this.yearNext]['high']['night']['saturday'] = property.default_prices_next_year[0].default_price_high_season_saturday_night || ''
      this.defaultPricesData[this.yearNext]['high']['night']['sunday'] = property.default_prices_next_year[0].default_price_high_season_sunday_night || ''
      this.defaultPricesData[this.yearNext]['low']['day']['working_day'] = property.default_prices_next_year[0].default_price_low_season_working_days_day || ''
      this.defaultPricesData[this.yearNext]['low']['day']['friday'] = property.default_prices_next_year[0].default_price_low_season_friday_day || ''
      this.defaultPricesData[this.yearNext]['low']['day']['saturday'] = property.default_prices_next_year[0].default_price_low_season_saturday_day || ''
      this.defaultPricesData[this.yearNext]['low']['day']['sunday'] = property.default_prices_next_year[0].default_price_low_season_sunday_day || ''
      this.defaultPricesData[this.yearNext]['low']['night']['working_day'] = property.default_prices_next_year[0].default_price_low_season_working_days_night || ''
      this.defaultPricesData[this.yearNext]['low']['night']['friday'] = property.default_prices_next_year[0].default_price_low_season_friday_night || ''
      this.defaultPricesData[this.yearNext]['low']['night']['saturday'] = property.default_prices_next_year[0].default_price_low_season_saturday_night || ''
      this.defaultPricesData[this.yearNext]['low']['night']['sunday'] = property.default_prices_next_year[0].default_price_low_season_sunday_night || ''
    }
  }
}
