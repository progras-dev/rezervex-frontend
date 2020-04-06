
export const saveContractsInStorage = {
  data: function () {
    return {
      constractList: []
    }
  },
  methods: {
    saveContractsInStorage(contracts) {
      this.constractList = []
      for (let i = 0; i < contracts.length; i++) {
        let contractTemp = {}
        contractTemp.id = contracts[i].id
        contractTemp.name = contracts[i].name
        contractTemp.title = contracts[i].title
        contractTemp.subtitle = contracts[i].subtitle
        contractTemp.text = contracts[i].text
        contractTemp.copyright = contracts[i].copyright
        contractTemp.project_id = contracts[i].project_id
        contractTemp.properties = contracts[i].properties
        contractTemp.fields = contracts[i].fields
        contractTemp.image_name = contracts[i].image_name
        contractTemp.image_path = contracts[i].image_path
        contractTemp.image_size = contracts[i].image_size
        contractTemp.created_at = contracts[i].created_at
        contractTemp.updated_at = contracts[i].updated_at
        contractTemp.deleted_at = contracts[i].deleted_at

        this.constractList.push(contractTemp)
      }
      this.$localStorage.set('contracts', JSON.stringify(this.constractList))
    }
  }
}
