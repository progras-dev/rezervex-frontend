<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
          <span v-lang.bookDate v-if="!isEditingExistingBooking"></span>
          <span v-lang.bookingEdit v-if="isEditingExistingBooking"></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.bookingSubtitle></span></div>
      </div>
    </div>

    <form-wizard title="" subtitle="" color="#79C447" @on-complete="prepareBookingToSubmit" @on-change="updateTab" ref="wizard" :start-index.sync="stepIndex">

      <button class="btn btn-success white confirmButton" slot="finish">
        <i v-if="!showSpinner" class="fa fa-check-square buttonIcon"></i>
        <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
        <!--lang bug - don't change-->
        <span v-if="language === 'en' && !isEditingExistingBooking">Confirm Booking</span>
        <span v-if="language === 'tr' && !isEditingExistingBooking">Rezervasyonu Onaylama</span>
        <span v-if="language === 'en' && isEditingExistingBooking">Update Booking</span>
        <span v-if="language === 'tr' && isEditingExistingBooking">Rezervasyonu Güncelle</span>
        <!--<span v-lang.confirmBooking></span>-->
      </button>

      <button class="btn btn-success white confirmButton" slot="prev">
        <i class="fa fa-chevron-left buttonIcon"></i>
        <span v-lang.previous></span>
      </button>

      <button class="btn btn-success white confirmButton" slot="next" v-if="stepIndex !== 1">
        <span v-lang.next></span>
        <i class="fa fa-chevron-right buttonIcon"></i>
      </button>
      <button class="btn btn-success white confirmButton" @click="skipOffer" slot="next" v-if="stepIndex === 1 && !isEditingExistingBooking">
        <span v-if="language === 'tr'">Teklifi Geç</span>
        <span v-if="language === 'en'">Skip offers</span>
        <i class="fa fa-chevron-right buttonIcon"></i>
      </button>


      <tab-content :title="customerData" icon="fa fa-user" :before-change="validateTabCustomerData" v-if="!isEditingExistingBooking">

        <b-card>
          <div slot="header">
            <span class="card-text text-success bookingTabTitle"><span v-lang.customerInfo></span></span>
          </div>

          <div v-if="properties.length > 0">

            <div class="jumbotron jumbotron-fluid jumbotronCustom">
              <div class="container">
                <span class="bookingTabInfo">
                  <i class="fa fa-info-circle bookingTabInfoIcon"></i>
                  <span v-lang.customerDataTabInfo class="bookingTabInfoText"></span>
                </span>
              </div>
            </div>

            <h3 class="card-text text-success bookingTabSubtitle"><span v-lang.customerList></span></h3>

            <v-select v-model="selectedClient" :options="clientListFormatted" @input="clientSelected"></v-select>

            <h3 class="card-text text-success mt25 bookingTabSubtitle"><span v-lang.customerInfo></span></h3>

            <div class="form-group">
              <label for="inputName"><span v-lang.fullName></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-user iconColor"></i></span>
                <input type="text" class="form-control" :class="{'is-invalid': $v.clientFullName.$error && customerDataSubmitted}" id="inputName" :placeholder="labelFullName" v-model="clientFullName" @input="$v.clientFullName.$touch()">
              </div>
              <div class="invalid-feedback" v-if="!$v.clientFullName.required && customerDataSubmitted">
                <span v-lang.nameRequired></span>
              </div>
            </div>

            <div class="form-group">
              <label for="inputPhone"><span v-lang.phone></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-phone iconColor"></i></span>
                <input class="form-control" type="tel" v-mask="'(###) ### ## ##'" :placeholder="'(###) ### ## ##'" :class="{'is-invalid': $v.clientPhone.$error && customerDataSubmitted}" id="inputPhone" v-model="clientPhone" @input="$v.clientPhone.$touch()">
              </div>
              <div class="invalid-feedback" v-if="!$v.clientPhone.required && customerDataSubmitted">
                <span v-lang.phoneRequired></span>
              </div>
            </div>

            <div class="form-group">
              <label for="inputEmail"><span v-lang.email></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-envelope iconColor"></i></span>
                <input type="text" class="form-control" :class="{'is-invalid': $v.clientEmail.$error && customerDataSubmitted}" id="inputEmail" :placeholder="labelEmail" v-model="clientEmail" @blur="$v.clientEmail.$touch()">
              </div>
              <div class="invalid-feedback" v-if="!$v.clientEmail.required && customerDataSubmitted">
                <span v-lang.emailRequired></span>
              </div>
              <div class="invalid-feedback" v-if="!$v.clientEmail.email && $v.clientEmail.$dirty">
                <span v-lang.emailValid></span>
              </div>
            </div>

          </div>

          <div v-if="properties.length === 0">
            <div class="alert alert-warning" role="alert" v-if="properties.length === 0">
              <i class="fa fa-warning"></i> &nbsp;
              <span v-lang.noPropertiesWarning></span>
            </div>
          </div>

        </b-card>


      </tab-content>


      <tab-content :title="prepareOffer" icon="fa fa-calendar" :before-change="validateTabOffer" v-if="!isEditingExistingBooking">

        <b-card>
          <div slot="header">
            <span class="card-text text-success bookingTabTitle"><span v-lang.createOffers></span></span>
          </div>

          <div class="jumbotron jumbotron-fluid jumbotronCustom">
            <div class="container">
              <span class="bookingTabInfo">
                <i class="fa fa-info-circle bookingTabInfoIcon"></i>
                <span v-lang.offerTabInfo class="bookingTabInfoText"></span> <br/>
                <span v-lang.offerTabInfo2 class="bookingTabInfoText"></span>
              </span>
            </div>
          </div>

          <div class="row">

            <div class="col-md-7 col-sm-12">

              <!--<h3 class="card-text text-success"><span v-lang.dateSelect></span></h3>-->

              <calendar ref="wizardOffers"
                        :daysSelected="daysSelected"
                        :daysBusy="daysBusy"
                        :daysReserved="daysReserved"
                        :range-status="0"
                        class="event-calendar"
                        :value="value"
                        :disabled-days-of-week="disabled"
                        :format="format"
                        :clear-button="clear"
                        :pane="1"
                        :has-input="false"
                        :on-day-click="onDayClickOfferTab"
                        :change-pane="changePaneOffer">

                <div class="event" v-for="(dayPrice, index) in events" :key="index" :slot="dayPrice.date">

                  <!--{{ dayPrice.date }} <br>

                  {{ moment(dayPrice.date).year() }} <br>

                  {{ dayPrice.date.substring(0, 4) }}-->

                  <span class="calendarEventSpan" v-if="pricesArray[dayPeriod][dayPrice.date]">
                    {{ pricesArray[dayPeriod][dayPrice.date].price | numberFormatNoDecimal }}
                  </span>
                  <span class="calendarEventSpan" v-if="!pricesArray[dayPeriod][dayPrice.date] && defaultPricesData[dayPrice.date.substring(0, 4)][currentMonthSeason]">
                    {{ defaultPricesData[dayPrice.date.substring(0, 4)][currentMonthSeason][dayPeriod][dayPrice.type] | numberFormatNoDecimal }}
                  </span>

                </div>

              </calendar>

            </div>

            <div class="col-md-5 col-sm-12">

              <div class="offerLegendContainer">
                <label><span v-lang.dateSelectInfo></span></label> <br>
                <span class="legendBlock">
                  <div class="yellowSquare"></div>
                  <p class="card-text"><span v-lang.today class="legendText"></span></p>
                </span>
                <span class="legendBlock">
                  <div class="redSquare"></div>
                  <p class="card-text"><span v-lang.dayBusy class="legendText"></span></p>
                </span>
                <span class="legendBlock">
                  <div class="greenSquare"></div>
                  <p class="card-text"><span v-lang.weekend class="legendText"></span></p>
                </span>

                <span class="legendBlock">
                  <div class="blueSquare"></div>
                  <p class="card-text"><span v-lang.selectedDays class="legendText"></span></p>
                </span>
                <div class="legendBlock">
                  <div class="orangeSquare"></div>
                  <p class="card-text"><span v-lang.dayReserved class="legendText"></span></p>
                </div>
              </div>

              <div>
                <toggle-button v-if="language == 'en'" class="toggleDayNight" v-model="dayPeriodToggle" @change="changeDayPeriod" :labels="{checked: 'Night', unchecked: 'Day'}" :width="150" :height="40" :color="{checked: '#8398ea', unchecked: '#82C7EB'}"/>
                <toggle-button v-if="language == 'tr'" class="toggleDayNight" v-model="dayPeriodToggle" @change="changeDayPeriod" :labels="{checked: 'Gece', unchecked: 'Gün'}" :width="150" :height="40" :color="{checked: '#8398ea', unchecked: '#82C7EB'}"/>
              </div>

              <div class="form-group mt20" v-if="properties">
                <label><span v-lang.propertySelect></span></label>
                <div class="input-group">
                  <span class="input-group-addon mt3"><i class="fa fa-2x fa-building iconColor"></i></span>
                  <b-form-select v-model="currentPropertyId" :options="propertiesFormatted" @input="propertyChanged()">
                  </b-form-select>
                </div>
              </div>

              <div class="form-group">
                <label for="inputTotalGuests"><span v-lang.totalGuests></span></label>
                <div class="input-group">
                  <span class="input-group-addon mt3"><i class="fa fa-2x fa-users iconColor"></i></span>
                  <input type="number" class="form-control" id="inputTotalGuests" :placeholder="labelTotalGuests" v-model="totalGuests" @blur="totalGuestOnBlur">
                </div>
              </div>

              <div class="form-group mt25">
                <button class="btn btn-lg btn-block btn-primary white buttonMain" style="font-size: 1.2rem; line-height: 1.8;" @click="generateOffers">
                  <i class="fa fa-th-list"></i>
                  <span v-lang.generateOffers></span>
                </button>
              </div>

            </div>

          </div>

          <div class="row">
            <div class="col-12" v-if="showOfferList">

              <h3 class="card-text text-success"><span v-lang.offerList></span></h3>

              <div class="jumbotron jumbotron-fluid jumbotronCustom">
                <div class="container">
                  <span class="bookingTabInfo">
                    <i class="fa fa-info-circle bookingTabInfoIcon"></i>
                    <span v-lang.offerTabInfo3 class="bookingTabInfoText"></span>
                  </span>
                </div>
              </div>

              <div class="buttonsOrderList">
                <!--<button class="btn btn-info white" :class="{'active': activeOrderOffer === 'date'}" @click="orderOffers('date')">
                  <i class="fa fa-chevron-down"></i>
                  <span v-lang.orderByDate></span>
                </button>
                <button class="btn btn-info white" :class="{'active': activeOrderOffer === 'price'}" @click="orderOffers('price')">
                  <i class="fa fa-chevron-down"></i>
                  <span v-lang.orderByPrice></span>
                </button>-->
                <button class="btn buttonPrintOffers white" @click="offerListPrint()">
                  <i class="fa fa-file-pdf-o mr-1"></i>
                  <span v-lang.printOffersPdf></span>
                </button>
              </div>


              <ul class="list-group">
                <li class="list-group-item list-group-item-action flex-column align-items-start" style="margin-top: 10px; margin-bottom: 5px;" v-for="(offer, index) in offerList" :key="index">
                  <div class="d-flex w-100 justify-content-between">
                    <div class="mb-2">
                      <span class="offerDate">
                        <i class="fa fa-calendar text-success"></i> <span class="text-success"> {{ offer.shortDate }}</span>
                      </span>  
                      <span class="offerDayType text-info" v-if="offer.dayType === 'day'"><i class="fa fa-sun-o"></i> <span v-lang.day></span></span>
                      <span class="offerDayType text-info" v-if="offer.dayType === 'night'"><i class="fa fa-moon-o"></i> <span v-lang.night></span></span>
                        <br>
                      <span class="offerDayLongDate">{{ offer.longDate }}</span>
                    </div>
                    <p class="mb-1">
                      <span v-if="offer.withServices" class="badge badge-pill badgeWithServices"><span v-lang.withServices></span></span>
                    </p>
                  </div>

                  <span class="offerItem font-weight-bold mb-2"> <i class="fa fa-building"></i> {{ currentProperty.name }}</span>
                  <span class="offerItem mb-3"> <i class="fa fa-money mr-1"></i>  <span v-lang.price></span>: {{ offer.price | numberFormat }}</span>

                  <div v-if="offer.withServices">
                    <span class="offerServiceTitle text-info mb-1">
                      <i class="fa fa-tags"></i> &nbsp; <b><span v-lang.services></span></b>:
                    </span>
                    <div v-for="(service, index) in serviceListScoped" :key="index" class="offerServiceContainer">
                      <span class="offerServiceName">{{service.name}}</span>
                      <span class="offerServiceDescription" v-if="service.description !== ''">{{service.description}}</span>
                      <span class="offerServicePrice"> 
                        <span v-lang.serviceCost></span>: 
                        {{service.totalCost | numberFormat}} 
                        <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 100 && !isEditingExistingBooking" >
                          ({{ service.cost1 | numberFormat }} * {{ totalGuests }} <span v-lang.guest></span>)
                        </span>
                        <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 250 && totalGuests > 100 && !isEditingExistingBooking" >
                         ({{ service.cost2 | numberFormat }} * {{ totalGuests }} <span v-lang.guest></span>)
                        </span>
                        <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 500 && totalGuests > 250 && !isEditingExistingBooking" >
                          ({{ service.cost3 | numberFormat }} * {{ totalGuests }} <span v-lang.guest></span>)
                        </span>
                        <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests > 500 && !isEditingExistingBooking" >
                          ({{ service.cost4 | numberFormat }} * {{ totalGuests }} <span v-lang.guest></span>)
                        </span>
                        <span v-if="service.type === 'flexible' && service.range_type === 'default' && isEditingExistingBooking" >
                          ({{ service.cost | numberFormat }} * {{ totalGuests }} <span v-lang.guest></span>)
                        </span>
                      </span>
                    </div>
                  </div>

                  <p class="offerServiceName"><span v-lang.pricePlusService></span>: {{ offer.totalCost | numberFormat }}</p>

                  <div style="display: flex;">
                    <div class="input-group" style="margin-right: 10px">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-calendar-check-o"></i> </div>
                      </div>
                      <input type="number" class="form-control" :class="{'is-invalid': showErrorValidityDays}" v-model.trim="offerValidityDays" :placeholder="labelDaysExpiration" @input="errorValidityReset">
                      <span class="input-group-btn">
                        <button class="btn btn-info white" type="button" @click="reserveDate(offer)">
                          <i v-if="!showSpinnerReserveDate" class="fa fa-calendar-day buttonIcon"></i>
                          <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerReserveDate"></icon>
                          <span v-lang.reserveDate></span>
                        </button>
                      </span>
                    </div>

                    <div class="input-group">
                      <button class="btn btn-success white" @click="selectOffer(offer)"> <i class="fa fa-check mr-1"></i> <span v-lang.select></span></button>
                    </div>

                    <!--<button class="btn btn-success white buttonSelectOffer" @click="selectOffer(offer)"> <i class="fa fa-check"></i> <span v-lang.select></span></button>-->
                    <!--<button class="btn btn-info white buttonSelectOffer" @click="reserveDate(offer)"> <i class="fa fa-calendar-check-o"></i> <span v-lang.reserveDate></span></button>-->
                  </div>

                </li>
              </ul>

            </div>
          </div>

        </b-card>

      </tab-content>

      <tab-content :title="makeBooking" icon="fa fa-pencil-square-o" :before-change="validateTabBookingData">

        <b-card>
          <div slot="header">
            <span class="card-text text-success bookingTabTitle"><span v-lang.bookDate></span></span>
          </div>

          <div class="jumbotron jumbotron-fluid jumbotronCustom">
            <div class="container">
              <span class="bookingTabInfo">
                <i class="fa fa-info-circle bookingTabInfoIcon"></i>
                <span v-lang.bookingTabInfo class="bookingTabInfoText"></span>
              </span>
            </div>
          </div>

          <div class="row">

            <div class="col-md-7 col-sm-12">

              <calendar ref="wizardBooking"
                        :daysSelected="daysSelected"
                        :daysBusy="daysBusy"
                        :daysReserved="daysReserved"
                        :range-status="0"
                        class="event-calendar"
                        :value="value"
                        :disabled-days-of-week="disabled"
                        :format="format"
                        :clear-button="clear"
                        :pane="1"
                        :has-input="false"
                        :on-day-click="onDayClickBookingTab"
                        :change-pane="changePaneBooking">

                <div class="event" v-for="(dayPrice, index) in events" :key="index" :slot="dayPrice.date">
                  <span class="calendarEventSpan" v-if="pricesArray[dayPeriod][dayPrice.date]">
                    {{ pricesArray[dayPeriod][dayPrice.date].price | numberFormatNoDecimal }}
                  </span>
                  <span class="calendarEventSpan" v-if="!pricesArray[dayPeriod][dayPrice.date] && defaultPricesData[dayPrice.date.substring(0, 4)][currentMonthSeason]">
                    {{ defaultPricesData[dayPrice.date.substring(0, 4)][currentMonthSeason][dayPeriod][dayPrice.type] | numberFormatNoDecimal }}
                  </span>
                </div>

              </calendar>

              <h3 class="card-text text-success" style="margin-bottom: 20px;"><span v-lang.extras></span></h3>


              <div class="infoText" style="margin-top: -19px;margin-bottom: 14px;">
                <p class="card-text">
                  <span v-lang.bookingServicesInfoText1></span> <br>
                  <span v-lang.bookingServicesInfoText2></span>
                </p>
              </div>


              <div class="btn-group-toggle" data-toggle="buttons">
                <label class="btn btn-info serviceButton" :class="{active: service.active}" v-for="(service, index) in serviceListScoped" :key="index">
                  <input type="checkbox" checked autocomplete="off" @click="selectService(service)"> {{ service.name }}
                </label>
              </div>


              <div class="alert alert-warning alert-dismissible fade show" role="alert" style="margin-top: 14px;" v-if="showAlertService">
                <span v-lang.alertGuestBiggerThanServiceRange1></span>
                <span v-for="(service, index) in alertServicesArray" :key="index">
                  <strong>{{ service.name }}</strong><span v-if="index !== alertServicesArray.length - 1">, </span><span v-if="index === alertServicesArray.length - 1">. </span>
                </span>
                <br>
                <span v-lang.alertGuestBiggerThanServiceRange2></span>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="showAlertService = false">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>




              <div class="serviceList">

                <p class="card-text lead"  v-for="(service, index) in addedServices" :key="index">
                  <i class="fa fa-edit text-primary" v-if="service.id !== currentServiceToEdit.id || !isServiceEdit" @click="serviceEdit(service)" data-toggle="tooltip" data-placement="top" title="Edit service"></i>
                  <i class="fa fa-chevron-up text-primary" v-if="service.id === currentServiceToEdit.id && isServiceEdit" @click="serviceEdit(service)" data-toggle="tooltip" data-placement="top" title="Edit service"></i>
                  <!--<i class="fa fa-trash-o text-danger serviceRemoveIcon" @click="serviceRemove(service, index)" data-toggle="tooltip" data-placement="top" title="Remove service"></i>-->
                  <i
                    class="fa fa-info-circle"
                    v-if="service.type === 'flexible' && service.range_type === 'default'"
                    v-tooltip="'<= 100 - ' + service.cost1 + '₺<br> <= 250 - ' + service.cost2 + '₺<br> <= 500 - ' +  service.cost3 + '₺<br> > 500 - ' + service.cost4 + '₺'"
                  ></i>
                  <span v-if="service.type === 'fixed'">
                    {{ service.name }} - {{ service.cost | numberFormat }}
                  </span>
                  <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 100 && !isEditingExistingBooking" >
                    {{ service.name }} - {{ service.cost1 | numberFormat }} (<span v-lang.total></span>: {{ service.cost1 | numberFormat }} * {{ totalGuests }} = {{ service.cost1 * totalGuests | numberFormat }})
                  </span>
                  <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 250 && totalGuests > 100 && !isEditingExistingBooking" >
                    {{ service.name }} - {{ service.cost2 | numberFormat }} (<span v-lang.total></span>: {{ service.cost2 | numberFormat }} * {{ totalGuests }} = {{ service.cost2 * totalGuests | numberFormat }})
                  </span>
                  <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 500 && totalGuests > 250 && !isEditingExistingBooking" >
                    {{ service.name }} - {{ service.cost3 | numberFormat }} (<span v-lang.total></span>: {{ service.cost3 | numberFormat }} * {{ totalGuests }} = {{ service.cost3 * totalGuests | numberFormat }})
                  </span>
                  <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests > 500 && !isEditingExistingBooking" >
                    {{ service.name }} - {{ service.cost4 | numberFormat }} (<span v-lang.total></span>: {{ service.cost4 | numberFormat }} * {{ totalGuests }} = {{ service.cost4 * totalGuests | numberFormat }})
                  </span>
                  <span v-if="service.type === 'flexible' && service.range_type === 'default' && isEditingExistingBooking" >
                    {{ service.name }} - {{ service.cost | numberFormat }} (<span v-lang.total></span>: {{ service.cost | numberFormat }} * {{ totalGuests }} = {{ service.cost * totalGuests | numberFormat }})
                  </span>


                  <span  v-if="service.type === 'flexible' && service.range_type === 'custom'">
                    <span v-for="(tooltipData, index) in tooltipInfoArray" :key="index">
                      <i
                        class="fa fa-info-circle"
                        v-if="tooltipData.service_id === service.id"
                        v-tooltip="tooltipData.text"
                      ></i>
                    </span>
                    {{ service.name }} -
                    <span v-for="rangeData in service.range_costs" :key="rangeData.id">
                      <span v-if="totalGuests >= rangeData.min && totalGuests <= rangeData.max">
                        {{ rangeData.cost | numberFormat }}
                        (<span v-lang.total></span>: {{ rangeData.cost | numberFormat }} * {{ totalGuests }} = {{ rangeData.cost * totalGuests | numberFormat }} )
                      </span>
                    </span>
                    <span v-if="totalGuests > service.range_costs[service.range_costs.length - 1].max">
                      {{ service.range_costs[service.range_costs.length - 1].cost |numberFormat }}
                      (<span v-lang.total></span>: {{ service.range_costs[service.range_costs.length - 1].cost |numberFormat }} * {{ totalGuests }} = {{ service.range_costs[service.range_costs.length - 1].cost * totalGuests | numberFormat }} )
                    </span>
                  </span>

                  <!--FIXED SERVICES-->
                  <span class="discountInput input-group" v-if="isServiceEdit && currentServiceToEdit.id === service.id && service.type === 'fixed'">
                    <span class="input-group-addon mt3" id="service-edit-fixed">₺</span>
                    <input type="number" class="form-control lightBorders" v-model.trim="currentServiceToEdit.cost" placeholder="Discount" aria-label="Discount" aria-describedby="service-edit-fixed">
                    <span class="input-group-btn">
                      <button class="btn btn-success white" type="button" @click="serviceUpdate('')">
                        <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerServiceEdit"></icon>
                        <i class="fa fa-check" v-if="showSpinnerServiceUpdatedSuccess"></i>
                        <span v-lang.update></span>
                      </button>
                    </span>
                  </span>

                  <!--FLEBIBLE DEFAULT SERVICES-->
                  <span class="discountInput input-group" v-if="isServiceEdit && currentServiceToEdit.id === service.id && service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 100 && !isEditingExistingBooking">
                    <span class="input-group-addon mt3" id="service-edit-flex1">₺</span>
                    <input type="number" class="form-control lightBorders" v-model.trim="currentServiceToEdit.cost1" placeholder="Misafir sayısı < 100" aria-label="Discount" aria-describedby="service-edit-flex1">
                    <span class="input-group-btn">
                      <button class="btn btn-success white" type="button" @click="serviceUpdate('cost1')">
                        <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerServiceEdit"></icon>
                        <i class="fa fa-check" v-if="showSpinnerServiceUpdatedSuccess"></i>
                        <span v-lang.update></span>
                      </button>
                    </span>
                  </span>
                  <span class="discountInput input-group" v-if="isServiceEdit && currentServiceToEdit.id === service.id && service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 250 && totalGuests > 100 && !isEditingExistingBooking">
                    <span class="input-group-addon mt3" id="service-edit-flex2">₺</span>
                    <input type="number" class="form-control lightBorders" v-model.trim="currentServiceToEdit.cost2" placeholder="Misafir sayısı < 250" aria-label="Discount" aria-describedby="service-edit-flex2">
                    <span class="input-group-btn">
                      <button class="btn btn-success white" type="button" @click="serviceUpdate('cost2')">
                        <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerServiceEdit"></icon>
                        <i class="fa fa-check" v-if="showSpinnerServiceUpdatedSuccess"></i>
                        <span v-lang.update></span>
                      </button>
                    </span>
                  </span>
                  <span class="discountInput input-group" v-if="isServiceEdit && currentServiceToEdit.id === service.id && service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 500 && totalGuests > 250 && !isEditingExistingBooking">
                    <span class="input-group-addon mt3" id="service-edit-flex3">₺</span>
                    <input type="number" class="form-control lightBorders" v-model.trim="currentServiceToEdit.cost3" placeholder="Misafir sayısı < 500" aria-label="Discount" aria-describedby="service-edit-flex3">
                    <span class="input-group-btn">
                      <button class="btn btn-success white" type="button" @click="serviceUpdate('cost3')">
                        <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerServiceEdit"></icon>
                        <i class="fa fa-check" v-if="showSpinnerServiceUpdatedSuccess"></i>
                        <span v-lang.update></span>
                      </button>
                    </span>
                  </span>
                  <span class="discountInput input-group" v-if="isServiceEdit && currentServiceToEdit.id === service.id && service.type === 'flexible' && service.range_type === 'default' && totalGuests > 500 && !isEditingExistingBooking">
                    <span class="input-group-addon mt3" id="service-edit-flex4">₺</span>
                    <input type="number" class="form-control lightBorders" v-model.trim="currentServiceToEdit.cost4" placeholder="Misafir sayısı > 500" aria-label="Discount" aria-describedby="service-edit-flex4">
                    <span class="input-group-btn">
                      <button class="btn btn-success white" type="button" @click="serviceUpdate('cost4')">
                        <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerServiceEdit"></icon>
                        <i class="fa fa-check" v-if="showSpinnerServiceUpdatedSuccess"></i>
                        <span v-lang.update></span>
                      </button>
                    </span>
                  </span>
                  <span class="discountInput input-group" v-if="isServiceEdit && currentServiceToEdit.id === service.id && service.type === 'flexible' && service.range_type === 'default' && isEditingExistingBooking">
                    <span class="input-group-addon mt3" id="service-edit-flex4">₺</span>
                    <input type="number" class="form-control lightBorders" v-model.trim="currentServiceToEdit.cost" aria-label="Discount" aria-describedby="service-edit-flex4">
                    <span class="input-group-btn">
                      <button class="btn btn-success white" type="button" @click="serviceUpdate('')">
                        <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerServiceEdit"></icon>
                        <i class="fa fa-check" v-if="showSpinnerServiceUpdatedSuccess"></i>
                        <span v-lang.update></span>
                      </button>
                    </span>
                  </span>

                  <!--FLEBIBLE CUSTOM SERVICES-->
                  <span class="discountInput input-group" v-if="isServiceEdit && currentServiceToEdit.id === service.id && service.type === 'flexible' &&  service.range_type === 'custom'">
                   <span class="input-group-addon mt3" id="service-edit-custom">₺</span>
                    <input type="number" class="form-control lightBorders" v-model.trim="currentServiceToEdit.cost" placeholder="Discount" aria-label="Discount" aria-describedby="service-edit-fixed">
                    <span class="input-group-btn">
                      <button class="btn btn-success white" type="button" @click="serviceUpdate('')">
                        <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerServiceEdit"></icon>
                        <i class="fa fa-check" v-if="showSpinnerServiceUpdatedSuccess"></i>
                        <span v-lang.update></span>
                      </button>
                    </span>
                 </span>

                </p>
              </div>

            </div>

            <div class="col-md-5 col-sm-12">

              <div class="mt10">
                <label style="display: block;"><span v-lang.dateSelectInfo></span></label>
                <div class="legendBlock">
                  <div class="yellowSquare"></div>
                  <p class="card-text"><span v-lang.today class="legendText"></span></p>
                </div>
                <div class="legendBlock">
                  <div class="redSquare"></div>
                  <p class="card-text"><span v-lang.dayBusy class="legendText"></span></p>
                </div>
                <div class="legendBlock">
                  <div class="greenSquare"></div>
                  <p class="card-text"><span v-lang.weekend class="legendText"></span></p>
                </div>
              </div>

              <div>
                <div class="legendBlock">
                  <div class="blueSquare"></div>
                  <p class="card-text"><span v-lang.selectedDay class="legendText"></span></p>
                </div>
                <div class="legendBlock">
                  <div class="orangeSquare"></div>
                  <p class="card-text"><span v-lang.dayReserved class="legendText"></span></p>
                </div>
              </div>

              <div class="infoText">
                <p class="card-text"> <span v-lang.bookingCalendarInfoText3></span></p>
              </div>

              <toggle-button v-if="language == 'en'" class="toggleDayNight" v-model="dayPeriodToggle" :sync="true" @change="changeDayPeriod" :labels="{checked: 'Night', unchecked: 'Day'}" :width="150" :height="40" :color="{checked: '#8398ea', unchecked: '#82C7EB'}"/>
              <toggle-button v-if="language == 'tr'" class="toggleDayNight" v-model="dayPeriodToggle" :sync="true" @change="changeDayPeriod" :labels="{checked: 'Gece', unchecked: 'Gündüz'}" :width="150" :height="40" :color="{checked: '#8398ea', unchecked: '#82C7EB'}"/>

              <b-row>
                <b-col class="p-0">
                  <div class="form-group">
                    <label style="display: block;"><span v-lang.timeStart></span></label>
                    <div class="input-group">
                      <span class="input-group-addon mt3"><i class="fa fa-2x fa-clock-o iconColor"></i></span>
                      <vue-timepicker class="timepickerCustom" v-model="timeStart" style="margin-bottom: 10px"></vue-timepicker>
                    </div>
                  </div>
                </b-col>
                <b-col class="p-0">
                  <div class="form-group">
                    <label style="display: block;"><span v-lang.timeEnd></span></label>
                    <div class="input-group">
                      <span class="input-group-addon mt3"><i class="fa fa-2x fa-clock-o iconColor"></i></span>
                      <vue-timepicker class="timepickerCustom" v-model="timeEnd" style="margin-bottom: 10px"></vue-timepicker>
                    </div>
                  </div>
                </b-col>
              </b-row>

              <div class="form-group" v-if="properties">
                <label><span v-lang.propertySelect></span></label>
                <div class="input-group">
                  <span class="input-group-addon mt3"><i class="fa fa-2x fa-building iconColor"></i></span>
                  <b-form-select v-model="currentPropertyId" :options="propertiesFormatted" @input="propertyChanged()">
                  </b-form-select>
                </div>
              </div>

              <div class="form-group">
                <label><span v-lang.totalGuests></span></label>
                <div class="input-group">
                  <span class="input-group-addon mt3"><i class="fa fa-2x fa-users iconColor"></i></span>
                  <input type="number" class="form-control" v-model="totalGuests" :placeholder="labelTotalGuests" @blur="totalGuestOnBlur">
                </div>
              </div>

              <div class="form-group">
                <label for="bookingNotes"><span v-lang.notes></span></label>
                <div class="input-group">
                  <span class="input-group-addon mt3"><i class="fa fa-2x fa-edit iconColor"></i></span>
                  <textarea rows="5" class="form-control lightBorders" v-model.trim="notes" id="bookingNotes" :placeholder="labelNotes"></textarea>
                </div>
              </div>

              <div class="input-group" style="margin-bottom: 12px" v-if="isDaySelected && !isEditingExistingBooking && !isReserved">
                <div class="input-group-prepend">
                  <div class="input-group-text"> <i class="fa fa-calendar-check-o"></i> </div>
                </div>
                <input type="number" class="form-control" :class="{'is-invalid': showErrorValidityDays}" v-model.trim="offerValidityDays" :placeholder="labelDaysExpiration" @input="errorValidityReset">
                <span class="input-group-btn">
                  <button class="btn btn-info white" type="button" @click="reserveDateBookingTab()">
                    <i v-if="!showSpinnerReserveDate" class="fa fa-calendar-day buttonIcon"></i>
                    <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerReserveDate"></icon>
                    <span v-lang.reserveDate></span>
                  </button>
                </span>
              </div>

              <p class="card-text bookingText"> <span class="text-success"> <span v-lang.selectedDate></span>:</span> <span class="mediumGray" v-if="isDaySelected"> {{formattedDate}} </span></p>

              <!--Fixed lang bug - don't change-->
              <div class="bookingInfoText">
                <p class="card-text bookingText500" v-if="dayPeriod === 'day' && language === 'en' && !hasDiscount"> <span class="text-success"> Day price:</span> <span v-if="currentPrice" class="mediumGray"> {{currentPrice | numberFormat}} </span></p>
                <p class="card-text bookingText500" v-if="dayPeriod === 'day' && language === 'en' && hasDiscount"> <span class="text-success"> Day price:</span> <span v-if="currentPrice" class="mediumGray lineThrough"> {{currentPrice | numberFormat}} </span><span class="mediumGray"> {{newPrice | numberFormat}} </span></p>
                <p class="card-text bookingText500" v-if="dayPeriod === 'night' && language === 'en' && !hasDiscount"> <span class="text-success"> Night price:</span> <span v-if="currentPrice" class="mediumGray"> {{currentPrice | numberFormat}} </span></p>
                <p class="card-text bookingText500" v-if="dayPeriod === 'night' && language === 'en' && hasDiscount"> <span class="text-success"> Night price:</span> <span v-if="currentPrice" class="mediumGray lineThrough"> {{currentPrice | numberFormat}} </span><span class="mediumGray"> {{newPrice | numberFormat}} </span></p>

                <p class="card-text bookingText500" v-if="dayPeriod === 'day' && language === 'tr' && !hasDiscount"> <span class="text-success"> Günlük Fiyat:</span> <span v-if="currentPrice" class="mediumGray"> {{currentPrice | numberFormat}} </span></p>
                <p class="card-text bookingText500" v-if="dayPeriod === 'day' && language === 'tr' && hasDiscount"> <span class="text-success"> Günlük Fiyat:</span> <span class="mediumGray lineThrough"> {{currentPrice | numberFormat}} </span> <span class="mediumGray"> {{newPrice | numberFormat}} </span></p>
                <p class="card-text bookingText500" v-if="dayPeriod === 'night' && language === 'tr' && !hasDiscount"> <span class="text-success"> Gece Fiyatı:</span> <span v-if="currentPrice" class="mediumGray"> {{currentPrice | numberFormat}} </span></p>
                <p class="card-text bookingText500" v-if="dayPeriod === 'night' && language === 'tr' && hasDiscount"> <span class="text-success"> Gece Fiyatı:</span> <span v-if="currentPrice" class="mediumGray" :class="{'lineThrough': newPrice < currentPrice}"> {{currentPrice | numberFormat}} </span><span class="mediumGray" v-if="newPrice < currentPrice"> {{newPrice | numberFormat}} </span></p>

                <h4 v-if="isBusy && dayPeriod === 'day'"><span class="badge badge-warning"><span v-lang.dayBusy></span></span></h4>
                <h4 v-if="isBusy && dayPeriod === 'night'"><span class="badge badge-warning"><span v-lang.nightBusy></span></span></h4>
                <h4 v-if="isReserved && reservationClientId !== clientId && language == 'tr'"><span class="badge badge-warning">Opsiyonu</span></h4>
                <h4 v-if="isReserved && reservationClientId !== clientId && language == 'en'"><span class="badge badge-warning">Day Reserved</span></h4>

                <p class="card-text bookingText" v-if="isReserved"> <span class="text-success"> <span v-lang.client></span>:</span> <span class="mediumGray"> {{reservationClientName}} </span></p>

                <p class="card-text bookingText" v-if="hasDiscount"> <span class="text-success"> <span v-lang.discount></span>:</span> <span v-if="currentPrice" class="mediumGray"> {{totalDiscount | numberFormat}} </span></p>
              </div>


              <div class="jumbotron jumbotron-fluid discountInfoBox" v-if="showBookingTabInputs && isDaySelected">
                <div class="container">
                <span class="bookingTabInfo">
                  <i class="fa fa-info-circle bookingTabInfoIcon"></i>
                  <span v-lang.discountInfo class="bookingTabInfoText"></span>
                </span>
                </div>
              </div>

              <div class="input-group mb5" v-if="showBookingTabInputs && isDaySelected">
                <div class="input-group-prepend">
                  <div class="input-group-text"> ₺ </div>
                </div>
                <input type="number" class="form-control lightBordersFull" :class="{'is-invalid': discountTooMuch}" v-model.trim="totalDiscount" :placeholder="labelDiscount" :aria-label="labelDiscount" aria-describedby="basic-addon1">
                <span class="input-group-btn">
                  <button class="btn btn-success white" type="button" @click="makeDiscount('amount')"><span v-lang.applyDiscount></span></button>
                </span>
              </div>

              <div class="input-group" v-if="showBookingTabInputs && isDaySelected">
                <div class="input-group-prepend">
                  <div class="input-group-text"> % </div>
                </div>
                <input type="number" class="form-control lightBordersFull" :class="{'is-invalid': discountTooMuchPercentage}" v-model.trim="totalDiscountPercentage" :placeholder="labelDiscount" :aria-label="labelDiscount" aria-describedby="basic-addon1">
                <span class="input-group-btn">
                  <button class="btn btn-success white" type="button" @click="makeDiscount('percentage')"><span v-lang.applyDiscount></span></button>
                </span>
              </div>

              <div class="errorDiv crimson" v-if="discountTooMuch">
                <p><span v-lang.discountMustBeLessThan></span> {{ maxDiscount | numberFormat }}</p>
              </div>

              <div class="errorDiv crimson" v-if="discountTooMuchPercentage">
                <p>
                  <span v-lang.discountMustBeLessThan></span>
                  <span v-if="user.role === 'manager'">{{ user.max_discount }}%</span>
                </p>
              </div>

              <span class="bookingInfoText" v-if="showBookingTabInputs && isDaySelected">
                <p class="card-text bookingText500" style="margin-top: 13px;"> <span class="text-success" v-lang.totalExtras></span>: <span class="mediumGray"> {{ totalCostServices | numberFormat }}</span>  </p>
                <p class="card-text bookingText500"> <span class="text-success" v-lang.finalPrice></span>: <span class="mediumGray">{{ totalCost | numberFormat }}</span> </p>
              </span>

            </div>

          </div>

        </b-card>
      </tab-content>

      <tab-content :title="brideGroom" icon="fa fa-heart" :before-change="validateTabBrideGroomData">

        <b-card>
          <div slot="header">
            <span class="card-text text-success bookingTabTitle"><span v-lang.groomBrideInfo></span></span>
          </div>

          <h3 class="card-text text-success"><span v-lang.groomInfo></span></h3>


          <div class="form-group">
            <label for="groomName"><span v-lang.fullName></span></label>
            <div class="input-group">
              <span class="input-group-addon mt3"><i class="fa fa-2x fa-user iconColor"></i></span>
              <input type="text" class="form-control" :class="{'is-invalid': $v.groomFullName.$error}" id="groomName" :placeholder="labelFullName" v-model="groomFullName" @input="$v.groomFullName.$touch()">
            </div>
            <div class="invalid-feedback" v-if="!$v.groomFullName.required && groomBrideDataSubmitted">
              <span v-lang.nameRequired></span>
            </div>
          </div>

          <div class="form-group">
            <label for="groomRegion"><span v-lang.region></span></label>
            <div class="input-group">
              <span class="input-group-addon mt3"><i class="fa fa-2x fa-map-marker-alt iconColor"></i></span>
              <input type="text" class="form-control" id="groomRegion" :placeholder="labelRegion" v-model="groomRegion">
            </div>
          </div>

          <div class="form-group">
            <label for="groomPhone"><span v-lang.phone></span></label>
            <div class="input-group">
              <span class="input-group-addon mt3"><i class="fa fa-2x fa-phone iconColor"></i></span>
              <input class="form-control" type="tel" v-mask="'(###) ### ## ##'" :placeholder="'(###) ### ## ##'" id="groomPhone" v-model="groomPhone">
            </div>
          </div>

          <div class="form-group">
            <label for="groomEmail"><span v-lang.email></span></label>
            <div class="input-group">
              <span class="input-group-addon mt3"><i class="fa fa-2x fa-envelope iconColor"></i></span>
              <input class="form-control" type="email" :placeholder="labelEmail" id="groomEmail" v-model="groomEmail">
            </div>
          </div>

          <h3 class="card-text text-success"><span v-lang.brideInfo></span></h3>

          <div class="form-group">
            <label for="brideName"><span v-lang.fullName></span></label>
            <div class="input-group">
              <span class="input-group-addon mt3"><i class="fa fa-2x fa-user iconColor"></i></span>
              <input type="text" class="form-control" :class="{'is-invalid': $v.brideFullName.$error}" id="brideName" :placeholder="labelFullName" v-model="brideFullName" @input="$v.brideFullName.$touch()">
            </div>
            <div class="invalid-feedback" v-if="!$v.brideFullName.required && groomBrideDataSubmitted">
              <span v-lang.nameRequired></span>
            </div>
          </div>

          <div class="form-group">
            <label for="brideRegion"><span v-lang.region></span></label>
            <div class="input-group">
              <span class="input-group-addon mt3"><i class="fa fa-2x fa-map-marker-alt iconColor"></i></span>
              <input type="text" class="form-control" id="brideRegion" :placeholder="labelRegion" v-model="brideRegion">
            </div>
          </div>

          <div class="form-group">
            <label for="bridePhone"><span v-lang.phone></span></label>
            <div class="input-group">
              <span class="input-group-addon mt3"><i class="fa fa-2x fa-phone iconColor"></i></span>
              <input class="form-control" type="tel" v-mask="'(###) ### ## ##'" :placeholder="'(###) ### ## ##'" id="bridePhone" v-model="bridePhone">
            </div>
          </div>

          <div class="form-group">
            <label for="brideEmail"><span v-lang.email></span></label>
            <div class="input-group">
              <span class="input-group-addon mt3"><i class="fa fa-2x fa-envelope iconColor"></i></span>
              <input class="form-control" type="email" :placeholder="labelEmail" id="brideEmail" v-model="brideEmail">
            </div>
          </div>

        </b-card>

      </tab-content>

      <tab-content :title="payment" icon="fa fa-money" :before-change="validateTabPayment" v-if="!isEditingExistingBooking">

        <b-card>
          <div slot="header">
            <span class="card-text text-success bookingTabTitle"><span v-lang.additionalInfo></span></span>
          </div>

          <div class="row">

            <div class="col-md-12">
              <p class="card-text bookingText200"> <i class="fa fa-money"></i> <span v-lang.finalPrice></span>: {{ totalCost | numberFormat }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-money"></i> <span v-lang.advance></span>: {{ advance | numberFormat }} </p>
              <p class="card-text bookingText200" v-if="totalCost > advance"> <i class="fa fa-money"></i> <span v-lang.totalDue></span>: {{ totalCost - advance | numberFormat }} </p>
              <!--If the advance enter is bigger than the cost - then just 0 as remnaint (to avoid to show a negative number)-->
              <p class="card-text bookingText200" v-if="totalCost <= advance"> <i class="fa fa-money"></i> <span v-lang.totalDue></span>: ₺0,00 </p>

              <div class="form-group">
                <label for="advance"><span v-lang.advance></span></label>
                <div class="input-group">
                  <span class="input-group-addon mt3"><i class="fa fa-2x fa-money iconColor"></i></span>
                  <input type="number" class="form-control" id="advance" :placeholder="labelAdvance" v-model="advance" @blur="checkAdvance">
                </div>
                <small class="form-text text-muted"><span v-lang.minimumDepositForProperty></span> {{ minimumDeposit | numberFormat }} </small>
                <div class="invalid-feedback" v-if="!$v.advance.required && advanceDataSubmitted">
                  <span v-lang.advanceRequired></span>
                </div>
              </div>

              <div>
                <label for="contract"><span v-lang.contract></span></label>
                <v-select id="contract" placeholder="Select a contract" v-model="selectedContract" :options="contractListFormatted" @input="contractSelected"></v-select>
              </div>

              <div class="form-group mt20">
                <label for="paymentNotes"><span v-lang.paymentNotes></span></label>
                <div class="input-group">
                  <span class="input-group-addon mt3"><i class="fa fa-2x fa-edit iconColor"></i></span>
                  <textarea rows="5" class="form-control lightBorders" v-model.trim="paymentNotes" id="paymentNotes" :placeholder="labelPaymentNotes"></textarea>
                </div>
              </div>

            </div>

          </div>

        </b-card>

      </tab-content>

      <tab-content :title="confirmBooking" icon="fa fa-check-circle" :before-change="validateTabConfirmation">

        <b-card>
          <div slot="header">
            <span class="card-text text-success bookingTabTitle"><span v-lang.confirmationTab></span></span>
          </div>

          <div class="row">

            <div class="col-md-6">

              <h3 class="card-text text-success"><span v-lang.bookingData></span></h3>

              <p class="card-text bookingText200"> <i class="fa fa-building"></i> <span v-lang.property></span>: {{ currentProperty.name }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-users"></i> <span v-lang.totalGuests></span>: {{ totalGuests }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-calendar"></i> <span v-lang.date></span>: {{ formattedDate }} {{ timeStart.HH }}:{{ timeStart.mm }} - {{ timeEnd.HH }}:{{ timeEnd.mm }}</p>
              <p class="card-text bookingText200"> <i class="fa fa-money"></i> <span v-lang.propertyRentPrice></span>: {{ currentPrice | numberFormat }} </p>
              <p class="card-text bookingText200">
                <span class="fa-stack" style="font-size: 0.8rem;">
                  <i class="fa fa-certificate fa-stack-2x"></i>
                  <i class="fa fa-tag fa-stack-1x fa-inverse"></i>
                </span>
                <span v-lang.discount></span>: {{ totalDiscount | numberFormat }}
              </p>
              <h3 class="card-text text-success"><span v-lang.groomInfo></span></h3>
              <p class="card-text bookingText200"> <i class="fa fa-user"></i> <span v-lang.fullName></span>: {{ groomFullName }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-phone-square"></i> <span v-lang.phone></span>: {{ groomPhone }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-envelope"></i> <span v-lang.email></span>: {{ groomEmail }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-map"></i> <span v-lang.region></span>: {{ groomRegion }} </p>
              <h3 class="card-text text-success"><span v-lang.brideInfo></span></h3>
              <p class="card-text bookingText200"> <i class="fa fa-user"></i> <span v-lang.fullName></span>: {{ brideFullName }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-phone-square"></i> <span v-lang.phone></span>: {{ bridePhone }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-envelope"></i> <span v-lang.email></span>: {{ brideEmail }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-map"></i> <span v-lang.region></span>: {{ brideRegion }} </p>

            </div>

            <div class="col-md-6">

              <h3 class="card-text text-success"><span v-lang.services></span></h3>
              <p class="card-text bookingText200"  v-for="service in addedServices" :key="service.id">

                <!--FIXED SERVICES-->
                <span v-if="service.type === 'fixed'"> {{ service.name }} - {{ service.cost | numberFormat }} </span>

                <!--FLEXIBLE DEFAULT SERVICES-->
                <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 100 && !isEditingExistingBooking" >
                  {{ service.name }} - {{ service.cost1 | numberFormat }} (<span v-lang.total></span>: {{ service.cost1 | numberFormat }} * {{ totalGuests }} = {{ service.cost1 * totalGuests | numberFormat }})
                </span>
                <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 250 && totalGuests > 100 && !isEditingExistingBooking" >
                  {{ service.name }} - {{ service.cost2 | numberFormat }} (<span v-lang.total></span>: {{ service.cost2 | numberFormat }} * {{ totalGuests }} = {{ service.cost2 * totalGuests | numberFormat }})
                </span>
                <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests <= 500 && totalGuests > 250 && !isEditingExistingBooking" >
                  {{ service.name }} - {{ service.cost3 | numberFormat }} (<span v-lang.total></span>: {{ service.cost3 | numberFormat }} * {{ totalGuests }} = {{ service.cost3 * totalGuests | numberFormat }})
                </span>
                <span v-if="service.type === 'flexible' && service.range_type === 'default' && totalGuests > 500 && !isEditingExistingBooking" >
                  {{ service.name }} - {{ service.cost4 | numberFormat }} (<span v-lang.total></span>: {{ service.cost4 | numberFormat }} * {{ totalGuests }} = {{ service.cost4 * totalGuests | numberFormat }})
                </span>
                <span v-if="service.type === 'flexible' && service.range_type === 'default' && isEditingExistingBooking" >
                  {{ service.name }} - {{ service.cost | numberFormat }} (<span v-lang.total></span>: {{ service.cost | numberFormat }} * {{ totalGuests }} = {{ service.cost * totalGuests | numberFormat }})
                </span>

                <!--FLEXIBLE CUSTOM SERVICES-->
                <span v-if="service.type === 'flexible' && service.range_type === 'custom'">
                  {{ service.name }} -
                  <span v-for="(rangeData, index) in service.range_costs" :key="index">
                    <span v-if="totalGuests >= rangeData.min && totalGuests <= rangeData.max">
                      {{ rangeData.cost | numberFormat }}
                      (<span v-lang.total></span>: {{ rangeData.cost | numberFormat }} * {{ totalGuests }} = {{ rangeData.cost * totalGuests | numberFormat }} )
                    </span>
                  </span>
                  <span v-if="totalGuests > service.range_costs[service.range_costs.length - 1].max">
                    {{ service.range_costs[service.range_costs.length - 1].cost | numberFormat }}
                    (<span v-lang.total></span>: {{ service.range_costs[service.range_costs.length - 1].cost | numberFormat }} * {{ totalGuests }} = {{ service.range_costs[service.range_costs.length - 1].cost * totalGuests | numberFormat }} )
                  </span>
                </span>
              </p>
              <p class="card-text bookingText200" v-if="addedServices.length === 0"> <span v-lang.noServices></span> </p>
              <p class="card-text bookingText200"> <i class="fa fa-money"></i> <span v-lang.totalExtras></span>: {{ totalCostServices | numberFormat }} </p>

              <h3 class="card-text text-success"><span v-lang.notes></span></h3>
              <p class="card-text bookingText200" v-if="notes !== ''"> {{ notes }} </p>
              <p class="card-text bookingText200" v-if="notes === ''"> <span v-lang.noNotes></span> </p>

              <h3 class="card-text text-success"><span v-lang.cost></span></h3>

              <p class="card-text bookingText200"> <i class="fa fa-money"></i> <span v-lang.finalPrice></span>: {{ totalCost | numberFormat }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-money"></i> <span v-lang.advance></span>: {{ advance | numberFormat }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-money"></i> <span v-lang.totalDue></span>: {{ totalCost - advance | numberFormat }} </p>
              <p class="card-text bookingText200"> <i class="fa fa-edit"></i> <span v-lang.paymentNotes></span>:
                <span v-if="paymentNotes !== ''">{{ paymentNotes }} </span>
                <span v-if="paymentNotes === ''"><span v-lang.noNotes></span></span>
              </p>
            </div>

          </div>

        </b-card>

      </tab-content>

    </form-wizard>

    <b-modal ref="clientHasReservationModal" class="modal-info">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.dayReserved></span></h5>
      </template>
      <span v-lang.alertClienHasReservation></span> {{ clientReservedDate }}

      <template slot="modal-footer">
        <b-btn variant="default" @click="clientReservationModalClick('CANCEL')">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="success" @click="clientReservationModalClick('CONTINUE')">
          <span v-lang.proceedWithBooking></span>
        </b-btn>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import router from '../router'
  import Calendar from '../components/Calendar.vue'
  import { required, email } from 'vuelidate/lib/validators'
  import Icon from 'vue-awesome/components/Icon'
  import store from '../vuex/store'
  import {FormWizard, TabContent} from 'vue-form-wizard'
  import 'vue-form-wizard/dist/vue-form-wizard.min.css'
  import VueTimepicker from 'vue2-timepicker'
  import { VTooltip } from 'v-tooltip'
  import moment from 'moment'
  import pdfMake from 'pdfmake/build/pdfmake'
  import pdfFonts from 'pdfmake/build/vfs_fonts'
  import { mask } from 'vue-the-mask'
  import vSelect from 'vue-select'

  import WrittenNumber from 'written-number'
  import { labels } from '../mixins/labels'
  import { updateBookingLists } from '../mixins/updateBookingLists'
  import { setupDefaultPrices } from '../mixins/setupDefaultPrices'
  import { savePropertiesInStorage } from '../mixins/savePropertiesInStorage'
  import { initReservations } from '../mixins/initReservations'
  import { createContractPdf } from '../mixins/createContractPdf'
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  VTooltip.options.defaultTemplate =
    '<div class="tooltipCustom" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'

  export default {
    components: { Calendar, Icon, FormWizard, TabContent, VueTimepicker, 'v-select': vSelect },
    directives: { tooltip: VTooltip, mask },
    router: router,
    mixins: [labels, updateBookingLists, setupDefaultPrices, savePropertiesInStorage, initReservations, createContractPdf],
    data() {
      return {
        disabled: [],
        clear: true,
        value: '',
        date: '',
        events: [],
        format: 'yyyy-MM-dd',
        isBusy: false,
        isActive: true,
        showDiscount: false,
        hasDiscount: false,
        totalDiscount: 0,
        discountTooMuch: false,
        totalDiscountPercentage: 0,
        discountTooMuchPercentage: false,
        maxDiscount: 0,
        newPrice: 0,
        toggleDisabled: false,
        dayPeriod: 'day',
        daysSelected: [],
        currentPrice: null,
        groomFullName: '',
        groomPhone: '',
        groomRegion: '',
        groomEmail: '',
        brideFullName: '',
        bridePhone: '',
        brideRegion: '',
        brideEmail: '',
        showSpinner: false,
        showSpinnerReserveDate: false,
        showSpinnerServiceEdit: false,
        showSpinnerServiceUpdatedSuccess: false,
        formSubmitted: false,
        dateLong: '',
        totalGuests: 50,
        addedServices: [],
        totalCost: 0,
        serviceSelected: '',
        showServiceInfo: false,
        wizardTitle: '',
        isDaySelected: false,
        customerDataSubmitted: false,
        groomBrideDataSubmitted: false,
        advanceDataSubmitted: false,
        currentProperty: {},
        currentPropertyId: '',
        propertiesFormatted: [],
        currentService: {},
        serviceListScoped: [],
        contractBase64: {},
        timeStart: {
          HH: '15',
          mm: '00',
        },
        timeEnd: {
          HH: '20',
          mm: '00'
        },
        notes: '',
        paymentNotes: '',
        clientFullName: '',
        clientPhone: '',
        clientEmail: '',
        totalCostServices: 0,
        advance: 0,
        isServiceEdit: false,
        currentServiceToEdit: {},
        clientId: 0,
        pricesArray: [],
        lowSeasonArray: [],
        highSeasonArray: [],
        currentMonthSeason: '',
        currentMonth: '',
        defaultPricesData: {},
        tooltipInfoArray: [],
        labelDiscount: '',
        showAlertService: false,
        alertServicesArray: [],
        daysBusy: [],
        daysReserved: [],
        showOfferList: false,
        offerList: [],
        activeOrderOffer: 'date',
        selectedOffer: {},
        contractHeader: '',
        invoiceImageBase64: '',
        isSecondTab: false,
        stepIndex: 0,
        isReserved: false,
        selectedClient: null,
        selectedContract: null,
        useContract: false,
        clientListFormatted: [],
        contractListFormatted: [],
        saveNewClient: true,
        clientReservedDate: '',
        clientReservation: {},
        clientHasReservation: false,
        reservationClientName: '',
        reservationClientId: '',
        showBookingTabInputs: false,
        offerValidityDays: '',
        showErrorValidityDays: false,
        isPreviousReservasion: false,
        reservationId: -1,
        isEditingExistingBooking: false,
        currentMonthOffer: moment().year('M'),
        currentYearOffer: moment().year(),
        currentMonthBooking: moment().year('M'),
        currentYearBooking: moment().year(),
        yearCurrent: '',
        yearNext: '',
        dayPeriodToggle: false, // false == day
        minimumDeposit: 0,
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      bookings() {
        return store.getters.getBookings
      },
      contracts() {
        return store.getters.getContracts
      },
      bookingListIndexed() {
        return store.getters.getBookingListIndexed
      },
      customerData() {
        if (this.$language === 'en') {
          return 'Customer Info'
        } else if (this.$language === 'tr') {
          return 'Müşteri Bilgisi'
        }
      },
      chooseProperty() {
        if (this.$language === 'en') {
          return 'Choose the property'
        } else if (this.$language === 'tr') {
          return 'Salon Seçin'
        }
      },
      confirmBooking() {
        if (this.$language === 'en') {
          return 'Confirm booking'
        } else if (this.$language === 'tr') {
          return 'Rezervasyonu onaylama'
        }
      },
      prepareOffer() {
        if (this.$language === 'en') {
          return 'Prepare Offer'
        } else if (this.$language === 'tr') {
          return 'Teklif Hazırla'
        }
      },
      brideGroom() {
        if (this.$language === 'en') {
          return 'Bride & Groom'
        } else if (this.$language === 'tr') {
          return 'Gelin & Damat'
        }
      },
      makeBooking() {
        if (this.$language === 'en') {
          return 'Make booking'
        } else if (this.$language === 'tr') {
          return 'Rezervasyon'
        }
      },
      payment() {
        if (this.$language === 'en') {
          return 'Payment'
        } else if (this.$language === 'tr') {
          return 'Ödeme'
        }
      },
      serviceList () {
        return store.getters.getServices
      },
      pricesListFull () {
        return store.getters.getPricesList
      },
      user() {
        return store.getters.getUser
      },
      properties () {
        if (this.user.role === 'manager') {
          return store.getters.getPropertiesManager
        } else {
          return store.getters.getProperties
        }
      },
      formattedDate() {
        return moment(this.date).format('DD-MM-YYYY')
      },
      reservations() {
        return store.getters.getReservations
      },
      notifications() {
        return store.getters.getNotifications
      },
      clients() {
        return store.getters.getClients
      },
      currentBooking() {
        return store.state.currentBooking
      },
    },
    validations: {
      groomFullName: {
        required
      },
      brideFullName: {
        required
      },
      totalGuests: {
        required
      },
      clientFullName: {
        required
      },
      clientPhone: {
        required
      },
      clientEmail: {
        required, email
      },
      advance: {
        required
      },
    },
    created() {
      this.$language = this.language
      this.wizardTitle = 'Choose the Date'
      this.isEditingExistingBooking = this.$route.params.editing
      this.addedServices = []

      this.initAlertMessages()
      this.initDates()
      this.initPropertiesFormatted()
      this.initServices()
      this.initClients()
      this.initContracts()
      this.getImages()
    },
    mounted() {
      // Inside mounted because only now the $refs is ready to be used
      this.routeParamsCheck()
    },
    methods: {
      initDates() {
        this.yearCurrent = moment().year()
        this.nextYear = moment().add(1, 'years').year()
      },
      getImages() {
        this.$http.get(this.appApiPath + '/download_images')
          .then(response => {
            this.contractHeader = 'data:image/png;base64,' + response.body.logo
            this.invoiceImageBase64 = 'data:image/png;base64,' + response.body.floral
          }, response => {
            console.log('api error download_images')
            console.log(response)
          })
      },
      clientReservationModalClick(action) {
        if (action === 'CONTINUE') {
          this.$refs.wizard.changeTab(1, 2)
          this.initReservation(this.clientReservation)
        }
        this.$refs.clientHasReservationModal.hide()
      },
      checkAdvance() {
        // timeout 200 in order to give priority to the validateFifth method 
        // (in order to handle collision between blur event from advance input and button click for next tab)
        setTimeout(() => {
          if (this.advance > this.totalCost) {
            if (this.language === 'en') {
              this.$toasted.show('The advance cannot be higher than the total cost. Please enter a different amount.', {icon: 'fa-exclamation-triangle', type: 'error'})
            } else if (this.language === 'tr') {
              this.$toasted.show('Kalan miktar, borçtan fazla olamaz', {icon: 'fa-exclamation-triangle', type: 'error'})
            }
            this.advance = this.minimumDeposit
          }
          if (this.advance < this.minimumDeposit) {
            if (this.language === 'en') {
              this.$toasted.show(`The advance cannot be less than ${this.minimumDeposit}`, {icon: 'fa-exclamation-triangle', type: 'error'})
            } else if (this.language === 'tr') {
              this.$toasted.show(`Kalan miktar, ${this.minimumDeposit} daha az olamaz`, {icon: 'fa-exclamation-triangle', type: 'error'})
            }
            this.advance = this.minimumDeposit
          }
        }, 200)
      },
      clientSelected(client) {
        if (client === null) {
          this.saveNewClient = true
          this.clientFullName = null
          this.clientPhone = null
          this.clientEmail = null
        } else {
          this.saveNewClient = false
          this.clientId = client.value
          for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id === this.clientId) {
              this.clientFullName = this.clients[i].full_name
              this.clientPhone = this.clients[i].phone
              this.clientEmail = this.clients[i].email
            }
          }
        }
      },
      contractSelected(contract) {
        if (contract.value !== 0) {
          this.useContract = true
        } else {
          this.useContract = false
        }
      },
      routeParamsCheck() {
        let continueReservation = this.$route.params.continueReservation
        if (continueReservation) {
          let reservation = this.$route.params.reservation
          this.initReservation(reservation)
          this.$refs.wizard.changeTab(0, 2)
        }
        if (this.isEditingExistingBooking) {
          this.date = this.currentBooking.date
          // this.updatePrices()

          // Client data
          this.selectedClient = this.clientListFormatted.find(item => item.value === this.currentBooking.client.id)
          this.clientSelected(this.selectedClient)
          // Date
          const year = moment(this.currentBooking.date).year()
          const month = moment(this.currentBooking.date).month()
          const day = moment(this.currentBooking.date).date()
          const fullDate = new Date(year, month, day)
          
          this.$refs.wizardBooking.setSingleDateAndUpdate(fullDate)
          // Move calendar to booking month
          this.$refs.wizardBooking.monthSelect(year, month)

          // Property data
          this.currentPropertyId = this.currentBooking.property.id
          // Booking data
          this.dayPeriod = this.currentBooking.type
          if (this.dayPeriod === 'day') {
            this.dayPeriodToggle = false
          } else if (this.dayPeriod === 'night') {
            this.dayPeriodToggle = true
          }
          this.totalGuests = this.currentBooking.total_guests
          this.notes = this.currentBooking.notes
          this.timeStart.HH = this.currentBooking.hour_start
          this.timeStart.mm = this.currentBooking.minute_start
          this.timeEnd.HH = this.currentBooking.hour_end
          this.timeEnd.mm = this.currentBooking.minute_end
          // Services
          this.currentBooking.services.forEach(item => {
            const service = this.serviceListScoped.find(serviceScoped => serviceScoped.id === item.service_id)
            service.cost = item.cost
            this.selectService(service)
          })
          // Groom & Bride
          this.groomFullName = this.currentBooking.groom_fullname
          this.groomPhone = this.currentBooking.groom_phone
          this.groomRegion = this.currentBooking.groom_region
          this.groomEmail = this.currentBooking.groom_email
          this.brideFullName = this.currentBooking.bride_fullname
          this.bridePhone = this.currentBooking.bride_phone
          this.brideRegion = this.currentBooking.bride_region
          this.brideEmail = this.currentBooking.bride_email
          // Payment data
          this.advance = this.currentBooking.advance
          this.totalCost = this.currentBooking.total_cost
          this.checkAdvance()

          // Setup discount and booking price from db fields
          if (this.currentBooking.booking_discount > 0) {
            this.totalDiscount = this.currentBooking.booking_discount
            this.currentPrice = this.currentBooking.booking_original_price
            this.hasDiscount = true
            this.newPrice = this.currentBooking.price
          }
          
          // setTimeout(() => {
          //   if (this.currentPrice !== this.currentBooking.price) {
          //     this.totalDiscount = this.currentPrice - this.currentBooking.price
          //     this.makeDiscount('amount')
          //   }
          // }, 800)
        }
      },
      initReservation(reservation) {
        this.reservationId = reservation.id

        // Load client data
        this.clientFullName = reservation.client.full_name
        this.clientPhone = reservation.client.phone
        this.clientEmail = reservation.client.email
        this.clientId = reservation.client_id

        // Load date
        this.dayPeriod = reservation.day_period
        if (this.dayPeriod === 'day') {
          this.dayPeriodToggle = false
        } else if (this.dayPeriod === 'night') {
          this.dayPeriodToggle = true
        }
        this.getDaysReserved()
        this.date = reservation.date
        let dateFull = moment(reservation.date).toDate()

        // move calendar to reservation month and year
        const year = moment(reservation.date).year()
        const month = moment(reservation.date).month()
        this.$refs.wizardBooking.monthSelect(year, month)

        // Load booking data
        this.totalGuests = reservation.total_guests
        this.timeStart.HH = reservation.hour_start
        this.timeStart.mm = reservation.minute_start
        this.timeEnd.HH = reservation.hour_end
        this.timeEnd.mm = reservation.minute_end
        this.notes = reservation.notes
        
        for (let i = 0; i < this.properties.length; i++) {
          if (this.properties[i].id === this.propertiesFormatted[0].value && !this.isEditingExistingBooking) {
            this.currentProperty = {...this.properties[i]}
          } else if (this.isEditingExistingBooking && this.properties[i].id === this.currentBooking.property.id) {
            this.currentProperty = {...this.properties[i]}
          }
        }
        this.currentPropertyId = reservation.property.id

        this.$refs.wizardBooking.setSingleDateAndUpdate(dateFull)
        this.isPreviousReservasion = true
        this.onDayClickBookingTab(dateFull, this.date)
      },
      initPropertiesFormatted() {
        let finalArray = []
        for (let i = 0; i < this.properties.length; i++) {
          // Add property to list only if manager has access to it
          let hasPermission = false
          if (this.user.role === 'manager') {
            for (let j = 0; j < this.properties[i].managers_ids.length; j++) {
              let managerId = this.properties[i].managers_ids[j].user_id
              if (managerId === this.user.id) {
                hasPermission = true
              }
            }
          } else if (this.user.role === 'admin') {
            // If is admin has permission to all properties
            hasPermission = true
          }
          if (hasPermission) {
            let property = {}
            property.value = this.properties[i].id
            property.text = this.properties[i].name
            finalArray.push(property)
          }
        }

        this.propertiesFormatted = finalArray.map(item => ({...item}))

        if (this.propertiesFormatted.length > 0) {
          // Assign current property to the first property in the formatted list
          // Need to take the full data from the property list
          for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].id === this.propertiesFormatted[0].value && !this.isEditingExistingBooking) {
              this.currentProperty = {...this.properties[i]}
            } else if (this.isEditingExistingBooking && this.properties[i].id === this.currentBooking.property.id) {
              this.currentProperty = {...this.properties[i]}
            }
          }

          this.currentPropertyId = this.currentProperty.id

          this.updateSeasons()
          this.setupDefaultPrices(this.currentProperty)

          this.pricesArray = {...this.pricesListFull[this.currentProperty.id]}

          this.getDaysBusy()
          this.getDaysReserved()
        }
      },
      initAlertMessages() {
        let isAlert = this.$route.params.isAlert
        let alertType = this.$route.params.alertType

        if (isAlert) {
          if (alertType === 'booking-update-success') {
            let alertEditSuccess = {
              title: 'Success',
              message: 'The Booking has been succesfully updated',
              type: 'success',
              onClose: this.onClose
            }
            this.$refs.bookingEditSuccess.openSimplert(alertEditSuccess)
          }

          if (alertType === 'booking-update-error') {
            let alertEditError = {
              title: 'Oops',
              message: 'Something went wrong while trying to update the booking',
              type: 'warning',
              onClose: this.onClose
            }
            this.$refs.bookingEditError.openSimplert(alertEditError)
          }
        }
      },
      initServices() {
        this.serviceListScoped = []
        for (let i = 0; i < this.serviceList.length; i++) {
          let service = {...this.serviceList[i]}
          service.active = false
          service.edited = false

          if (service.type === 'flexible' && service.range_type === 'default') {
            if (this.totalGuests <= 100) {
              service.totalCost = service.cost1 * this.totalGuests
            } else if (this.totalGuests <= 250) {
              service.totalCost = service.cost2 * this.totalGuests
            } else if (this.totalGuests <= 500) {
              service.totalCost = service.cost3 * this.totalGuests
            } else {
              service.totalCost = service.cost4 * this.totalGuests
            }
          } else if (service.type === 'flexible' && service.range_type === 'custom') {
            for (let j = 0; j < service.range_costs.length; j++) {
              let rangeData = {...service.range_costs[j]}
              if (this.totalGuests >= rangeData.min && this.totalGuests <= rangeData.max) {
                service.totalCost = rangeData.cost * this.totalGuests
              }
            }
            if (this.totalGuests > service.range_costs[service.range_costs.length - 1].max) {
              service.totalCost = service.range_costs[service.range_costs.length - 1].cost * this.totalGuests
            }
          } else if (service.type === 'fixed') {
            service.totalCost = service.cost
          }
          this.serviceListScoped.push(service)
        }
        this.currentService = {...this.serviceList[0]}
      },
      initClients() {
        this.clientListFormatted = []
        for (let i = 0; i < this.clients.length; i++) {
          let client = {}
          client.value = this.clients[i].id
          client.label = this.clients[i].full_name
          this.clientListFormatted.push(client)
        }
      },
      initContracts() {
        console.warn('initContracts')
        console.log(this.contracts)
        this.contractListFormatted = []

        // Add option for no contract
        let noContract = {}
        if (this.$language === 'en') {
          noContract.value = 0
          noContract.label = 'No contract'
        } else if (this.$language === 'tr') {
          noContract.value = 0
          noContract.label = 'Hiçbir sözleşme'
        }
        this.contractListFormatted.push(noContract)

        for (let i = 0; i < this.contracts.length; i++) {
          let contract = {...this.contracts[i]}
          contract.value = this.contracts[i].id
          contract.label = this.contracts[i].name
          this.contractListFormatted.push(contract)
        }
      },
      getDaysBusy() {
        if (this.bookings[this.currentProperty.id]) {
          this.daysBusy = this.bookings[this.currentProperty.id][this.dayPeriod].map(item => ({...item}))
        } else {
          this.daysBusy = []
        }
      },
      getDaysReserved() {
        this.daysReserved = []
        for (let i = 0; i < this.reservations.length; i++) {
          if (this.reservations[i].day_period === this.dayPeriod && this.reservations[i].property_id === this.currentProperty.id) {
            const reservation = {...this.reservations[i]}
            this.daysReserved.push(reservation)
          }
        }
      },
      errorValidityReset() {
        this.showErrorValidityDays = false
      },
      updateNotifications(reservation) {
        let notifications = this.notifications.map(item => ({...item}))

        // Add custom data to notification
        reservation.dateFormatted = moment(reservation.date).format('DD-MM-YYYY')
        reservation.expirationDateFormatted = moment(reservation.expiration_date).format('DD-MM-YYYY')
        let expirationDate = moment(reservation.expiration_date)
        let today = moment().startOf('day')
        let daysLeft = expirationDate.diff(today, 'days')
        if (daysLeft < 0) {
          reservation.daysLeft = 0
          reservation.expired = true
        } else {
          reservation.daysLeft = daysLeft
          reservation.expired = true
        }
        reservation.percentage = 100 - (daysLeft * 25)
        if (reservation.percentage < 0) {
          reservation.percentage = 10
        }
        if (reservation.percentage < 20) {
          reservation.percentage = 5
        }

        if (reservation.daysLeft < 2) {
          notifications.push(reservation)
        }

        store.dispatch({
          type: 'setAppNotifications',
          notifications: notifications
        })
        this.$localStorage.set('notifications', JSON.stringify(notifications))

        // Update reservations in store with formatted data
        let reservations = this.reservations.map(item => ({...item}))
        reservations.push(reservation)
        store.dispatch({
          type: 'setAppReservations',
          reservations: reservations
        })
        this.$localStorage.set('reservations', JSON.stringify(reservations))
      },
      reserveDate(offer) {
        this.showSpinnerReserveDate = true
        if (this.offerValidityDays === '') {
          this.showErrorValidityDays = true
          if (this.$language === 'en') {
            this.$toasted.show('Please, select validaty days for the reservation', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Rezervasyon için geçerli günleri seçiniz', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else if (this.offerValidityDays < 1) {
          this.showErrorValidityDays = true
          if (this.$language === 'en') {
            this.$toasted.show('Validity period must be more a positive number', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Gün aralığı gerçek sayılardan oluşmalı', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else {
          let expirationDate = moment().add(this.offerValidityDays, 'days').format('YYYY-MM-DD')

          let formData = new FormData()
          formData.append('client_id', this.clientId)
          formData.append('property_id', this.currentProperty.id)
          formData.append('date', offer.date)
          formData.append('day_period', offer.dayType)
          formData.append('project_id', this.user.project_id)
          formData.append('user_id', this.user.id)
          formData.append('validity', this.offerValidityDays)
          formData.append('expiration_date', expirationDate)
          formData.append('total_guests', this.totalGuests)
          formData.append('hour_start', this.timeStart.HH)
          formData.append('minute_start', this.timeStart.mm)
          formData.append('hour_end', this.timeEnd.HH)
          formData.append('minute_end', this.timeEnd.mm)
          formData.append('notes', this.notes)

          this.$http.post(this.appApiPath + '/api/reservation_add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
            this.showSpinnerReserveDate = false
            console.log('success response from reserve_date')
            console.log(response.body)

            // get current reservation with all data from the list
            let reservation = {}
            for (let i = 0; i < response.body.data.reservations.length; i++) {
              if (response.body.data.reservation.id === response.body.data.reservations[i].id) {
                reservation = {...response.body.data.reservations[i]}
              }
            }

            this.updateNotifications(reservation)

            if (this.user.role === 'manager') {
              router.push({name: 'reservations-m', params: {isAlert: true, alertType: 'reservation-create-success'}})
            } else if (this.user.role === 'admin') {
              router.push({name: 'reservations-o', params: {isAlert: true, alertType: 'reservation-create-success'}})
            }
          }, response => {
            this.showSpinnerReserveDate = false
            console.log('error from reserve_date')
            console.log(response)
          })
        }
      },
      reserveDateBookingTab() {
        if (this.offerValidityDays === '') {
          this.showErrorValidityDays = true
          if (this.$language === 'en') {
            this.$toasted.show('Please, select validaty days for the reservation', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Please, select validaty days for the reservation', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else if (this.offerValidityDays < 1) {
          this.showErrorValidityDays = true
          if (this.$language === 'en') {
            this.$toasted.show('Validity period must be more a positive number', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Validity period must be more a positive number', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else {
          this.showSpinnerReserveDate = true
          let expirationDate = moment().add(this.offerValidityDays, 'days').format('YYYY-MM-DD')

          var formData = new FormData()
          formData.append('client_id', this.clientId)
          formData.append('property_id', this.currentProperty.id)
          formData.append('date', this.date)
          formData.append('day_period', this.dayPeriod)
          formData.append('project_id', this.user.project_id)
          formData.append('user_id', this.user.id)
          formData.append('validity', this.offerValidityDays)
          formData.append('expiration_date', expirationDate)
          formData.append('total_guests', this.totalGuests)
          formData.append('hour_start', this.timeStart.HH)
          formData.append('minute_start', this.timeStart.mm)
          formData.append('hour_end', this.timeEnd.HH)
          formData.append('minute_end', this.timeEnd.mm)
          formData.append('notes', this.notes)

          this.$http.post(this.appApiPath + '/api/reservation_add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
            this.showSpinnerReserveDate = false
            console.log('success response from reserve_date')
            console.log(response.body)

            // get current reservation with all data from the list
            let reservation = {}
            for (let i = 0; i < response.body.data.reservations.length; i++) {
              if (response.body.data.reservation.id === response.body.data.reservations[i].id) {
                reservation = {...response.body.data.reservations[i]}
              }
            }

            this.updateNotifications(reservation)

            if (this.user.role === 'manager') {
              router.push({name: 'reservations-m', params: {isAlert: true, alertType: 'reservation-create-success'}})
            } else if (this.user.role === 'admin') {
              router.push({name: 'reservations-o', params: {isAlert: true, alertType: 'reservation-create-success'}})
            }
          }, response => {
            this.showSpinnerReserveDate = false
            console.log('error from reserve_date')
            console.log(response)
          })
        }
      },
      selectOffer(offer) {
        // Selet offer date as the only day selected (for next calendars
        let dateObject = {}
        dateObject.date = offer.date
        this.daysSelected = []
        this.daysSelected.push(dateObject)
        this.selectedOffer = {...offer}
        this.$refs.wizard.nextTab()
        this.date = offer.date
        if (offer.withServices) {
          for (let i = 0; i < this.serviceListScoped.length; i++) {
            const service = {...this.serviceListScoped[i]}
            this.selectService(service)
          }
        }
        this.updatePrices()
        this.calculateTotalCost()
      },
      generateOffers() {
        // Reset offer list
        this.offerList = []

        // Order days by date
        this.daysSelected.sort(function (a, b) {
          let keyA = new Date(a.date)
          let keyB = new Date(b.date)
          // Compare the 2 dates
          if (keyA < keyB) return -1
          if (keyA > keyB) return 1
          return 0
        })

        if (this.daysSelected.length === 0) {
          this.$toasted.clear()
          setTimeout(() => {
            if (this.$language === 'en') {
              this.$toasted.show('Please select at least one date', {icon: 'fa-exclamation-triangle', type: 'error', singleton: true})
            } else if (this.$language === 'tr') {
              this.$toasted.show('En az bir tarih seçmelisiniz', {icon: 'fa-exclamation-triangle', type: 'error', singleton: true})
            }
          }, 200)
        } else {
          this.showOfferList = true

          for (let i = 0; i < this.daysSelected.length; i++) {
            let date = this.daysSelected[i].date
            let dateYear = moment(date).year()
            let dayType = this.calculateDayType(date)
            let shortDate = moment(date).format('DD-MM-YYYY')
            let longDate = moment(date).lang('tr').format('dddd Do MMMM')
            let servicesCost = this.calculateServicesCost(this.serviceListScoped)

            let offer = {}
            offer.date = date
            offer.shortDate = shortDate
            offer.longDate = longDate
            offer.withServices = true
            offer.dayType = this.dayPeriod
            if (this.pricesArray[this.dayPeriod][date]) {
              offer.price = this.pricesArray[this.dayPeriod][date].price
            } else {
              offer.price = this.defaultPricesData[dateYear][this.currentMonthSeason][this.dayPeriod][dayType]
            }
            offer.servicesCost = servicesCost
            offer.totalCost = offer.price + servicesCost
            this.offerList.push(offer)
          }
          if (this.activeOrderOffer === 'price') {
            this.orderOffers('price')
          }
        }
      },
      calculateServicesCost(services) {
        let servicesTotalCost = 0

        for (let i = 0; i < services.length; i++) {
          let service = {...services[i]}

          if (service.type === 'fixed') {
            servicesTotalCost += service.cost
          } else if (service.type === 'flexible' && service.range_type === 'default') {
            if (this.totalGuests <= 100) {
              let cost = service.cost1 * this.totalGuests
              servicesTotalCost += cost
            } else if (this.totalGuests <= 250) {
              let cost = service.cost2 * this.totalGuests
              servicesTotalCost += cost
            } else if (this.totalGuests <= 500) {
              let cost = service.cost3 * this.totalGuests
              servicesTotalCost += cost
            } else {
              let cost = service.cost4 * this.totalGuests
              servicesTotalCost += cost
            }
          } else if (service.type === 'flexible' && service.range_type === 'custom') {
            for (let j = 0; j < service.range_costs.length; j++) {
              let rangeData = {...service.range_costs[j]}
              if (this.totalGuests >= rangeData.min && this.totalGuests <= rangeData.max) {
                let cost = rangeData.cost * this.totalGuests
                servicesTotalCost += cost
              }
            }
            if (this.totalGuests > service.range_costs[service.range_costs.length - 1].max) {
              let cost = service.range_costs[service.range_costs.length - 1].cost * this.totalGuests
              servicesTotalCost += cost
            }
          }
        }
        return servicesTotalCost
      },
      updateSeasons() {
        this.lowSeasonArray = JSON.parse(this.currentProperty.low_season_months)
        this.highSeasonArray = JSON.parse(this.currentProperty.high_season_months)
        let month = moment().month() + 1
        this.getCurrentMonthSeason(month)
      },
      calculateDayType(date) {
        let dayName = moment(date).format('dddd')
        let dayType

        if (dayName === 'Monday' || dayName === 'Tuesday' || dayName === 'Wednesday' || dayName === 'Thursday') {
          dayType = 'working_day'
        } else if (dayName === 'Friday') {
          dayType = 'friday'
        } else if (dayName === 'Saturday') {
          dayType = 'saturday'
        } else if (dayName === 'Sunday') {
          dayType = 'sunday'
        }
        return dayType
      },
      getCurrentMonthSeason(month) {
        if (this.lowSeasonArray.length > 0) {
          for (let i = 0; i < this.lowSeasonArray.length; i++) {
            if (month === this.lowSeasonArray[i]) {
              this.currentMonthSeason = 'low'
            }
          }
        }

        if (this.highSeasonArray.length > 0) {
          for (let i = 0; i < this.highSeasonArray.length; i++) {
            if (month === this.highSeasonArray[i]) {
              this.currentMonthSeason = 'high'
            }
          }
        }
      },
      resetForm() {
        this.$v.$reset()
        this.brideFullName = ''
        this.bridePhone = ''
        this.brideRegion = ''
        this.brideEmail = ''
        this.groomFullName = ''
        this.groomPhone = ''
        this.groomRegion = ''
        this.groomEmail = ''
        this.hasDiscount = false
        this.formSubmitted = false
      },
      isDate (v) {
        if (v instanceof Date) {
          return true
        }
        return false
      },
      stringify (v) {
        if (!this.isDate(v)) return null
        return v.getFullYear() + '-' + this.filled(v.getMonth() * 1 + 1) + '-' + this.filled(v.getDate())
      },
      filled (v) {
        return String(v).replace(/^(\d)$/, '0$1')
      },
      onDayClickOfferTab (date, dateFormatted) {
        let today = moment().format('YYYY-MM-DD')
        let isPastDate = moment(dateFormatted).isBefore(today)
        // Check if date is more than next year
        let isAfterNextYear = false
        if (moment(date).year() > this.yearNext) {
          isAfterNextYear = true
        }
        // Check if is busy
        this.isBusy = false
        for (var i = 0; i < this.daysBusy.length; i++) {
          let day = this.daysBusy[i].date
          if (dateFormatted === day) {
            this.isBusy = true
          }
        }

        // Check if is reserved
        this.isReserved = false
        for (let i = 0; i < this.daysReserved.length; i++) {
          if (dateFormatted === this.daysReserved[i].date) {
            this.isReserved = true
          }
        }

        // Check if is paste date
        if (isPastDate) {
          if (this.$language === 'en') {
            this.$toasted.show('You have selected a past date', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Geçmiş tarih seçtiniz', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else if (isAfterNextYear) {
          if (this.$language === 'en') {
            this.$toasted.show('Booking is possible only for current and next year', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Rezervasyon sadece bu yıl ve sonraki yıl için geçerlidir', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else if (!this.isBusy && !this.isReserved) {
          // Check if is already clicked
          let alreadyInArray = false
          for (let i = 0; i < this.daysSelected.length; i++) {
            if (this.daysSelected[i].date === dateFormatted) {
              alreadyInArray = true
            }
          }

          // If already selected - remove
          if (alreadyInArray) {
            this.daysSelected = this.daysSelected.filter(date => date.date !== dateFormatted)
          } else if (this.daysSelected.length < 5) {
            // Otherwise add to the array
            this.showDiscount = true
            let dateObject = {date: dateFormatted}
            this.daysSelected.push(dateObject)
          } else if (this.daysSelected.length >= 5) {
            this.$toasted.clear()
            setTimeout(() => {
              if (this.$language === 'en') {
                this.$toasted.show('You can select max 5 days', {icon: 'fa-exclamation-triangle', type: 'error', singleton: true})
              } else if (this.$language === 'tr') {
                this.$toasted.show('Maksimum 5 Gün seçebilirsiniz', {icon: 'fa-exclamation-triangle', type: 'error', singleton: true})
              }
            }, 200)
          }
        }
      },
      skipOffer() {
        // Loading the events data of the current month to fix bug of calendar without prices
        let month = moment().format('M')
        let year = moment().year()
        setTimeout(() => {
          this.changePane(year, month - 1, 1)
        }, 200)
      },
      onDayClickBookingTab(date, dateFormatted) {
        // Reset current discount
        this.hasDiscount = false
        this.totalDiscount = 0
        this.totalDiscountPercentage = 0

        // check if date is before
        let today = moment().format('YYYY-MM-DD')
        let isPastDate = moment(dateFormatted).isBefore(today)
        this.date = dateFormatted
        this.showBookingTabInputs = true
        // Check if date is more than next year
        let isAfterNextYear = false
        if (moment(date).year() > this.yearNext) {
          isAfterNextYear = true
        }

        this.checkDayAvailability(dateFormatted)
        this.getClientData(dateFormatted)

        if (isPastDate) {
          this.showBookingTabInputs = false
          if (this.$language === 'en') {
            this.$toasted.show('You have selected a past date', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Geçmiş tarih seçtiniz', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else if (isAfterNextYear) {
          if (this.$language === 'en') {
            this.$toasted.show('Booking is possible only for current and next year', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Booking is possible only for current and next year', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else if (!this.isBusy) {
          this.isBusy = false
          this.showDiscount = true
          this.isDaySelected = true
          if (!this.isSecondTab) {
            this.daysSelected = []
          }
          this.$refs.wizardBooking.setSingleDate(date)
          this.updatePrices()
          this.calculateTotalCost()

          // Calculate max discount
          if (this.user.role === 'manager') {
            this.maxDiscount = Math.ceil(this.currentPrice / 100 * this.user.max_discount)
          } else {
            this.maxDiscount = this.currentPrice
          }
        }
      },
      getClientData(dateFormatted) {
        if (this.isReserved) {
          for (let i = 0; i < this.reservations.length; i++) {
            if (moment(dateFormatted).format('YYYY-MM-DD') === this.reservations[i].date) {
              this.reservationClientName = this.reservations[i].client.full_name
              this.reservationClientId = this.reservations[i].client_id
            }
          }
        }

        if (this.isReserved && this.reservationClientId === this.clientId) {
          this.showBookingTabInputs = true
        }
      },
      updateTab(prevIndex, nextIndex) {
        if (nextIndex === 1 && !this.isEditingExistingBooking) {
          this.changePane(this.currentYearOffer, this.currentMonthOffer, 1)
        } else if ((nextIndex === 1 && this.isEditingExistingBooking) || nextIndex === 2) {
          this.changePane(this.currentYearBooking, this.currentMonthBooking, 1)
        }
      },
      changePane (year, month, pane) {
        setTimeout(() => {
          this.events = this.getEventContent(year, month, pane)
        }, 0)
      },
      changePaneOffer (year, month, pane) {
        this.currentMonthOffer = month
        this.currentYearOffer = year
        setTimeout(() => {
          this.events = this.getEventContent(year, month, pane)
        }, 0)
      },
      changePaneBooking (year, month, pane) {
        this.currentMonthBooking = month
        this.currentYearBooking = year
        setTimeout(() => {
          this.events = this.getEventContent(year, month, pane)
        }, 0)
      },
      getDayCount (year, month) {
        const dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if (month === 1) {
          if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
            return 29
          }
        }
        return dict[month]
      },
      getEventContent (year, month, pane) {
        const data = []
        for (let p = 0; p < pane; p++) {
          let date = new Date(year, month + p)
          let monthCounts = this.getDayCount(date.getFullYear(), date.getMonth())

          // Getting current season
          this.getCurrentMonthSeason(month + 1)

          for (let i = 1; i <= monthCounts; i++) {
            let datePrice = this.stringify(new Date(year, month + p, i))

            // Retrieving day type
            let dayType = this.calculateDayType(datePrice)

            data.push({
              date: datePrice,
              type: dayType
            })
          }
        }
        return data
      },
      random (min, max) {
        if (max === null) {
          max = min
          min = 0
        }
        return min + Math.floor(Math.random() * (max - min + 1))
      },
      makeDiscount(type) {
        if (type === 'amount') {
          if (this.totalDiscount > this.maxDiscount) {
            this.discountTooMuch = true
          } else {
            this.discountTooMuch = false
          }
        } else if (type === 'percentage') {
          if ((this.user.role === 'manager' && (this.totalDiscountPercentage > this.user.max_discount)) || (this.user.role === 'admin' && this.totalDiscountPercentage > 100)) {
            this.discountTooMuchPercentage = true
          } else {
            this.discountTooMuchPercentage = false
            // calculate total discount
            this.totalDiscount = 0
            this.totalDiscount = Math.round(this.currentPrice / 100 * this.totalDiscountPercentage)
          }
        }

        if (!this.discountTooMuch && !this.discountTooMuchPercentage && this.totalDiscount > 0) {
          this.hasDiscount = true
          this.newPrice = this.currentPrice - this.totalDiscount
          this.calculateTotalCost()
        }
      },
      checkDayAvailability(dateFormatted) {
        this.isBusy = false
        this.isReserved = false

        // Check if is busy
        for (let i = 0; i < this.daysBusy.length; i++) {
          if (dateFormatted === this.daysBusy[i].date && this.dayPeriod === this.daysBusy[i].type && !this.isEditingExistingBooking) {
            this.isBusy = true
            this.showBookingTabInputs = false
          }
        }

        // Check if is reserved (if not continuing with previous reservation)
        if (!this.isPreviousReservasion) {
          for (let i = 0; i < this.daysReserved.length; i++) {
            if (dateFormatted === this.daysReserved[i].date && this.dayPeriod === this.daysReserved[i].day_period) {
              this.isReserved = true
              this.showBookingTabInputs = false
            }
          }
        } else {
          this.isReserved = true
          this.showBookingTabInputs = true
        }
      },
      changeDayPeriod() {
        if (this.dayPeriod === 'day') {
          this.dayPeriod = 'night'
        } else if (this.dayPeriod === 'night') {
          this.dayPeriod = 'day'
        }

        this.getDaysBusy()
        this.getDaysReserved()
        if (this.date !== '') {
          this.checkDayAvailability(this.date)
          this.updatePrices()
          this.calculateTotalCost()
          if (this.stepIndex === 2) {
            this.getClientData(this.date)
          }
        }
      },
      propertyChanged() {
        for (let i = 0; i < this.properties.length; i++) {
          if (this.properties[i].id === this.currentPropertyId) {
            this.currentProperty = {...this.properties[i]}
          }
        }

        this.pricesArray = {...this.pricesListFull[this.currentProperty.id]}

        // Update seasons and get current month season
        this.updateSeasons()
        this.setupDefaultPrices(this.currentProperty)
        this.getDaysBusy()
        this.getDaysReserved()
        // If a date has already been selected - then update the current price
        if (this.date) {
          this.updatePrices()
        }
        this.calculateTotalCost()
      },
      updatePrices() {
        this.pricesArray = {...this.pricesListFull[this.currentProperty.id]}

        if (this.pricesArray[this.dayPeriod][this.date]) {
          this.currentPrice = this.pricesArray[this.dayPeriod][this.date].price
        } else {
          // calculate day price
          let dayType = this.calculateDayType(this.date)
          let year = moment(this.date).year()
          this.currentPrice = this.defaultPricesData[year][this.currentMonthSeason][this.dayPeriod][dayType]
        }
        if (this.hasDiscount) {
          this.newPrice = this.currentPrice - this.totalDiscount
        }
      },
      prepareBookingToSubmit() {
        this.formSubmitted = true
        this.showSpinner = true

        let price
        if (this.hasDiscount) {
          price = this.newPrice
        } else {
          price = this.currentPrice
        }

        // Print contract
        if (this.useContract) {
          let propertyCounter =  '00000' + (this.currentProperty.invoice_counter + 1)
          let contractFilename = propertyCounter.slice(-5)

          let contractData = {
            invoiceCounter: this.currentProperty.invoice_counter + 1,
            propertyName: this.currentProperty.name,
            user: this.user,
            // CHANGE CONTRACT
            contractInfo: {
              title: this.selectedContract.title,
              subtitle: this.selectedContract.subtitle,
              copyright: this.selectedContract.copyright,
              text: this.selectedContract.text,
              fieldsArray: this.selectedContract.fields,
              customFieldsArray: this.selectedContract.custom_fields,
              logo: this.selectedContract.base64,
            },
            clientData: {
              clientFullName: this.clientFullName,
              clientPhone: this.clientPhone,
              clientEmail: this.clientEmail,
              groomRegion: this.groomRegion,
              groomPhone: this.groomPhone,
              groomEmail: this.groomEmail,
              groomFullName: this.groomFullName,
              brideFullName: this.brideFullName,
              brideRegion: this.brideRegion,
              bridePhone: this.bridePhone,
              brideEmail: this.brideEmail,
            },
            bookingData: {
              totalCost: this.totalCost,
              advance: this.advance,
              notes: this.notes,
              addedServices: this.addedServices,
              totalGuests: this.totalGuests,
              date: this.date,
              timeStart: this.timeStart,
              timeEnd: this.timeEnd,
            }
          }
          let bookingContract = this.createContract(contractData) // mixin
          pdfMake.createPdf(bookingContract).download(`sözleşme-${contractFilename}.pdf`)
          const pdfDocGenerator = pdfMake.createPdf(bookingContract)

          pdfDocGenerator.getBase64((base64) => {
            this.submitBookingAPI(price, base64)
          })
        } else {
          this.submitBookingAPI(price)
        }
      },
      submitBookingAPI(price, base64 = null) {
        const servicesJson = JSON.stringify(this.addedServices)
        let formData = new FormData()
        formData.append('price', price)
        formData.append('date', this.date)
        formData.append('type', this.dayPeriod)
        formData.append('property_id', this.currentProperty.id)
        formData.append('groom_fullname', this.groomFullName)
        formData.append('groom_phone', this.groomPhone)
        formData.append('groom_region', this.groomRegion)
        formData.append('groom_email', this.groomEmail)
        formData.append('bride_fullname', this.brideFullName)
        formData.append('bride_phone', this.bridePhone)
        formData.append('bride_region', this.brideRegion)
        formData.append('bride_email', this.brideEmail)
        formData.append('total_cost', this.totalCost)
        formData.append('advance', this.advance)
        formData.append('added_services', servicesJson)
        formData.append('total_guests', this.totalGuests)
        formData.append('hour_start', this.timeStart.HH)
        formData.append('minute_start', this.timeStart.mm)
        formData.append('hour_end', this.timeEnd.HH)
        formData.append('minute_end', this.timeEnd.mm)
        formData.append('notes', this.notes)
        formData.append('payment_notes', this.paymentNotes)
        formData.append('client_id', this.clientId)
        formData.append('user_id', this.user.id)
        formData.append('booking_discount', this.totalDiscount)
        formData.append('booking_original_price', this.currentPrice)
        if (base64) {
          formData.append('base64', encodeURI(base64))
        }

        if (this.isPreviousReservasion) {
          formData.append('delete_previous_reservation', 'delete')
        } else {
          formData.append('delete_previous_reservation', 'no_delete')
        }
        formData.append('reservation_id', this.reservationId)

        let apiUrl = ''
        if (!this.isEditingExistingBooking) {
          apiUrl = '/api/booking_add'
        } else {
          apiUrl = '/api/booking_update'
          formData.append('booking_id', this.currentBooking.id)
        }

        // Send API request
        this.$http.post(this.appApiPath + apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          this.handleBookingResponse(response)
        }, response => {
          this.handleBookingError(response)
        })
      },
      handleBookingResponse(response) {
        console.log('success response from booking_add')
        console.log(response.body)

        // Print invoice if property requires it
        if (this.currentProperty.has_invoice) {
          try {
            this.createInvoice(response.body.data.booking)
          } catch (error) {
            console.log('error while creating invoice')
            console.log(error)
          }
        } else {
          // send only contract by email
          this.sendEmailContractOnly(response.body.data.booking)
        }

        this.updateBookingLists(response)
        if (!this.isEditingExistingBooking) {
          this.initReservations(response.body.data.reservations)
        }
        this.resetForm()
        this.showSpinner = false
        store.dispatch({
          type: 'setAppClients',
          clients: response.body.data.clients
        })
        this.$localStorage.set('clients', JSON.stringify(response.body.data.clients))

        store.dispatch({
          type: 'setAppProperties',
          properties: response.body.data.properties
        })
        this.savePropertiesInStorage(response.body.data.properties, 'admin')

        store.dispatch({
          type: 'setAppPropertiesManager',
          propertiesManager: response.body.data.propertiesManager
        })
        this.savePropertiesInStorage(response.body.data.propertiesManager, 'manager')

        // Redirect to booking view
        let bookingViewData = {}
        for (let i = 0; i < response.body.data.bookingListByDate.length; i++) {
          let booking = {...response.body.data.bookingListByDate[i]}
          if (booking.id === response.body.data.booking.id) {
            bookingViewData = {...booking}
          }
        }
        store.dispatch({
          type: 'setAppBookingViewData',
          bookingViewData: bookingViewData
        })
        this.$localStorage.set('bookingViewData', JSON.stringify(bookingViewData))
        router.push({name: 'bookingView', params: {isAlert: true, alertType: 'booking-create-success'}})
      },
      handleBookingError(response) {
        console.log('error from test upload')
        console.log(response)

        this.showSpinner = false
        this.resetForm()

        if (this.$language === 'en') {
          this.$toasted.show('Something went wrong when trying to make the booking', {icon: 'fa-exclamation-triangle', type: 'error'})
        } else if (this.$language === 'tr') {
          this.$toasted.show('Rezervasyon yapılırken bir hata oluştu', {icon: 'fa-exclamation-triangle', type: 'error'})
        }
      },
      sendEmailContractOnly(bookingData) {
        var formData = new FormData()
        formData.append('booking_id', bookingData.id)
        formData.append('manager_id', this.user.id)

        this.$http.post(this.appApiPath + '/api/email_send_contract_only', formData)
          .then(response => {
            console.log('success response from email_send_contract_only')
            console.log(response.body)
          }, response => {
            console.log('error from email_send_contract_only')
            console.log(response)
          })
      },
      createInvoice(bookingData) {
        let today = moment().format('DD-MM-YYYY')
        const bookingDate = moment(this.date).format('DD-MM-YYYY')
        let invoiceCounter = this.currentProperty.invoice_counter + 1
        let invoice = {
          footer: [
            {text: '', alignment: 'center'}
          ],
          content: [],
          styles: {
            header: {
              fontSize: 22,
              bold: true
            },
            date: {
              italics: false,
              alignment: 'right',
              margin: [0, 30, 79, 0]
            },
            mt10: {
              margin: [0, 10, 0, 0]
            },
            mt5: {
              margin: [0, 5, 0, 0]
            },
            tableExample: {
              margin: [0, 5, 0, 15],
              color: '#3F51B5',
              fontSize: 11
            },
            tableExampleNoMargin: {
              margin: [0, 5, 0, 5],
              color: '#3F51B5',
              fontSize: 11
            },
            tableHeader: {
              fontSize: 12,
            },
            tablePrices: {
              // margin: [5, 5, 5, 5],
              color: '#3F51B5',
              fontSize: 9
            }
          }
        }

        invoice.content.push({columns: [
          {
            width: 75,
            height: 280,
            margin: [0, 0, 0, 0],
            image: this.invoiceImageBase64,
          },

          {
            style: 'tableExample',
            table: {
              width: 'auto',
              body: [
                [
                  [
                    {
                      table: {
                        widths: [99, 99, 99, 99],
                        body: [
                          [
                            {text: 'Vade', alignment: 'center', decoration: 'underline'},
                            {text: 'Ödeme Tarihi', alignment: 'center', decoration: 'underline'},
                            {text: 'Türk Lirasi', alignment: 'center', decoration: 'underline'},
                            {text: 'No', alignment: 'center', decoration: 'underline'}
                          ],
                          [
                            {text: ' 120 gün ', decoration: 'underline', alignment: 'center', color: '#444'},
                            {text: bookingDate, decoration: 'underline', alignment: 'center', color: '#444'},
                            {text: this.totalCost, decoration: 'underline', alignment: 'center', color: '#444'},
                            {text: invoiceCounter, decoration: 'underline', alignment: 'center', color: '#444'}
                          ]
                        ]
                      },
                      layout: 'noBorders'
                    },
                    {
                      text: [
                        'İşbu emre muarrer     senedimizin     mukabilinde   ',
                        { text: today, decoration: 'underline', color: '#444' },
                        '   tarihinde'
                      ],
                      margin: [0, 10, 0, 0]
                    },
                    {
                      text: [
                        'Bay   ',
                        { text: this.clientFullName, decoration: 'underline', color: '#444' },
                        '   veyahat emrühavale        '
                      ],
                      style: 'mt5'
                    },
                    {
                      text: [
                        'yukarıda yazılı yalnız  ',
                        { text: WrittenNumber(this.totalCost, {lang: 'tr'}), decoration: 'underline', color: '#444' },
                        '  T. Lirası'
                      ],
                      style: 'mt5'
                    },
                    {
                      text: [
                        'ödeyeceği',
                        { text: 'z ', decoration: 'underline', color: '#444' },
                        '  bedeyi ahzolunmuştur. İşbu bönö vadesinde ödenmediği takdirde'
                      ],
                      style: 'mt5'
                    },
                    {
                      text: 'muteakip bonoların da muacceliyet kesbedeceğini, ihtilaf vukuunda _____________', // CITY NAME
                      style: 'mt5'
                    },
                    {
                      text: [
                        'mahkemelerinin selahiyetini şimdiden kabul eyler',
                        { text: 'iz   ', decoration: 'underline', color: '#444' }
                      ],
                      style: 'mt5'
                    },
                    {
                      text: [
                        'Ödeyecek   ',
                        { text: this.clientFullName, decoration: 'underline', color: '#444' }
                      ],
                      style: 'mt5'
                    },
                    {
                      text: this.clientPhone,
                      decoration: 'underline',
                      color: '#444',
                      style: 'mt5'
                    },
                    {
                      text: this.clientEmail ? this.clientEmail : '',
                      decoration: 'underline',
                      color: '#444',
                      style: 'mt5'
                    },
                    {
                      text: 'Kefili ________________________________________________',
                      style: 'mt5'
                    },
                    {
                      text: '_____________________________________________________',
                      style: 'mt5'
                    }
                  ]
                ]
              ]
            },
            layout: {
              hLineColor: function () { return '#3F51B5' },
              vLineColor: function () { return '#3F51B5' },
              paddingLeft: function () { return 10 },
              paddingRight: function () { return 10 },
              paddingTop: function () { return 10 },
              paddingBottom: function () { return 10 },
            }
          }
        ]})

        invoice.content.push({
          style: 'tableExampleNoMargin',
          table: {
            widths: [350, '*'],
            body: [
              [
                [
                  {
                    columns: [
                      {
                        width: 80,
                        text: 'Adı Soyadı'
                      },
                      {
                        width: '*',
                        text: ' : ____________________________________________________',
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        width: 80,
                        text: 'T.C: Kimlik No'
                      },
                      {
                        width: '*',
                        text: ' : ____________________________________________________',
                        style: 'mt5'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        width: 80,
                        text: 'Adresi'
                      },
                      {
                        width: '*',
                        text: ' : ____________________________________________________',
                        style: 'mt5'
                      }
                    ]
                  },
                  {text: '_____________________________________________________________________', style: 'mt5'},
                  {text: '_____________________________________________________________________', style: 'mt5'},
                  {
                    columns: [
                      {
                        width: 180,
                        text: 'Tel1 ____________________________',
                        style: 'mt5'
                      },
                      {
                        width: 180,
                        text: 'Tel2 ____________________________',
                        style: 'mt5'
                      }
                    ]
                  }
                ],
                [
                  {text: [
                    'Senet No. ',
                    { text: invoiceCounter, decoration: 'underline', color: '#444' }
                  ]},
                  {text: '_______________________'},
                  {text: 'Satiş Tarihi', margin: [0, 10, 0, 0], alignment: 'center'},
                  {text: today, margin: [0, 15, 0, 0], alignment: 'center', color: '#444', decoration: 'underline'}
                ]
              ]
            ]
          },
          layout: {
            hLineColor: function () { return '#3F51B5' },
            vLineColor: function () { return '#3F51B5' },
            paddingLeft: function () { return 10 },
            paddingRight: function () { return 10 },
            paddingTop: function () { return 10 },
            paddingBottom: function () { return 10 },
          }
        })

        invoice.content.push({
          style: 'tablePrices',
          table: {
            widths: [26, 91, 40, 20, 50, 50, 42, 27],
            heights: 5,
            headerRows: 2,
            body: [
              [
                {text: 'SATILAN MALIN', colSpan: 3, alignment: 'center', border: [true, true, true, true]},
                {},
                {},
                {text: 'ÖDEMELERİN', colSpan: 5, alignment: 'center', border: [true, true, true, true]},
                {},
                {},
                {},
                {}
              ],
              [
                {text: 'ADEDİ', alignment: 'center', border: [true, true, true, true]},
                {text: 'ÜRÜN KODU', alignment: 'center', border: [true, true, false, true]},
                {text: 'FİYATI', alignment: 'center', border: [false, true, true, true]},
                {text: 'SİRA', alignment: 'center', border: [true, true, true, true]},
                {text: 'TARİHİ', alignment: 'center', border: [true, true, true, true]},
                {text: 'MİKTARI', alignment: 'center', border: [true, true, true, true]},
                {text: 'TARİH', alignment: 'center', border: [true, true, false, true]},
                {text: 'İMZA', alignment: 'center', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 1 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 2 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 3 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 4 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 5 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 6 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 7 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ]
            ]
          },
          layout: {
            defaultBorder: false,
            hLineColor: function () { return '#3F51B5' },
            vLineColor: function () { return '#3F51B5' },
            paddingLeft: function () { return 10 },
            paddingRight: function () { return 10 },
            paddingTop: function () { return 10 },
            paddingBottom: function () { return 10 },
          }
        })

        try {
          let propertyCounter =  '00000' + (this.currentProperty.invoice_counter + 1)
          let contractFilename = propertyCounter.slice(-5)
          pdfMake.createPdf(invoice).download(`teklif-${contractFilename}.pdf`)
        } catch (error) {
          console.log('error while downloading the invoice')
          console.log(error)
        }

        const invoicePdf = pdfMake.createPdf(invoice)
        invoicePdf.getBase64((base64) => {
          var formData = new FormData()
          formData.append('manager_id', bookingData.manager_id)
          formData.append('booking_id', bookingData.id)
          formData.append('base64', encodeURI(base64))
          formData.append('is_mobile', false)

          this.$http.post(this.appApiPath + '/api/invoice_save', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
            console.log('success response from invoice_save')
            console.log(response.body)
          }, response => {
            console.log('error from invoice_save')
            console.log(response)
          })
        })
      },
      updateBookingLists(response) {
        this.updateBookings(response)
        // if (response.body.data.bookingList[this.currentProperty.id]) {
        //   console.log('response.body.data.bookingList[this.currentProperty.id]', response.body.data.bookingList[this.currentProperty.id])
        //   this.daysSelected = response.body.data.bookingList[this.currentProperty.id]
        // } else {
        //   this.daysSelected = []
        // }
      },
      showAddServiceModal(event) {
        event.preventDefault()
        this.$refs.addServiceModal.show()
      },
      totalGuestOnBlur() {
        this.initServices()
        this.calculateTotalCost()
        if (this.offerList.length > 0) {
          this.generateOffers()
        }
        // Check if total guests is bigger than service custom
        for (let i = 0; i < this.addedServices.length; i++) {
          let service = {...this.addedServices[i]}
          if (service.type === 'flexible' && service.range_type === 'custom') {
            this.compareGuestsServiceRange(service, service.range_costs[service.range_costs.length - 1].max)
          }
        }
      },
      calculateTotalCost() {
        this.totalCocalculatst = 0
        this.totalCostServices = 0

        if (this.hasDiscount) {
          this.totalCost = this.newPrice
        } else {
          this.totalCost = this.currentPrice
        }

        for (let i = 0; i < this.addedServices.length; i++) {
          let service = {...this.addedServices[i]}

          if (service.type === 'fixed') {
            this.totalCost += service.cost
            this.totalCostServices += service.cost
          } else if (service.type === 'flexible' && service.range_type === 'default') {
            if (this.isEditingExistingBooking) {
              const cost = service.cost * this.totalGuests
              this.totalCost += cost
              this.totalCostServices += cost
            } else {
              if (this.totalGuests <= 100) {
                let cost = service.cost1 * this.totalGuests
                this.totalCost += cost
                this.totalCostServices += cost
              } else if (this.totalGuests <= 250) {
                let cost = service.cost2 * this.totalGuests
                this.totalCost += cost
                this.totalCostServices += cost
              } else if (this.totalGuests <= 500) {
                let cost = service.cost3 * this.totalGuests
                this.totalCost += cost
                this.totalCostServices += cost
              } else {
                let cost = service.cost4 * this.totalGuests
                this.totalCost += cost
                this.totalCostServices += cost
              }
            }
          } else if (service.type === 'flexible' && service.range_type === 'custom') {
            for (let j = 0; j < service.range_costs.length; j++) {
              let rangeData = {...service.range_costs[j]}
              if (this.totalGuests >= rangeData.min && this.totalGuests <= rangeData.max) {
                let cost = rangeData.cost * this.totalGuests
                this.totalCost += cost
                this.totalCostServices += cost
              }
            }
            if (this.totalGuests > service.range_costs[service.range_costs.length - 1].max) {
              let cost = service.range_costs[service.range_costs.length - 1].cost * this.totalGuests
              this.totalCost += cost
              this.totalCostServices += cost
            }
          }
        }
      },
      serviceRemove(service, index) {
        if (index > -1) {
          this.addedServices.splice(index, 1)
          this.calculateTotalCost()
          this.serviceListScoped.push(service)
        }
      },
      serviceEdit(service) {
        this.showSpinnerServiceUpdatedSuccess = false
        if (this.currentServiceToEdit.id === service.id || !this.currentServiceToEdit) {
          this.isServiceEdit = !this.isServiceEdit
        } else {
          this.isServiceEdit = true
          this.currentServiceToEdit = {...service}
          // If is a flexible custom service create currentServiceToEdit.cost to use as v-model
          if (service.type === 'flexible' && service.range_type === 'custom') {
            for (let j = 0; j < service.range_costs.length; j++) {
              let rangeData = {...service.range_costs[j]}
              if (this.totalGuests >= rangeData.min && this.totalGuests <= rangeData.max) {
                this.currentServiceToEdit.cost = rangeData.cost
              }
            }
            if (this.totalGuests > service.range_costs[service.range_costs.length - 1].max) {
              this.currentServiceToEdit.cost = service.range_costs[service.range_costs.length - 1].cost
            }
          }
        }
      },
      serviceUpdate(type = '') {
        this.showSpinnerServiceEdit = true
        for (let i = 0; i < this.addedServices.length; i++) {
          let service = JSON.parse(JSON.stringify(this.addedServices[i])) // deep clone - avoid bug with changes in nested object range_costs 
          if (service.id === this.currentServiceToEdit.id) {
            if (service.type === 'fixed') {
              service.cost = Number(this.currentServiceToEdit.cost)
            }
            if (service.type === 'flexible' && service.range_type === 'default') {
              if (type) {
                service.cost = Number(this.currentServiceToEdit[type])
              } else {
                service.cost = Number(this.currentServiceToEdit.cost)
              }
              service.cost1 = Number(this.currentServiceToEdit.cost1)
              service.cost2 = Number(this.currentServiceToEdit.cost2)
              service.cost3 = Number(this.currentServiceToEdit.cost3)
              service.cost4 = Number(this.currentServiceToEdit.cost4)
            }
            if (service.type === 'flexible' && service.range_type === 'custom') {
              service.cost = Number(this.currentServiceToEdit.cost)
              for (let j = 0; j < service.range_costs.length; j++) {
                let rangeData = {...service.range_costs[j]}
                if (this.totalGuests >= rangeData.min && this.totalGuests <= rangeData.max) {
                  service.range_costs[j].cost = service.cost
                }
              }
              if (this.totalGuests > service.range_costs[service.range_costs.length - 1].max) {
                service.range_costs[service.range_costs.length - 1].cost = service.cost
              }
            }
            service.edited = true
            this.addedServices[i] = service;
          }
        }
        setTimeout(() => {
          this.showSpinnerServiceEdit = false
          this.showSpinnerServiceUpdatedSuccess = true
        }, 300)
        this.calculateTotalCost()
      },
      validateTabCustomerData() {
        this.customerDataSubmitted = true
        this.$v.clientFullName.$touch()
        this.$v.clientPhone.$touch()
        this.$v.clientEmail.$touch()
        // If there are no properties - cannot proced and make any booking
        if (this.properties.length > 0) {
          if (!this.saveNewClient) {
            // search for active reservation
            // let today = moment().format('YYYY-MM-DD')
            for (let i = 0; i < this.reservations.length; i++) {
              // let reservationDate = moment(this.reservations[i].date).format('YYYY-MM-DD')
              if (this.reservations[i].client_id === this.clientId && !this.reservations[i].expired) {
                this.clientHasReservation = true
                this.clientReservedDate = moment(this.reservations[i].date).format('DD-MM-YYYY')
                this.clientReservation = {...this.reservations[i]}
                // Show modal
                this.$refs.clientHasReservationModal.show()
                return true
              }
            }
            // If client don't have reservation active just move to next tab
            if (!this.clientHasReservation) {
              return true
            }
          } else if (!this.$v.clientFullName.$invalid && !this.$v.clientPhone.$invalid && !this.$v.clientEmail.$invalid) {
            let formData = {
              'full_name': this.clientFullName,
              'phone': this.clientPhone,
              'email': this.clientEmail,
              'project_id': this.user.project_id,
              'user_id': this.user.id
            }
            this.$http.post(this.appApiPath + '/api/client_add', formData)
              .then(response => {
                console.log('client_save api success')
                console.log(response)
                this.clientId = response.body.data.client.id
                store.dispatch({
                  type: 'setAppClients',
                  clients: response.body.data.clients
                })
                this.$localStorage.set('clients', JSON.stringify(response.body.data.clients))
                this.initClients()
              }, response => {
                console.log('client_save api error')
                console.log(response)
              })
            this.isSecondTab = true
            return true
          } else {
            if (this.$language === 'en') {
              this.$toasted.show('Please, insert all the required customer data', {icon: 'fa-exclamation-triangle', type: 'error'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Lütfen, gerekli müşteri verilerini giriniz', {icon: 'fa-exclamation-triangle', type: 'error'})
            }
            return false
          }
        } else {
          return false
        }
      },
      validateTabOffer() {
        // Reset days selected unless is only day selected
        if (this.daysSelected.length > 1) {
          this.daysSelected = []
          // Otherwise call the ondayclick on that day
        } else if (this.daysSelected.length === 1) {
          let date = moment(this.daysSelected[0].date).toDate()
          let dateFormatted = this.daysSelected[0].date
          this.onDayClickBookingTab(date, dateFormatted)
          /* let month = moment().format('M')
          let year = moment().year()
          setTimeout(() => {
            this.changePane(year, month - 1, 1)
          }, 100) */
        }
        this.isSecondTab = false
        return true
        /* if (this.isDaySelected && !this.isBusy) return true
        else {
          if (this.$language === 'en') {
            this.$toasted.show('Select a date please', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Lütfen, tarih Seçiniz', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
          return false
        } */
      },
      validateTabBookingData() {
        this.addedServices.forEach(item => {
          return item
        })
        if (!this.isDaySelected) {
          if (this.$language === 'en') {
            this.$toasted.show('Please, select a date', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Lütfen, tarih Seçiniz', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        }
        if (this.isReserved && this.clientId !== this.reservationClientId) {
          if (this.$language === 'en') {
            this.$toasted.show('Please, select an available date', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Uygun tarih seçiniz', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        }
        if (this.isBusy) {
          if (this.$language === 'en') {
            this.$toasted.show('Please, select an available date', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Uygun tarih seçiniz', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        }

        if (this.user.role === 'manager') {
          if (this.user.minimum_deposit > 0) {
            this.currentProperty.minimum_deposit > this.user.minimum_deposit ? 
              this.minimumDeposit = this.currentProperty.minimum_deposit :
              this.minimumDeposit = this.user.minimum_deposit
          }
        }
        if (!this.isEditingExistingBooking) {
          this.advance = this.minimumDeposit
        }
        
        if (this.isReserved && this.clientId === this.reservationClientId) {
          return true
        } else if (!this.isBusy && !this.isReserved && this.isDaySelected) {
          return true
        } else {
          return false
        }
      },
      validateTabBrideGroomData() {
        this.groomBrideDataSubmitted = true
        this.$v.groomFullName.$touch()
        this.$v.brideFullName.$touch()

        if (!this.$v.groomFullName.$invalid && !this.$v.brideFullName.$invalid) {
          return true
        } else {
          if (this.$language === 'en') {
            this.$toasted.show('Please, insert all the required customer data', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Lütfen, gerekli müşteri verilerini giriniz', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
          return false
        }
      },
      validateTabPayment() {
        this.advanceDataSubmitted = true
        this.$v.advance.$touch()
        if (this.advance > this.totalCost) {
          return false
        }
        if (!this.$v.advance.$invalid) {
          return true
        } else {
          if (this.$language === 'en') {
            this.$toasted.show('Please, insert all the required data', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Lütfen, gerekli verilerini giriniz', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
          return false
        }
      },
      validateTabConfirmation() {
        return true
      },
      serviceAdd() {
        if (this.serviceListScoped.length > 0) {
          this.addedServices.push(this.currentService)

          this.calculateTotalCost()

          let index = this.serviceListScoped.indexOf(this.currentService)
          if (index > -1) {
            this.serviceListScoped.splice(index, 1)
            this.currentService = this.serviceListScoped[0]
          }
        }
      },
      selectService(service) {
        // If is already selected - remove from array and set active to false
        if (service.active) {
          var index = this.addedServices.indexOf(service)
          if (index > -1) {
            this.addedServices.splice(index, 1)
          }
          for (let i = 0; i < this.serviceListScoped.length; i++) {
            if (this.serviceListScoped[i].id === service.id) {
              this.serviceListScoped[i].active = false
            }
          }
          this.removeServiceRangeFromArray(service)
        } else {
          // Otherwise add to the array and set active to true
          this.addedServices.push(service)
          for (let i = 0; i < this.serviceListScoped.length; i++) {
            if (this.serviceListScoped[i].id === service.id) {
              this.serviceListScoped[i].active = true
            }
          }

          if (service.type === 'flexible' && service.range_type === 'custom') {
            // Compare total guests and higher range - and in case show alert
            this.compareGuestsServiceRange(service, service.range_costs[service.range_costs.length - 1].max)
            // Create tooltip info text
            // this.tooltipInfoArray = []
            // Check if info is already inside tooltipInfoArray
            let isAlreadyInArray = false
            for (let i = 0; i < this.tooltipInfoArray.length; i++) {
              if (this.tooltipInfoArray[i].service_id === service.id) {
                isAlreadyInArray = true
              }
            }

            if (!isAlreadyInArray) {
              let tooltipObject = {}
              tooltipObject.service_id = service.id
              let tooltipInfo = ''
              for (let i = 0; i < service.range_costs.length; i++) {
                let rangeData = {...service.range_costs[i]}
                tooltipInfo += '<= ' + rangeData.max + ' - ' + rangeData.cost + '₺ <br>'
              }
              tooltipObject.text = tooltipInfo
              this.tooltipInfoArray.push(tooltipObject)
            }
          }
        }
        this.calculateTotalCost()
      },
      compareGuestsServiceRange(service, max) {
        if (this.totalGuests > max) {
          this.showAlertService = true
          // check if is not already in the array
          let index = this.alertServicesArray.indexOf(service)
          if (index === -1) {
            this.alertServicesArray.push(service)
          }
        } else {
          // remove from array
          this.removeServiceRangeFromArray(service)
        }
      },
      removeServiceRangeFromArray(service) {
        // remove service from alertServicesArray
        let index = this.alertServicesArray.indexOf(service)
        if (index > -1) {
          this.alertServicesArray.splice(index, 1)
        }

        // Remove bootstrap-alert if array is empty
        if (this.alertServicesArray.length === 0) {
          this.showAlertService = false
        }
      },
      offerListPrint() {
        let listPDF = {
          footer: [
            {text: 'Rezervex | 2018 © copyright', alignment: 'center'}
          ],
          content: [],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              alignment: 'center',
            },
            emptyLine: {
              fontSize: 14,
            },
            date: {
              italics: false,
              alignment: 'right',
              margin: [0, 10, 79, 0]
            },
            mt10: {
              margin: [0, 10, 0, 0]
            },
            mb10: {
              margin: [0, 0, 0, 10]
            },
            tableExample: {
              margin: [0, 5, 0, 5],
            },
          }
        }

        if (this.contractHeader) {
          listPDF.content.push({
            image: this.contractHeader,
            alignment: 'center',
            width: 599, // 800 * 0.7487922705314
            margin: [0, -40, 0, 0]
          })
        }

        listPDF.content.push({
          text: [
            {text: '   ' + '\n', style: 'emptyLine'},
            {text: 'TEKLİF LİSTESİ' + '\n', style: 'header', color: 'crimson'}
          ]
        })

        listPDF.content.push({
          canvas: [{ type: 'line', x1: -500, y1: 10, x2: 600, y2: 10, lineWidth: 1, color: '#666' }]
        })

        listPDF.content.push({
          text: [
            {text: '   ' + '\n', style: 'emptyLine'}
          ]
        })

        for (let i = 0; i < this.offerList.length; i++) {
          let offer = {...this.offerList[i]}
          if (offer.dayType === 'day') {
            offer.dayTranslated = 'Gündüz'
          } else if (offer.dayType === 'night') {
            offer.dayTranslated = 'Gece'
          }
          listPDF.content.push({
            text: [
              {text: '#' + (i + 1) + '\n', fontSize: 12, color: '#777'},
              {text: offer.shortDate + ' ' + offer.dayTranslated + '\n', bold: true, color: 'crimson', fontSize: 16},
              {text: 'Fiyat: ' + offer.price + '₺' + '\n'}
            ],
          })

          if (offer.withServices) {
            listPDF.content.push({
              text: [
                {text: 'Hizmetler: ' + '\n'}
              ],
            })
            for (let i = 0; i < this.serviceListScoped.length; i++) {
              let service = {...this.serviceListScoped[i]}
              if (service.description !== '' && service.description !== null) {
                listPDF.content.push({
                  text: [
                    {text: this.serviceListScoped[i].name + '\n', bold: true, color: '#49c4ed'},
                    {text: this.serviceListScoped[i].description + '\n', color: '#555', fontSize: 10},
                    {text: 'Fiyat: ' + offer.price + '₺ + ' + service.totalCost + '₺ = ' + (offer.price + service.totalCost) + '₺', color: '#555'}
                  ],
                  margin: [ 0, 0, 0, 3 ]
                })
              } else {
                listPDF.content.push({
                  text: [
                    {text: this.serviceListScoped[i].name + '\n', bold: true, color: '#49c4ed'},
                    {text: 'Fiyat:' + offer.price + '₺ + ' + service.totalCost + '₺ = ' + (offer.price + service.totalCost) + '₺', color: '#555'}
                  ],
                  margin: [ 0, 0, 0, 3 ]
                })
              }
            }
          } else {
            listPDF.content.push({
              text: [
                {text: 'Hizmet yok'}
              ],
              margin: [ 0, 0, 0, 20 ]
            })
          }
          listPDF.content.push({
            text: [
              {text: ''}
            ],
            margin: [ 0, 0, 0, 20 ]
          })
        }

        pdfMake.createPdf(listPDF).download('teklif.pdf')
      }
    }
  }
</script>

<style lang="scss" scoped>

  /*@font-face {
    font-family: Abhaya-Libre;
    src: url(../assets/font/abhaya-libre/AbhayaLibre-Regular.ttf);
  }*/


  @font-face {
    font-family: 'acherus_grotesque_-_regular';
    src: url(../assets/font/acherus/acherus_grotesque_-_regular-webfont.woff2) format('woff2'),
    url(../assets/font/acherus/acherus_grotesque_-_regular-webfont.woff) format('woff');
    font-weight: normal;
    font-style: normal;

  }

  .event-calendar {
    margin-top: 10px;
    margin-bottom: 20px;
    .datepicker-popup{
      z-index: 0;
    }
    .datepicker-body{
      .event{
        color: #E56700;
        margin-top: 18px!important;
      }
      .low{
        color: red;
        font-weight: bold;
      }
      .calendarEventSpan {
        height: 30px;
        background-color: transparent;
        margin-top:-6px;
      }
      .datepicker-monthRange span{
        width: 100px;
        height: 100px;
        vertical-align: middle;
        line-height: 100px;
        // font-weight: 600;
      }
    }
  }

  .toggleDayNight {
    font-size: 16px;
    margin-right: 20px;
    margin-top: 25px;
    /*float: right;*/
  }

  .rightCalendar {
    /* margin-top: 58px; */
  }

  .errorDiv {
    display: block;
    margin-top: 6px;
    font-size: 17px;
  }

  .discountInput {
    margin-top:10px;
  }

  .serviceList {
    margin-top:15px;
  }

  .serviceRemoveIcon {
    color: crimson;
  }

  .serviceRemoveIcon:hover {
    pointer: cursor;
  }

  .confirmButton {
    box-sizing: border-box;
    border-width: 2px;
    font-size: 15px;
    padding: 6px 12px;
    min-width: 140px;
    display: inline-block;
    margin-bottom: 0;
    font-weight: 600;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    white-space: nowrap;
    line-height: 1.42857;
    border-radius: 4px;
  }

  .card-text i {
    margin-right: 8px;
  }

  .bookingText {
    font-size: 1.3rem;
    font-weight: 300;
  }

  .bookingText200 {
    font-size: 1.3rem;
    font-weight: 200;
  }

  .bookingText500 {
    font-size: 1.3rem;
    font-weight: 500;
  }

  /*.time-picker input.display-time {
    border-radius: 20px!important;
  }*/

  .timepickerCustom input {
    border-radius: 20px!important;
  }


  .tooltipCustom {
    display: block !important;
    z-index: 10000;

    .tooltip-inner {
      background: black;
      color: white;
      border-radius: 16px;
      padding: 5px 10px 4px;
    }

    .tooltip-arrow {
      width: 0;
      height: 0;
      border-style: solid;
      position: absolute;
      margin: 5px;
      border-color: black;
      z-index: 1;
    }

    &[x-placement^="top"] {
      margin-bottom: 5px;

      .tooltip-arrow {
        border-width: 5px 5px 0 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        bottom: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    &[x-placement^="bottom"] {
      margin-top: 5px;

      .tooltip-arrow {
        border-width: 0 5px 5px 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-top-color: transparent !important;
        top: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    &[x-placement^="right"] {
      margin-left: 5px;

      .tooltip-arrow {
        border-width: 5px 5px 5px 0;
        border-left-color: transparent !important;
        border-top-color: transparent !important;
        border-bottom-color: transparent !important;
        left: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
      }
    }

    &[x-placement^="left"] {
      margin-right: 5px;

      .tooltip-arrow {
        border-width: 5px 0 5px 5px;
        border-top-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        right: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
      }
    }

    &.popover {
      $color: #f9f9f9;

      .popover-inner {
        background: $color;
        color: black;
        padding: 24px;
        border-radius: 5px;
        box-shadow: 0 5px 30px rgba(black, .1);
      }

      .popover-arrow {
        border-color: $color;
      }
    }

    &[aria-hidden='true'] {
      visibility: hidden;
      opacity: 0;
      transition: opacity .15s, visibility .15s;
    }

    &[aria-hidden='false'] {
      visibility: visible;
      opacity: 1;
      transition: opacity .15s;
    }
  }

  .serviceEditFlexible {
    display: block;
    width: 100%;
  }

  .blueSquare {
    width: 30px;
    height: 30px;
    background-color: rgba(86,182,255,0.7);
    float: left;
  }

  .yellowSquare {
    width: 30px;
    height: 30px;
    background-color: rgba(250,255,0,0.5);
    float: left;
  }

  .redSquare {
    width: 30px;
    height: 30px;
    background: #F29CB1;
    float: left;
  }

  .greenSquare {
    width: 30px;
    height: 30px;
    background-color: rgba(193, 255, 203, 0.4);
    float: left;
  }

  .orangeSquare {
    width: 30px;
    height: 30px;
    background-color: rgba(255, 165, 0, 0.7);
    float: left;
  }

  .legendBlock {
    display: inline-block;
    float: left;
    width: 130px;
    margin-right: 10px;
    margin-bottom: 3px;
  }

  .legendText {
    font-weight: 300;
    font-size: 0.8rem;
    color: #777;
    vertical-align: sub;
    margin-left: 5px;
  }

  .badge-pill {
    padding-right: 0.6em;
    padding-left: 0.6em;
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
  }

  .offerDayType {
    margin-left: 1rem;
    font-weight: 500;
    font-size: 1.4rem;
  }

  .offerDayLongDate {
    font-weight: 300 !important;
    font-size: 0.75rem !important;
    display: block;
  }

  .badgeWithServices {
    background-color: #8A2BE2;
    color: white;
    font-size: 0.7rem;
    margin-left: 30px;
  }

  .badgeOfferTotal {
    color: white;
    font-size: 0.7rem;
    margin-left: 10px;
  }

  .buttonSelectOffer {
    margin-top: -20px;
    font-size: 0.95rem;
    border-radius: 2px;
  }

  .buttonReserveDate {
    font-size: 0.95rem;
    margin-bottom:14px;
  }

  .buttonPrintOffers {
    background-color: #fc661b;
    margin-top: 15px;
  }

  .buttonsOrderList {
    display: block;
    margin-bottom: 5px;
  }

  .serviceButton {
    margin-right:2px;
    margin-top:3px;
    color: white!important;
  }

  .bookingTabTitle {
    font-size:1.5rem!important;
    font-weight: 300;
  }

  .bookingTabSubtitle {
    font-size:1.3rem;
    font-weight: 300;
  }

  .bookingTabInfo {
    color: #777;
    display: block;
    font-size: 0.9rem;
    font-weight: 300;
  }

  .jumbotron {
    padding: 0.9rem 0rem;
    background-color: #e1e6ef;
    margin-bottom: 0px;
  }

  .bookingTabInfoText {
    vertical-align: super;
  }

  .bookingTabInfoIcon {
    font-size: 1.6rem;
    margin-right: 8px;
  }

  .offerLegendContainer {
    margin-top: 10px;
    margin-bottom: 66px;
  }

  .offerDate {
    font-weight: 600;
    font-size: 1.7rem;
  }

  .offerServiceTitle {
    font-size: 1.5rem;
    font-weight: 300;
    display: block;
  }

  .offerServiceContainer {
    margin-bottom: 12px;
  }

  .offerServiceName {
    font-size: 1.4rem;
    font-weight: 300;
    color: #666;
    display: block;
  }

  .offerServiceDescription {
    font-size: 0.9rem;
    font-weight: 300;
    color: #666;
    display: block;
  }

  .offerServicePrice {
    font-size: 0.9rem;
    font-weight: 400;
    color: #666;
    display: block;
  }

  .offerItem {
    display: block;
    font-size: 1.2rem;
    font-weight: 400;
    color: #666;
    display: block;
  }

  .discountInfoBox {
    margin-top:10px;
    margin-bottom:10px;
  }


</style>
