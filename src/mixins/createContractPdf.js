import Vue from 'vue'
import moment from 'moment'
import store from '../vuex/store'

export const createContractPdf = {
  data: function () {
    return {
      contractHeader: '',
    }
  },
  computed: {
    language () {
      return store.getters.getLanguage
    },
  },
  created() {
    this.getImages()
  },
  methods: {
    getImages() {
      this.$http.get(this.appApiPath + '/download_images')
        .then(response => {
          this.contractHeader = 'data:image/png;base64,' + response.body.logo
        }, response => {
          console.log('api error download_images')
          console.log(response)
        })
    },
    createContract({invoiceCounter, propertyName, user, contractInfo, clientData, bookingData}) {
      console.log({contractInfo})
      let today = moment().format('DD-MM-YYYY')
      let contract = {
        footer: [
          {text: contractInfo.copyright, alignment: 'center', fontSize: 10}
        ],
        content: [],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
          },
          emptyLine: {
            fontSize: 16,
          },
          right: {
            alignment: 'right',
          },
          rightRed: {
            alignment: 'right',
            color: 'red'
          },
          mt10: {
            margin: [0, 10, 0, 0]  // margin: [left, top, right, bottom]
          },
          contractFields: {
            margin: [0, 5, 0, 5],
            fontSize: 11
          },
          contractText: {
            fontSize: 8,
          },
        }
      }

      if (this.contractHeader) {
        contract.content.push({
          image: this.contractHeader,
          alignment: 'center',
          width: 599, // 800 * 0.7487922705314
          margin: [0, -40, 0, 20]
        })
      }

      let date = ''
      if (this.language === 'tr') {
        date = 'Tarih'
      } else if (this.language === 'en') {
        date = 'Date'
      }

      contract.content.push({
        columns: [
          {
            width: 180,
            text: '',
          },
          {
            width: '*',
            text: `N. ${invoiceCounter}`,
            margin: [0, 0, 0, 0],
            style: 'rightRed',
          },
          {
            width: '*',
            text: `${date}: ${today}`,
            style: 'right',
          }
        ]
      })

      if (contractInfo.logo) {
        contract.content.push({columns: [
          {
            width: 120,
            // height: 90,
            image: contractInfo.logo,
          },

          {
            width: '*',
            text: [
              {text: '   ' + '\n', style: 'emptyLine'},
              {text: contractInfo.title + '\n', style: 'header'},
              {text: contractInfo.subtitle, fontSize: 16}
            ],
            margin: [30, 0, 0, 0]
          }
        ]})
      } else {
        contract.content.push({
          text: [
            {text: '   ' + '\n', style: 'emptyLine'},
            {text: contractInfo.title + '\n', style: 'header'},
            {text: contractInfo.subtitle, fontSize: 16}
          ]
        })
      }

      var contentArray = []

      if (contractInfo.fieldsArray) {
        for (let i = 0; i < contractInfo.fieldsArray.length; i++) {
          let field = {...contractInfo.fieldsArray[i]}

          // Enter manager data if user is manager
          if (user.role === 'manager') {
            if (field.identifier === 'manager_name' && user.first_name !== null && user.last_name !== null) {
              contentArray.push({columns: [
                {
                  width: 130,
                  text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                  margin: [0, 10, 0, 0]
                },
                {
                  width: '*',
                  text: user.first_name + ' ' + user.last_name,
                  decoration: 'underline',
                  decorationStyle: 'dotted',
                  margin: [0, 10, 0, 0]
                }
              ]})
            }

            if (field.identifier === 'manager_phone' && user.phone !== null) {
              contentArray.push({columns: [
                {
                  width: 130,
                  text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
                },
                {
                  width: '*',
                  text: user.phone,
                  decoration: 'underline',
                  decorationStyle: 'dotted',
                }
              ]})
            }

            if (field.identifier === 'manager_address' && user.address !== null) {
              contentArray.push({columns: [
                {
                  width: 130,
                  text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
                },
                {
                  width: '*',
                  text: user.address,
                  decoration: 'underline',
                  decorationStyle: 'dotted',
                }
              ]})
            }
          } else {
            // Enter admin data if user is admin
            if (field.identifier === 'manager_name' && user.first_name !== null && user.last_name !== null) {
              contentArray.push({columns: [
                {
                  width: 130,
                  text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                  margin: [0, 10, 0, 0]
                },
                {
                  width: '*',
                  text: user.first_name + ' ' + user.last_name,
                  decoration: 'underline',
                  decorationStyle: 'dotted',
                  margin: [0, 10, 0, 0]
                }
              ]})
            }

            if (field.identifier === 'manager_phone' && user.phone !== null) {
              contentArray.push({columns: [
                {
                  width: 130,
                  text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
                },
                {
                  width: '*',
                  text: user.phone,
                  decoration: 'underline',
                  decorationStyle: 'dotted',
                }
              ]})
            }

            if (field.identifier === 'manager_address' && user.address !== null) {
              contentArray.push({columns: [
                {
                  width: 130,
                  text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
                },
                {
                  width: '*',
                  text: user.address,
                  decoration: 'underline',
                  decorationStyle: 'dotted',
                }
              ]})
            }
          }

          if (field.identifier === 'client_name' && clientData.clientFullName !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: clientData.clientFullName,
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'client_phone' && clientData.clientPhone !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: clientData.clientPhone,
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'client_email' && clientData.clientEmail !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: clientData.clientEmail,
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'property_name' && propertyName !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: propertyName,
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'wedding_date' && bookingData.date !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: moment(bookingData.date).format('DD-MM-YYYY'),
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'wedding_time' && bookingData.timeStart.HH !== null && bookingData.timeStart.mm !== null && bookingData.timeEnd.HH !== null && bookingData.timeEnd.mm !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: bookingData.timeStart.HH + ':' + bookingData.timeStart.mm + ' - ' + bookingData.timeEnd.HH + ':' + bookingData.timeEnd.mm,
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'bride_name' && clientData.brideFullName !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: clientData.brideFullName,
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'bride_region' && clientData.brideRegion !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: clientData.brideRegion,
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'bride_phone' && clientData.bridePhone !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: clientData.bridePhone,
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'bride_email' && clientData.brideEmail !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: clientData.brideEmail,
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'groom_name' && clientData.groomFullName !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: clientData.groomFullName,
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'groom_place' && clientData.groomRegion !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: clientData.groomRegion,
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'groom_phone' && clientData.groomPhone !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: clientData.groomPhone,
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'groom_email' && clientData.groomEmail !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: clientData.groomEmail,
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'total_guests' && bookingData.totalGuests !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: bookingData.totalGuests,
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'services') {
            if (bookingData.addedServices.length > 0) {
              contentArray.push({text: 'Ekstralar: '})

              for (let i = 0; i < bookingData.addedServices.length; i++) {
                let service = {...bookingData.addedServices[i]}
                if (service.type === 'flexible' && service.range_type === 'default') {
                  if (bookingData.totalGuests < 100) {
                    contentArray.push({
                      text: service.name + ' - (' + Vue.filter('numberFormat')(service.cost1) + ' * ' + bookingData.totalGuests + ') = ' + Vue.filter('numberFormat')(service.cost1 * bookingData.totalGuests),
                      italics: true
                    })
                  } else if (bookingData.totalGuests < 250) {
                    contentArray.push({
                      text: service.name + ' - (' + Vue.filter('numberFormat')(service.cost2) + ' * ' + bookingData.totalGuests + ') = ' + Vue.filter('numberFormat')(service.cost2 * bookingData.totalGuests),
                      italics: true
                    })
                  } else if (bookingData.totalGuests < 500) {
                    contentArray.push({
                      text: service.name + ' - (' + Vue.filter('numberFormat')(service.cost3) + ' * ' + bookingData.totalGuests + ') = ' + Vue.filter('numberFormat')(service.cost3 * bookingData.totalGuests),
                      italics: true
                    })
                  } else if (bookingData.totalGuests >= 500) {
                    contentArray.push({
                      text: service.name + ' - (' + Vue.filter('numberFormat')(service.cost4) + ' * ' + bookingData.totalGuests + ') = ' + Vue.filter('numberFormat')(service.cost4 * bookingData.totalGuests),
                      italics: true
                    })
                  }
                } else if (service.type === 'flexible' && service.range_type === 'custom') {
                  for (let j = 0; j < service.range_costs.length; j++) {
                    let rangeData = {...service.range_costs[j]}
                    if (bookingData.totalGuests <= rangeData.min && bookingData.totalGuests <= rangeData.max) {
                      contentArray.push({
                        text: service.name + ' - (' + Vue.filter('numberFormat')(rangeData.cost) + ' * ' + bookingData.totalGuests + ') - ' + Vue.filter('numberFormat')(rangeData.cost * bookingData.totalGuests),
                        italics: true
                      })
                    }
                  }
                  // If totalGuests number is bigger than contemplated in the range
                  if (bookingData.totalGuests > service.range_costs[service.range_costs.length - 1].max) {
                    let cost = service.range_costs[service.range_costs.length - 1].cost
                    contentArray.push({
                      text: service.name + ' - (' + Vue.filter('numberFormat')(cost) + ' * ' + bookingData.totalGuests + ') - ' + Vue.filter('numberFormat')(cost * bookingData.totalGuests),
                      italics: true
                    })
                  }
                } else if (service.type === 'fixed') {
                  contentArray.push({text: service.name + ' - ' + Vue.filter('numberFormat')(service.cost), italics: true})
                }
              }

              contentArray.push({text: '', margin: [0, 0, 0, 10]})
            }

            if (bookingData.addedServices.length === 0) {
              contentArray.push({columns: [
                {
                  width: 130,
                  text: 'Ekstralar: '
                },
                {
                  width: '*',
                  text: 'Ekstra yok',
                  decoration: 'underline',
                  decorationStyle: 'dotted',
                  italics: true
                }
              ]})
            }
          }

          if (field.identifier === 'notes' && bookingData.notes !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: bookingData.notes,
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'total_cost' && bookingData.totalCost !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: Vue.filter('numberFormat')(bookingData.totalCost),
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'advance' && bookingData.advance !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: Vue.filter('numberFormat')(bookingData.advance),
              }
            ]})
          }

          if (field.identifier === 'remaining' && bookingData.totalCost !== null && bookingData.advance !== null) {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: Vue.filter('numberFormat')(bookingData.totalCost - bookingData.advance),
              }
            ]})
          }
        }
      }

      contract.content.push({
        style: 'contractFields',
        table: {
          widths: [500],
          body: [
            [
              contentArray
            ]
          ]
        },
        layout: {
          hLineColor: function () {
            return '#555'
          },
          vLineColor: function () {
            return '#555'
          },
          paddingLeft: function () { return 15 },
          paddingRight: function () { return 10 },
          paddingTop: function () { return 10 },
          paddingBottom: function () { return 10 },
        }
      })

      contract.content.push({
        style: 'contractText',
        table: {
          widths: [500],
          body: [
            [
              [
                {text: contractInfo.text},
                {
                  columns: [
                    {
                      width: 120,
                      text: '',
                      margin: [0, 5, 0, 0]
                    },
                    {
                      width: 180,
                      text: this.language === 'tr' ? 'Salon müdürü ' : 'Property Manager',
                      margin: [0, 5, 0, 0]
                    },
                    {
                      width: '*',
                      text: this.language === 'tr' ? 'Tören sahibi ' : 'Customer',
                      margin: [0, 5, 0, 0]
                    }
                  ]
                },
                {
                  columns: [
                    {
                      width: 120,
                      text: '',
                    },
                    {
                      width: 180,
                      text: (this.language === 'tr' ? 'İsim Soyad: ' : 'Name Surname: ') + user.first_name + ' ' + user.last_name,
                    },
                    {
                      width: '*',
                      text: (this.language === 'tr' ? 'İsim Soyad: ' : 'Customer: ')  + clientData.clientFullName,
                    }
                  ]
                },
                {
                  columns: [
                    {
                      width: 120,
                      text: '',
                      margin: [0, 0, 0, 30]
                    },
                    {
                      width: 180,
                      text: this.language === 'tr' ? 'İmza: ' : 'Signature: ',
                      margin: [0, 0, 0, 30]
                    },
                    {
                      width: '*',
                      text: this.language === 'tr' ? 'İmza: ' : 'Signature: ',
                      margin: [0, 0, 0, 30]
                    }
                  ]
                },
              ],
            ]
          ]
        },
        layout: {
          hLineColor: function () {
            return '#555'
          },
          vLineColor: function () {
            return '#555'
          },
          paddingLeft: function () { return 15 },
          paddingRight: function () { return 10 },
          paddingTop: function () { return 10 },
          paddingBottom: function () { return 10 },
        }
      })
      return contract
      // pdfMake.createPdf(contract).download('sample.pdf')
    },
  }
}
