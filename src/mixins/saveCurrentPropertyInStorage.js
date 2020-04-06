
export const saveCurrentPropertyInStorage = {
  methods: {
    saveCurrentPropertyInStorage(property) {
      let propertyFormatted = {
        address: property.address,
        admin_id: property.admin_id,
        capacity_general: property.capacity_general,
        capacity_with_food: property.capacity_with_food,
        contract: property.contract,
        contract_id: property.contract_id,
        created_at: property.created_at,
        default_prices_current_year: property.default_prices_current_year,
        default_prices_next_year: property.default_prices_next_year,
        deleted_at: property.deleted_at,
        description: property.description,
        has_invoice: property.has_invoice,
        high_season_months: property.high_season_months,
        id: property.id,
        invoice_counter: property.invoice_counter,
        is_deleted: property.is_deleted,
        lat: property.lat,
        lng: property.lng,
        low_season_months: property.low_season_months,
        managers: property.managers,
        managers_ids: property.managers_ids,
        name: property.name,
        project_id: property.project_id,
        thumbs: property.thumbs,
        updated_at: property.updated_at,
      }

      var propertiesImages = []

      if (property.images) {
        for (let j = 0; j < property.images.length; j++) {
          let propertyImage = {
            created_at: property.images[j].created_at,
            deleted_at: property.images[j].deleted_at,
            height: property.images[j].height,
            id: property.images[j].id,
            name: property.images[j].name,
            property_id: property.images[j].property_id,
            size: property.images[j].size,
            type: property.images[j].type,
            updated_at: property.images[j].updated_at,
            width: property.images[j].width
          }
          propertiesImages.push(propertyImage)
        }
      }

      propertyFormatted.images = propertiesImages.map(item => ({...item}))
      this.$localStorage.set('currentProperty', JSON.stringify(propertyFormatted))
    }
  }
}
