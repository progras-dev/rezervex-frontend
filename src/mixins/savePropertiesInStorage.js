
export const savePropertiesInStorage = {
  data: function () {
    return {
      propertiesList: []
    }
  },
  methods: {
    savePropertiesInStorage(properties, mode) {
      this.propertiesList = []
      for (let i = 0; i < properties.length; i++) {
        let propertyTemp = {...properties[i]}

        let property = {
          address: propertyTemp.address,
          admin_id: propertyTemp.admin_id,
          capacity_general: propertyTemp.capacity_general,
          capacity_with_food: propertyTemp.capacity_with_food,
          contract: propertyTemp.contract,
          contract_id: propertyTemp.contract_id,
          created_at: propertyTemp.created_at,
          default_prices_current_year: propertyTemp.default_prices_current_year,
          default_prices_next_year: propertyTemp.default_prices_next_year,
          deleted_at: propertyTemp.deleted_at,
          description: propertyTemp.description,
          has_invoice: propertyTemp.has_invoice,
          high_season_months: propertyTemp.high_season_months,
          id: propertyTemp.id,
          invoice_counter: propertyTemp.invoice_counter,
          is_deleted: propertyTemp.is_deleted,
          lat: propertyTemp.lat,
          lng: propertyTemp.lng,
          low_season_months: propertyTemp.low_season_months,
          managers: propertyTemp.managers,
          managers_ids: propertyTemp.managers_ids,
          name: propertyTemp.name,
          project_id: propertyTemp.project_id,
          thumbs: propertyTemp.thumbs,
          updated_at: propertyTemp.updated_at,
        }

        var propertiesImages = []

        if (propertyTemp.images) {
          for (let j = 0; j < propertyTemp.images.length; j++) {
            let propertyImage = {
              created_at: propertyTemp.images[j].created_at,
              deleted_at: propertyTemp.images[j].deleted_at,
              height: propertyTemp.images[j].height,
              id: propertyTemp.images[j].id,
              name: propertyTemp.images[j].name,
              property_id: propertyTemp.images[j].property_id,
              size: propertyTemp.images[j].size,
              type: propertyTemp.images[j].type,
              updated_at: propertyTemp.images[j].updated_at,
              width: propertyTemp.images[j].width
            }
            propertiesImages.push(propertyImage)
          }
        }

        property.images = propertiesImages.map(item => ({...item}))
        this.propertiesList.push(property)
      }

      if (mode === 'admin') {
        this.$localStorage.set('properties', JSON.stringify(this.propertiesList))
      } else if (mode === 'manager') {
        this.$localStorage.set('propertiesManager', JSON.stringify(this.propertiesList))
      }
    }
  }
}
