<template>
  <div class="animated fadeIn">

    <div class="card" style="margin-top: 1rem">

      <div class="card-block">

        <div class="container">

          <div class="col-md-12 pageTitleRowInCard propertiesSetupPages">
            <div class="flex-center pageTitleContainer">
              <span class="white pageTitle" v-if="propertyFormType === 'edit'">
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                <span v-lang.propertyEdit></span>
              </span>
              <span class="white pageTitle" v-if="propertyFormType === 'add'">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                <span v-lang.propertyAdd></span>
              </span>
              <div class="white-text pageSubtitle" v-if="propertyFormType === 'edit'"><span v-lang.infoEditProperty></span></div>
              <div class="white-text pageSubtitle" v-if="propertyFormType === 'add'"><span v-lang.infoAddProperty></span></div>
            </div>
          </div>

          <form>
            <div v-if="showWarningNoContracts" class="alert alert-warning" role="alert">
              <div class="row">
                <div class="col-1">
                  <i class="fa fa-bell fa-2x"></i> 
                </div>
                <div class="col-11">
                  <span v-lang.noContractsInTheSystem></span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="inputName"><span v-lang.propertyName></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-user iconColor"></i></span>
                <input class="form-control" :class="{'is-invalid': $v.name.$error}" :placeholder="labelPropertyName" id="inputName" v-model="name" @input="$v.name.$touch()">
              </div>
              <div class="invalid-feedback" v-if="!$v.name.required && $v.name.$dirty">
                <span v-lang.nameRequired></span>
              </div>
            </div>

            <div class="form-group">
              <label for="inputDescription"><span v-lang.description></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-edit iconColor"></i></span>
                <textarea rows="10" class="form-control lightBorders" v-model.trim="propertyData.description" :placeholder="labelDescription" id="inputDescription"></textarea>
              </div>
            </div>

            <div class="form-group">
              <label for="inputCapacity1"><span v-lang.capacityGeneral></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-building iconColor"></i></span>
                <input type="number" class="form-control" id="inputCapacity1" :placeholder="labelCapacityGeneral" v-model="propertyData.capacity_general">
              </div>
            </div>

            <div class="form-group">
              <label for="inputCapacity2"><span v-lang.capacityWithFood></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-utensils iconColor"></i></span>
                <input type="number" class="form-control" :placeholder="labelCapacityWithFood" id="inputCapacity2" v-model="propertyData.capacity_with_food">
              </div>
            </div>


            <div class="form-group">
              <label for="inputDeposit"><span v-lang.minimumDeposit></span></label>
              <div class="input-group mb-2">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-lira-sign iconColor"></i></span>
                <div class="input-group-prepend">
                  <div class="input-group-text"> ₺</div>
                </div>
                <input type="number" class="form-control" :placeholder="labelMinimumDeposit" id="inputDeposit" v-model="propertyData.minimum_deposit">
              </div>
            </div>


            <div class="form-group">
              <label for="inputManagers"><span v-lang.managers></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-users iconColor"></i></span>
                <select multiple class="form-control" id="inputManagers" v-model="selectedManagers">
                  <option v-for="(user, index) in managers" :value="user.id" :key="index"> {{ user.first_name }} {{ user.last_name }} </option>
                </select>
              </div>
            </div>


            <map-autocomplete v-if="propertyFormType === 'add'" type="add" @setPropertyAddress="setPropertyAddress($event)" @mapRightClick="mapRightClick($event)"></map-autocomplete>

            <map-autocomplete v-if="propertyFormType === 'edit'" :propertyData="property" type="edit" @setPropertyAddress="setPropertyAddress($event)" @mapRightClick="mapRightClick($event)"></map-autocomplete>


            <div style="margin-top: 25px">
              <span class="formSubtitle"><span v-lang.season></span></span>
              <div id="legend">
                <div class="legendBlock">
                  <div id="greySquare"></div>
                  <p class="card-text"><span v-lang.lowSeason class="legendText"></span></p>
                </div>
                <div class="legendBlock">
                  <div id="orangeSquare"></div>
                  <p class="card-text"><span v-lang.highSeason class="legendText"></span></p>
                </div>
              </div>
              <p class="seasonChooseInfo"><span v-lang.seasonChooseInfo></span></p>
              <button class="btn white mt10" :class="{'btn-secondary': months[0].season === 'low', 'btn-warning': months[0].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(0, $event)">
                <span v-lang.january></span>
              </button>
              <button class="btn white mt10" :class="{'btn-secondary': months[1].season === 'low', 'btn-warning': months[1].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(1, $event)">
                <span v-lang.february></span>
              </button>
              <button class="btn white mt10" :class="{'btn-secondary': months[2].season === 'low', 'btn-warning': months[2].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(2, $event)">
                <span v-lang.march></span>
              </button>
              <button class="btn white mt10" :class="{'btn-secondary': months[3].season === 'low', 'btn-warning': months[3].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(3, $event)">
                <span v-lang.april></span>
              </button>
              <button class="btn white mt10" :class="{'btn-secondary': months[4].season === 'low', 'btn-warning': months[4].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(4, $event)">
                <span v-lang.may></span>
              </button>
              <button class="btn white mt10" :class="{'btn-secondary': months[5].season === 'low', 'btn-warning': months[5].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(5, $event)">
                <span v-lang.june></span>
              </button>
              <button class="btn white mt10" :class="{'btn-secondary': months[6].season === 'low', 'btn-warning': months[6].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(6, $event)">
                <span v-lang.july></span>
              </button>
              <button class="btn white mt10" :class="{'btn-secondary': months[7].season === 'low', 'btn-warning': months[7].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(7, $event)">
                <span v-lang.august></span>
              </button>
              <button class="btn white mt10" :class="{'btn-secondary': months[8].season === 'low', 'btn-warning': months[8].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(8, $event)">
                <span v-lang.september></span>
              </button>
              <button class="btn white mt10" :class="{'btn-secondary': months[9].season === 'low', 'btn-warning': months[9].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(9, $event)">
                <span v-lang.october></span>
              </button>
              <button class="btn white mt10" :class="{'btn-secondary': months[10].season === 'low', 'btn-warning': months[10].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(10, $event)">
                <span v-lang.november></span>
              </button>
              <button class="btn white mt10" :class="{'btn-secondary': months[11].season === 'low', 'btn-warning': months[11].season === 'high', 'btnSmallCustom': $language === 'en'}" @click="changeSeason(11, $event)">
                <span v-lang.december></span>
              </button>
            </div>


            <b-tabs class="mt50">
              <b-tab :title="String(yearCurrent)" active>
                <!--CURRENT YEAR-->

                <div class="jumbotron jumbotron-fluid jumbotronCustom">
                  <div class="container">
                    <span class="bookingTabInfo">
                      <i class="fa fa-info-circle bookingTabInfoIcon"></i>
                      <span v-lang.defaultPriceNextYear class="bookingTabInfoText"></span>
                    </span>
                  </div>
                </div>

                <!--HIGH SEASON-->
                <div class="form-group row">
                  <div class="col-md-12">
                    <span class="formSubtitle" style="font-size: 1.2rem"><span v-lang.defaultPriceHighSeason></span></span>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-md-2">
                  </div>
                  <div class="col-md-5">
                    <label> <span v-lang.dayPrice></span></label>
                  </div>
                  <div class="col-md-5">
                    <label> <span v-lang.nightPrice></span></label>
                  </div>
                </div>

                <!--working days-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.workingDays></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price1" :class="{'is-invalid': $v.defaultPriceHighSeasonWorkingDaysDayCurrentYear.$error || defaultPriceHighSeasonWorkingDaysDayCurrentYear < 0}" v-model="defaultPriceHighSeasonWorkingDaysDayCurrentYear" @input="$v.defaultPriceHighSeasonWorkingDaysDayCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceHighSeasonWorkingDaysDayCurrentYear.required && $v.defaultPriceHighSeasonWorkingDaysDayCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceHighSeasonWorkingDaysDayCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price4" :class="{'is-invalid': $v.defaultPriceHighSeasonWorkingDaysNightCurrentYear.$error || defaultPriceHighSeasonWorkingDaysNightCurrentYear < 0}" v-model="defaultPriceHighSeasonWorkingDaysNightCurrentYear" @input="$v.defaultPriceHighSeasonWorkingDaysNightCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceHighSeasonWorkingDaysNightCurrentYear.required && $v.defaultPriceHighSeasonWorkingDaysNightCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceHighSeasonWorkingDaysNightCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                </div>


                <!--friday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.friday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price2" :class="{'is-invalid': $v.defaultPriceHighSeasonFridayDayCurrentYear.$error || defaultPriceHighSeasonFridayDayCurrentYear < 0}" v-model="defaultPriceHighSeasonFridayDayCurrentYear" @input="$v.defaultPriceHighSeasonFridayDayCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceHighSeasonFridayDayCurrentYear.required && $v.defaultPriceHighSeasonFridayDayCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceHighSeasonFridayDayCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price5" :class="{'is-invalid': $v.defaultPriceHighSeasonFridayNightCurrentYear.$error || defaultPriceHighSeasonFridayNightCurrentYear < 0}" v-model="defaultPriceHighSeasonFridayNightCurrentYear" @input="$v.defaultPriceHighSeasonFridayNightCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceHighSeasonFridayNightCurrentYear.required && $v.defaultPriceHighSeasonFridayNightCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceHighSeasonFridayNightCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                </div>


                <!--saturday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.saturday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price3" :class="{'is-invalid': $v.defaultPriceHighSeasonSaturdayDayCurrentYear.$error || defaultPriceHighSeasonSaturdayDayCurrentYear < 0}" v-model="defaultPriceHighSeasonSaturdayDayCurrentYear" @input="$v.defaultPriceHighSeasonSaturdayDayCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceHighSeasonSaturdayDayCurrentYear.required && $v.defaultPriceHighSeasonSaturdayDayCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceHighSeasonSaturdayDayCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price6" :class="{'is-invalid': $v.defaultPriceHighSeasonSaturdayNightCurrentYear.$error || defaultPriceHighSeasonSaturdayNightCurrentYear < 0}" v-model="defaultPriceHighSeasonSaturdayNightCurrentYear" @input="$v.defaultPriceHighSeasonSaturdayNightCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceHighSeasonSaturdayNightCurrentYear.required && $v.defaultPriceHighSeasonSaturdayNightCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceHighSeasonSaturdayNightCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                </div>


                <!--sunday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.sunday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price3b" :class="{'is-invalid': $v.defaultPriceHighSeasonSundayDayCurrentYear.$error || defaultPriceHighSeasonSundayDayCurrentYear < 0}" v-model="defaultPriceHighSeasonSundayDayCurrentYear" @input="$v.defaultPriceHighSeasonSundayDayCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceHighSeasonSundayDayCurrentYear.required && $v.defaultPriceHighSeasonSundayDayCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceHighSeasonSundayDayCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price6b" :class="{'is-invalid': $v.defaultPriceHighSeasonSundayNightCurrentYear.$error || defaultPriceHighSeasonSundayNightCurrentYear < 0}" v-model="defaultPriceHighSeasonSundayNightCurrentYear" @input="$v.defaultPriceHighSeasonSundayNightCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceHighSeasonSundayNightCurrentYear.required && $v.defaultPriceHighSeasonSundayNightCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceHighSeasonSundayNightCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                </div>



                <!--LOW SEASON-->
                <div class="form-group row">
                  <div class="col-md-12">
                    <span class="formSubtitle" style="font-size: 1.2rem"><span v-lang.defaultPriceLowSeason></span></span>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-md-2">
                  </div>
                  <div class="col-md-5">
                    <label> <span v-lang.dayPrice></span></label>
                  </div>
                  <div class="col-md-5">
                    <label> <span v-lang.nightPrice></span></label>
                  </div>
                </div>

                <!--workingDays-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.workingDays></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price7" :class="{'is-invalid': $v.defaultPriceLowSeasonWorkingDaysDayCurrentYear.$error || defaultPriceLowSeasonWorkingDaysDayCurrentYear < 0}" v-model="defaultPriceLowSeasonWorkingDaysDayCurrentYear" @input="$v.defaultPriceLowSeasonWorkingDaysDayCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceLowSeasonWorkingDaysDayCurrentYear.required && $v.defaultPriceLowSeasonWorkingDaysDayCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceLowSeasonWorkingDaysDayCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price10" :class="{'is-invalid': $v.defaultPriceLowSeasonWorkingDaysNightCurrentYear.$error || defaultPriceLowSeasonWorkingDaysNightCurrentYear < 0}" v-model="defaultPriceLowSeasonWorkingDaysNightCurrentYear" @input="$v.defaultPriceLowSeasonWorkingDaysNightCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceLowSeasonWorkingDaysNightCurrentYear.required && $v.defaultPriceLowSeasonWorkingDaysNightCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceLowSeasonWorkingDaysNightCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                </div>


                <!--friday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.friday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price8" :class="{'is-invalid': $v.defaultPriceLowSeasonFridayDayCurrentYear.$error || defaultPriceLowSeasonFridayDayCurrentYear < 0}" v-model="defaultPriceLowSeasonFridayDayCurrentYear" @input="$v.defaultPriceLowSeasonFridayDayCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceLowSeasonFridayDayCurrentYear.required && $v.defaultPriceLowSeasonFridayDayCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceLowSeasonFridayDayCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price11" :class="{'is-invalid': $v.defaultPriceLowSeasonFridayNightCurrentYear.$error || defaultPriceLowSeasonFridayNightCurrentYear < 0}" v-model="defaultPriceLowSeasonFridayNightCurrentYear" @input="$v.defaultPriceLowSeasonFridayNightCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceLowSeasonFridayNightCurrentYear.required && $v.defaultPriceLowSeasonFridayNightCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceLowSeasonFridayNightCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                </div>


                <!--saturday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.saturday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price9" :class="{'is-invalid': $v.defaultPriceLowSeasonSaturdayDayCurrentYear.$error || defaultPriceLowSeasonSaturdayDayCurrentYear < 0}" v-model="defaultPriceLowSeasonSaturdayDayCurrentYear" @input="$v.defaultPriceLowSeasonSaturdayDayCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceLowSeasonSaturdayDayCurrentYear.required && $v.defaultPriceLowSeasonSaturdayDayCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceLowSeasonSaturdayDayCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price12" :class="{'is-invalid': $v.defaultPriceLowSeasonSaturdayNightCurrentYear.$error || defaultPriceLowSeasonSaturdayNightCurrentYear < 0}" v-model="defaultPriceLowSeasonSaturdayNightCurrentYear" @input="$v.defaultPriceLowSeasonSaturdayNightCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceLowSeasonSaturdayNightCurrentYear.required && $v.defaultPriceLowSeasonSaturdayNightCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceLowSeasonSaturdayNightCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                </div>


                <!--sunday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.sunday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price9b" :class="{'is-invalid': $v.defaultPriceLowSeasonSundayDayCurrentYear.$error || defaultPriceLowSeasonSundayDayCurrentYear < 0}" v-model="defaultPriceLowSeasonSundayDayCurrentYear" @input="$v.defaultPriceLowSeasonSundayDayCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceLowSeasonSundayDayCurrentYear.required && $v.defaultPriceLowSeasonSundayDayCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceLowSeasonSundayDayCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price12b" :class="{'is-invalid': $v.defaultPriceLowSeasonSundayNightCurrentYear.$error || defaultPriceLowSeasonSundayNightCurrentYear < 0}" v-model="defaultPriceLowSeasonSundayNightCurrentYear" @input="$v.defaultPriceLowSeasonSundayNightCurrentYear.$touch()">
                    </div>
                    <div class="invalid-feedback" v-if="!$v.defaultPriceLowSeasonSundayNightCurrentYear.required && $v.defaultPriceLowSeasonSundayNightCurrentYear.$dirty">
                      <span v-lang.fieldRequired></span>
                    </div>
                    <div class="invalid-feedback" v-if="formSent && defaultPriceLowSeasonSundayNightCurrentYear <= 0">
                      <span v-lang.ValueBiggerThanZero></span>
                    </div>
                  </div>
                </div>


              </b-tab>
              <b-tab :title="String(yearNext)" >
                <!--NEXT YEAR-->

                <!--HIGH SEASON-->
                <div class="form-group row">
                  <div class="col-md-12">
                    <span class="formSubtitle" style="font-size: 1.2rem"><span v-lang.defaultPriceHighSeason></span></span>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-md-2">
                  </div>
                  <div class="col-md-5">
                    <label> <span v-lang.dayPrice></span></label>
                  </div>
                  <div class="col-md-5">
                    <label> <span v-lang.nightPrice></span></label>
                  </div>
                </div>


                <!--workingDays-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.workingDays></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price1Next" v-model="defaultPriceHighSeasonWorkingDaysDayNextYear">
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price4Next" v-model="defaultPriceHighSeasonWorkingDaysNightNextYear">
                    </div>
                  </div>
                </div>

                <!--friday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.friday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price2Next" v-model="defaultPriceHighSeasonFridayDayNextYear">
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price5Next" v-model="defaultPriceHighSeasonFridayNightNextYear">
                    </div>
                  </div>
                </div>

                <!--saturday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.saturday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price3Next" v-model="defaultPriceHighSeasonSaturdayDayNextYear">
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price6Next" v-model="defaultPriceHighSeasonSaturdayNightNextYear">
                    </div>
                  </div>
                </div>

                <!--sunday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.sunday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price3bNext" v-model="defaultPriceHighSeasonSundayDayNextYear">
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price6bNext" v-model="defaultPriceHighSeasonSundayNightNextYear">
                    </div>
                  </div>
                </div>






                <!--LOW SEASON-->
                <div class="form-group row">
                  <div class="col-md-12">
                    <span class="formSubtitle" style="font-size: 1.2rem"><span v-lang.defaultPriceLowSeason></span></span>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-md-2">
                  </div>
                  <div class="col-md-5">
                    <label> <span v-lang.dayPrice></span></label>
                  </div>
                  <div class="col-md-5">
                    <label> <span v-lang.nightPrice></span></label>
                  </div>
                </div>


                <!--workingDays-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.workingDays></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price7Next" v-model="defaultPriceLowSeasonWorkingDaysDayNextYear">
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price10Next" v-model="defaultPriceLowSeasonWorkingDaysNightNextYear">
                    </div>
                  </div>
                </div>

                <!--friday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.friday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price8Next" v-model="defaultPriceLowSeasonFridayDayNextYear">
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price11Next" v-model="defaultPriceLowSeasonFridayNightNextYear">
                    </div>
                  </div>
                </div>

                <!--saturday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.saturday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price9Next" v-model="defaultPriceLowSeasonSaturdayDayNextYear">
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price12Next" v-model="defaultPriceLowSeasonSaturdayNightNextYear">
                    </div>
                  </div>
                </div>

                <!--sunday-->
                <div class="form-group row">
                  <div class="col-md-2">
                    <label> <span v-lang.sunday></span></label>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-sun-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price9bNext" v-model="defaultPriceLowSeasonSundayDayNextYear">
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <div class="input-group-text"> <i class="fa fa-moon-o"></i></div>
                      </div>
                      <input type="number" class="form-control" id="price12bNext" v-model="defaultPriceLowSeasonSundayNightNextYear">
                    </div>
                  </div>
                </div>

              </b-tab>
            </b-tabs>


            <div>
              <span class="formSubtitle"><span v-lang.images></span></span>
              <div class="md-form">
                <vue-dropzone
                  ref="myVueDropzone"
                  id="dropzoneAdd"
                  class="customDropzone"
                  :destroyDropzone="false"
                  :options="dzOptions"
                  v-on:vdropzone-success="imageAdded"
                  v-on:vdropzone-removed-file="imageRemoved"
                ></vue-dropzone>
                <small class="form-text text-muted"><span v-lang.maxFilesize></span>: 10Mb</small>
              </div>
            </div>


            <div class="mt25" style="width: 33%">
              <span class="formSubtitle"><span v-lang.contract></span></span>

              <p class="card-text normalText200" v-if="!propertyData.contract_id || !propertyData.contract"> <span v-lang.noContracts></span></p>
              <p class="card-text normalText200 text-success" v-if="propertyData.contract_id && propertyData.contract"> {{ propertyData.contract.name }}</p>

              <button v-if="!propertyData.contract_id" type="submit" class="btn btn-info btn-block white" @click="openContractModal($event)">
                <i class="fa fa-plus-circle"></i>
                <span v-lang.assignContract></span>
              </button>

              <button v-if="propertyData.contract_id" type="submit" class="btn btn-info btn-block white" @click="openContractModal($event)">
                <i class="fa fa-edit"></i>
                <span v-lang.updateContract></span>
              </button>

            </div>


            <span class="formSubtitle"><span v-lang.invoice></span></span>
            <div class="form-check">
              <input id="inputInvoice" class="form-check-input" v-model="propertyData.has_invoice" type="checkbox" value="">
              <label for="inputInvoice"><span v-lang.invoceRequired></span></label>
            </div>


            <div class="form-group row mt25">
              <div class="col-sm-3">
                <button v-if="propertyFormType === 'add'" type="submit" class="btn btn-success btn-lg btn-block white buttonMain" @click="addProperty($event)">
                  <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                  <i class="fa fa-check-circle" v-if="!showSpinner"></i>
                  <span v-lang.propertyAdd></span>
                </button>
                <button v-if="propertyFormType === 'edit'" type="submit" class="btn btn-success btn-lg btn-block white buttonMain" @click="updateProperty($event)">
                  <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                  <i class="fa fa-check-circle" v-if="!showSpinner"></i>
                  <span v-lang.updateProperty></span>
                </button>
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>


    <b-modal ref="modalAssignContract" class="modal-info">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.assignContract></span></h5>
      </template>
      <span v-lang.assignContractInfo></span>

      <v-select v-model="contractSelected" :options="contractsFormatted"></v-select>

      <template slot="modal-footer">
        <b-btn variant="default" @click="$refs.modalAssignContract.hide()">
          <span v-lang.close></span>
        </b-btn>
        <b-btn variant="success" class="white" @click="contractAssign($event)">
          <span v-lang.assign></span>
        </b-btn>
      </template>
    </b-modal>


  </div>
</template>

<script>
  import router from '../router'
  import 'vue-awesome/icons/spinner'
  import Icon from 'vue-awesome/components/Icon'
  import { required } from 'vuelidate/lib/validators'
  import store from '../vuex/store'
  import vue2Dropzone from 'vue2-dropzone'
  import 'vue2-dropzone/dist/vue2Dropzone.min.css'
  import vSelect from 'vue-select'
  import moment from 'moment'
  import pdfMake from 'pdfmake/build/pdfmake'
  import pdfFonts from 'pdfmake/build/vfs_fonts'
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  import MapAutocomplete from '../components/MapAutocomplete.vue'
  import { labels } from '../mixins/labels'
  import { savePropertiesInStorage } from '../mixins/savePropertiesInStorage'
  import { saveCurrentPropertyInStorage } from '../mixins/saveCurrentPropertyInStorage'
  import { saveContractsInStorage } from '../mixins/saveContractsInStorage'

  export default {
    components: { MapAutocomplete, vueDropzone: vue2Dropzone, Icon, vSelect },
    mixins: [labels, savePropertiesInStorage, saveCurrentPropertyInStorage, saveContractsInStorage],
    data() {
      return {
        propertyData: {
          capacity_general: '',
          capacity_with_food: '',
          minimum_deposit: 0,
          description: '',
          address: '',
          lat: '',
          lng: '',
          contract_id: '',
          has_invoice: false,
        },
        selectedManagers: [],
        managers: [],
        propertyImages: [],
        showSpinner: false,
        name: '',
        formSent: false,
        contractsFormatted: [],
        contractSelected: {},
        dzOptions: {
          url: 'https://httpbin.org/post',
          thumbnailWidth: 150,
          addRemoveLinks: true,
          destroyDropzone: false,
          headers: { 'My-Awesome-Header': 'header value' },
          acceptedFiles: 'image/jpeg, image/png, image/jpg',
          maxFilesize: 10,
        },
        boolean: false,
        months: [
          {id: 1, season: 'low'},
          {id: 2, season: 'low'},
          {id: 3, season: 'low'},
          {id: 4, season: 'high'},
          {id: 5, season: 'high'},
          {id: 6, season: 'high'},
          {id: 7, season: 'high'},
          {id: 8, season: 'high'},
          {id: 9, season: 'high'},
          {id: 10, season: 'low'},
          {id: 11, season: 'low'},
          {id: 12, season: 'low'}
        ],
        lowSeasonArray: [],
        highSeasonArray: [],
        // Current year default prices
        defaultPriceHighSeasonWorkingDaysDayCurrentYear: '',
        defaultPriceHighSeasonFridayDayCurrentYear: '',
        defaultPriceHighSeasonSaturdayDayCurrentYear: '',
        defaultPriceHighSeasonSundayDayCurrentYear: '',
        defaultPriceHighSeasonWorkingDaysNightCurrentYear: '',
        defaultPriceHighSeasonFridayNightCurrentYear: '',
        defaultPriceHighSeasonSaturdayNightCurrentYear: '',
        defaultPriceHighSeasonSundayNightCurrentYear: '',
        defaultPriceLowSeasonWorkingDaysDayCurrentYear: '',
        defaultPriceLowSeasonFridayDayCurrentYear: '',
        defaultPriceLowSeasonSaturdayDayCurrentYear: '',
        defaultPriceLowSeasonSundayDayCurrentYear: '',
        defaultPriceLowSeasonWorkingDaysNightCurrentYear: '',
        defaultPriceLowSeasonFridayNightCurrentYear: '',
        defaultPriceLowSeasonSaturdayNightCurrentYear: '',
        defaultPriceLowSeasonSundayNightCurrentYear: '',
        // Next year default prices
        defaultPriceHighSeasonWorkingDaysDayNextYear: '',
        defaultPriceHighSeasonFridayDayNextYear: '',
        defaultPriceHighSeasonSaturdayDayNextYear: '',
        defaultPriceHighSeasonSundayDayNextYear: '',
        defaultPriceHighSeasonWorkingDaysNightNextYear: '',
        defaultPriceHighSeasonFridayNightNextYear: '',
        defaultPriceHighSeasonSaturdayNightNextYear: '',
        defaultPriceHighSeasonSundayNightNextYear: '',
        defaultPriceLowSeasonWorkingDaysDayNextYear: '',
        defaultPriceLowSeasonFridayDayNextYear: '',
        defaultPriceLowSeasonSaturdayDayNextYear: '',
        defaultPriceLowSeasonSundayDayNextYear: '',
        defaultPriceLowSeasonWorkingDaysNightNextYear: '',
        defaultPriceLowSeasonFridayNightNextYear: '',
        defaultPriceLowSeasonSaturdayNightNextYear: '',
        defaultPriceLowSeasonSundayNightNextYear: '',
        yearCurrent: '',
        yearNext: '',
        showWarningNoContracts: false,
      }
    },

    router: router,

    validations: {
      name: {
        required,
      },
      defaultPriceHighSeasonWorkingDaysDayCurrentYear: {
        required,
      },
      defaultPriceHighSeasonFridayDayCurrentYear: {
        required,
      },
      defaultPriceHighSeasonSaturdayDayCurrentYear: {
        required,
      },
      defaultPriceHighSeasonSundayDayCurrentYear: {
        required,
      },
      defaultPriceHighSeasonWorkingDaysNightCurrentYear: {
        required,
      },
      defaultPriceHighSeasonFridayNightCurrentYear: {
        required,
      },
      defaultPriceHighSeasonSaturdayNightCurrentYear: {
        required,
      },
      defaultPriceHighSeasonSundayNightCurrentYear: {
        required,
      },
      defaultPriceLowSeasonWorkingDaysDayCurrentYear: {
        required,
      },
      defaultPriceLowSeasonFridayDayCurrentYear: {
        required,
      },
      defaultPriceLowSeasonSaturdayDayCurrentYear: {
        required,
      },
      defaultPriceLowSeasonSundayDayCurrentYear: {
        required,
      },
      defaultPriceLowSeasonWorkingDaysNightCurrentYear: {
        required,
      },
      defaultPriceLowSeasonFridayNightCurrentYear: {
        required,
      },
      defaultPriceLowSeasonSaturdayNightCurrentYear: {
        required,
      },
      defaultPriceLowSeasonSundayNightCurrentYear: {
        required,
      },
    },

    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      properties () {
        return store.getters.getProperties
      },
      users () {
        return store.getters.getUsers
      },
      property() {
        return store.getters.getCurrentProperty
      },
      propertyFormType() {
        return store.getters.getPropertyFormType
      },
      user() {
        return store.getters.getUser
      },
      contracts() {
        return store.getters.getContracts
      },
    },

    created() {
      this.$language = this.language
      this.initDropzoneLabels()
      this.initContracts()
      this.initContractSelected()
      this.initManagers()
      if (this.propertyFormType === 'edit') {
        this.initEditing()
      }
      this.initYears()
      console.log('property', this.property)
      console.log('propertyData', this.propertyData)
    },

    methods: {
      initYears() {
        this.yearCurrent = moment().year()
        this.yearNext = moment().add(1, 'year').year()
      },
      initContracts() {
        if (this.contracts.length === 0) {
          this.showWarningNoContracts = true
        } else {
          for (let i = 0; i < this.contracts.length; i++) {
            let contract = {}
            contract.value = this.contracts[i].id
            contract.label = this.contracts[i].name
            this.contractsFormatted.push(contract)
          }
        }
      },
      initContractSelected() {
        if (this.property.contract_id && this.property.contract) {
          this.contractSelected.value = this.property.contract_id
          this.contractSelected.label = this.property.contract.name
        } else {
          this.contractSelected = this.contractsFormatted[0]
        }
      },
      initDropzoneLabels() {
        if (this.$language === 'tr') {
          this.dzOptions.dictDefaultMessage = '<i class="fa fa-cloud-upload-alt"></i> Resimleri buraya bırak'
        } else if (this.$language === 'en') {
          this.dzOptions.dictDefaultMessage = '<i class="fa fa-cloud-upload-alt"></i> Drop images here'
        }
      },
      initManagers() {
        for (let i = 0; i < this.users.length; i++) {
          let manager = {...this.users[i]}
          manager.disabled = false
          if (manager.id === this.user.id && this.propertyFormType === 'add') {
            let index = this.selectedManagers.indexOf(manager.id)
            if (index === -1) {
              this.selectedManagers.push(manager.id)
            }
          }
          this.managers.push(manager)
        }
      },
      initMonths() {
        this.lowSeasonArray = JSON.parse(this.propertyData.low_season_months)
        this.highSeasonArray = JSON.parse(this.propertyData.high_season_months)

        // Set all months to high
        for (let i = 0; i < this.months.length; i++) {
          this.months[i].season = 'high'
        }

        // Then assign to low months
        for (let i = 0; i < this.lowSeasonArray.length; i++) {
          for (let j = 0; j < this.months.length; j++) {
            if (this.months[j].id === this.lowSeasonArray[i]) {
              this.months[j].season = 'low'
            }
          }
        }
      },
      initEditing() {
        this.propertyData = {...this.property}
        this.name = this.property.name

        this.defaultPriceHighSeasonWorkingDaysDayCurrentYear = this.propertyData.default_prices_current_year[0].default_price_high_season_working_days_day
        this.defaultPriceHighSeasonFridayDayCurrentYear = this.propertyData.default_prices_current_year[0].default_price_high_season_friday_day
        this.defaultPriceHighSeasonSaturdayDayCurrentYear = this.propertyData.default_prices_current_year[0].default_price_high_season_saturday_day
        this.defaultPriceHighSeasonSundayDayCurrentYear = this.propertyData.default_prices_current_year[0].default_price_high_season_sunday_day
        this.defaultPriceHighSeasonWorkingDaysNightCurrentYear = this.propertyData.default_prices_current_year[0].default_price_high_season_working_days_night
        this.defaultPriceHighSeasonFridayNightCurrentYear = this.propertyData.default_prices_current_year[0].default_price_high_season_friday_night
        this.defaultPriceHighSeasonSaturdayNightCurrentYear = this.propertyData.default_prices_current_year[0].default_price_high_season_saturday_night
        this.defaultPriceHighSeasonSundayNightCurrentYear = this.propertyData.default_prices_current_year[0].default_price_high_season_sunday_night
        this.defaultPriceLowSeasonWorkingDaysDayCurrentYear = this.propertyData.default_prices_current_year[0].default_price_low_season_working_days_day
        this.defaultPriceLowSeasonFridayDayCurrentYear = this.propertyData.default_prices_current_year[0].default_price_low_season_friday_day
        this.defaultPriceLowSeasonSaturdayDayCurrentYear = this.propertyData.default_prices_current_year[0].default_price_low_season_saturday_day
        this.defaultPriceLowSeasonSundayDayCurrentYear = this.propertyData.default_prices_current_year[0].default_price_low_season_sunday_day
        this.defaultPriceLowSeasonWorkingDaysNightCurrentYear = this.propertyData.default_prices_current_year[0].default_price_low_season_working_days_night
        this.defaultPriceLowSeasonFridayNightCurrentYear = this.propertyData.default_prices_current_year[0].default_price_low_season_friday_night
        this.defaultPriceLowSeasonSaturdayNightCurrentYear = this.propertyData.default_prices_current_year[0].default_price_low_season_saturday_night
        this.defaultPriceLowSeasonSundayNightCurrentYear = this.propertyData.default_prices_current_year[0].default_price_low_season_sunday_night

        this.defaultPriceHighSeasonWorkingDaysDayNextYear = this.propertyData.default_prices_next_year[0].default_price_high_season_working_days_day
        this.defaultPriceHighSeasonFridayDayNextYear = this.propertyData.default_prices_next_year[0].default_price_high_season_friday_day
        this.defaultPriceHighSeasonSaturdayDayNextYear = this.propertyData.default_prices_next_year[0].default_price_high_season_saturday_day
        this.defaultPriceHighSeasonSundayDayNextYear = this.propertyData.default_prices_next_year[0].default_price_high_season_sunday_day
        this.defaultPriceHighSeasonWorkingDaysNightNextYear = this.propertyData.default_prices_next_year[0].default_price_high_season_working_days_night
        this.defaultPriceHighSeasonFridayNightNextYear = this.propertyData.default_prices_next_year[0].default_price_high_season_friday_night
        this.defaultPriceHighSeasonSaturdayNightNextYear = this.propertyData.default_prices_next_year[0].default_price_high_season_saturday_night
        this.defaultPriceHighSeasonSundayNightNextYear = this.propertyData.default_prices_next_year[0].default_price_high_season_sunday_night
        this.defaultPriceLowSeasonWorkingDaysDayNextYear = this.propertyData.default_prices_next_year[0].default_price_low_season_working_days_day
        this.defaultPriceLowSeasonFridayDayNextYear = this.propertyData.default_prices_next_year[0].default_price_low_season_friday_day
        this.defaultPriceLowSeasonSaturdayDayNextYear = this.propertyData.default_prices_next_year[0].default_price_low_season_saturday_day
        this.defaultPriceLowSeasonSundayDayNextYear = this.propertyData.default_prices_next_year[0].default_price_low_season_sunday_day
        this.defaultPriceLowSeasonWorkingDaysNightNextYear = this.propertyData.default_prices_next_year[0].default_price_low_season_working_days_night
        this.defaultPriceLowSeasonFridayNightNextYear = this.propertyData.default_prices_next_year[0].default_price_low_season_friday_night
        this.defaultPriceLowSeasonSaturdayNightNextYear = this.propertyData.default_prices_next_year[0].default_price_low_season_saturday_night
        this.defaultPriceLowSeasonSundayNightNextYear = this.propertyData.default_prices_next_year[0].default_price_low_season_sunday_night

        this.initMonths()

        if (isNaN(this.property.lat)) {
          this.propertyData.lat = null
        }

        if (isNaN(this.property.lng)) {
          this.propertyData.lng = null
        }

        // Load previous images into this.propertyImages
        this.propertyImages = []

        if (this.property.images) {
          for (let i = 0; i < this.property.images.length; i++) {
            let image = {...this.property.images[i]}

            let mockFileImage = {}
            mockFileImage.dataURL = image.base64
            mockFileImage.height = image.height
            mockFileImage.width = image.width
            mockFileImage.isAlreadyUploaded = true

            this.propertyImages.push(mockFileImage)
          }
        }

        // Get the managers
        if (this.property.managers) {
          for (let i = 0; i < this.property.managers.length; i++) {
            let manager = {...this.property.managers[i]}
            this.selectedManagers.push(manager.id)
          }
        }

        // Get the thumbnails
        if (this.property.thumbs) {
          setTimeout(() => {
            for (let i = 0; i < this.property.thumbs.length; i++) {
              let thumb = {...this.property.thumbs[i]}
              let thumbName = thumb.path.replace('/thumbs/', '')

              this.$refs.myVueDropzone.manuallyAddFile({
                name: thumbName, size: thumb.size, type: 'image', thumb_id: thumb.id, image_id: thumb.image_id
              }, this.appApiPath + thumb.path)
            }
          }, 100)
        }
      },
      imageAdded(file, response) {
        console.log('A file was successfully uploaded to the dropzone')
        console.log(file)
        console.log(response)

        if (this.propertyFormType === 'edit') {
          let formData = new FormData()
          formData.append('image', file)
          formData.append('image_name', 'adsadads')
          formData.append('imageData', JSON.stringify(file))
          formData.append('property_id', this.property.id)
          formData.append('user_id', this.user.id)

          this.$http.post(this.appApiPath + '/api/property_image_add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
            console.log('success response from property_image_add')
            console.log(response.body)

            store.dispatch({
              type: 'setAppProperties',
              properties: response.body.data.properties
            })
            this.savePropertiesInStorage(response.body.data.properties, 'admin')
          }, response => {
            console.warn('error from property_image_add')
            console.log(response)
          })
        } else {
          file.isAlreadyUploaded = false
          this.propertyImages.push(file)
        }
      },
      imageRemoved(file) {
        if (this.propertyFormType === 'edit') {
          let postData = {
            'thumb_id': file.thumb_id,
            'image_id': file.image_id,
            'property_id': this.property.id,
            'user_id': this.user.id,
          }

          this.$http.post(this.appApiPath + '/api/property_image_remove', postData).then(response => {
            console.log('image remove success')
            console.log(response.body)

            store.dispatch({
              type: 'setAppProperties',
              properties: response.body.data.properties
            })
            this.savePropertiesInStorage(response.body.data.properties, 'admin')
          }, response => {
            console.warn('image remove error')
            console.log(response)
          })
        } else {
          for (var i = 0; i < this.propertyImages.length; i++) {
            let propertyImage = {...this.propertyImages[i]}

            if (propertyImage.name === file.name) {
              this.propertyImages.splice(i, 1)
            }
          }
        }
      },
      addProperty(event) {
        event.preventDefault()

        this.formSent = true

        let pricesInvalid = false
        if (this.defaultPriceHighSeasonWorkingDaysDayCurrentYear <= 0 || this.defaultPriceHighSeasonFridayDayCurrentYear <= 0 || this.defaultPriceHighSeasonSaturdayDayCurrentYear <= 0 || this.defaultPriceHighSeasonSundayDayCurrentYear <= 0) {
          pricesInvalid = true
        }
        if (this.defaultPriceHighSeasonWorkingDaysNightCurrentYear <= 0 || this.defaultPriceHighSeasonFridayNightCurrentYear <= 0 || this.defaultPriceHighSeasonSaturdayNightCurrentYear <= 0 || this.defaultPriceHighSeasonSundayNightCurrentYear <= 0) {
          pricesInvalid = true
        }
        if (this.defaultPriceLowSeasonWorkingDaysDayCurrentYear <= 0 || this.defaultPriceLowSeasonFridayDayCurrentYear <= 0 || this.defaultPriceLowSeasonSaturdayDayCurrentYear <= 0 || this.defaultPriceLowSeasonSundayDayCurrentYear <= 0) {
          pricesInvalid = true
        }
        if (this.defaultPriceLowSeasonWorkingDaysNightCurrentYear <= 0 || this.defaultPriceLowSeasonFridayNightCurrentYear <= 0 || this.defaultPriceLowSeasonSaturdayNightCurrentYear <= 0 || this.defaultPriceLowSeasonSundayNightCurrentYear <= 0) {
          pricesInvalid = true
        }

        if (this.$v.$invalid || pricesInvalid) {
          this.$v.name.$touch()
          this.$v.defaultPriceHighSeasonWorkingDaysDayCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonFridayDayCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonSaturdayDayCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonSundayDayCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonWorkingDaysNightCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonFridayNightCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonSaturdayNightCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonSundayNightCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonWorkingDaysDayCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonFridayDayCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonSaturdayDayCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonSundayDayCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonWorkingDaysNightCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonFridayNightCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonSaturdayNightCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonSundayNightCurrentYear.$touch()

          if (this.language === 'en') {
            this.$toasted.show('Please fill in the required fields', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Gerekli alanlari doldurunuz.', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else {
          this.showSpinner = true

          let formData = new FormData()

          for (let i = 0; i < this.propertyImages.length; i++) {
            formData.append('image' + i, this.propertyImages[i])
          }

          // Put months in two simple array
          let highSeason = []
          let lowSeason = []

          for (let i = 0; i < this.months.length; i++) {
            let month = this.months[i]
            if (month.season === 'high') {
              highSeason.push(month.id)
            }
            if (month.season === 'low') {
              lowSeason.push(month.id)
            }
          }

          this.propertyData.managers = this.selectedManagers
          formData.append('name', this.name)
          formData.append('description', this.propertyData.description)
          formData.append('capacity_general', this.propertyData.capacity_general)
          formData.append('capacity_with_food', this.propertyData.capacity_with_food)
          formData.append('minimum_deposit', this.propertyData.minimum_deposit)
          formData.append('managers', JSON.stringify(this.propertyData.managers))
          formData.append('address', this.propertyData.address)
          formData.append('lat', this.propertyData.lat)
          formData.append('lng', this.propertyData.lng)
          formData.append('images', JSON.stringify(this.propertyImages))
          formData.append('user_id', this.user.id)
          formData.append('contract_id', this.propertyData.contract_id)
          // Current year default prices
          formData.append('default_price_high_season_working_days_day_current_year', this.defaultPriceHighSeasonWorkingDaysDayCurrentYear)
          formData.append('default_price_high_season_friday_day_current_year', this.defaultPriceHighSeasonFridayDayCurrentYear)
          formData.append('default_price_high_season_saturday_day_current_year', this.defaultPriceHighSeasonSaturdayDayCurrentYear)
          formData.append('default_price_high_season_sunday_day_current_year', this.defaultPriceHighSeasonSundayDayCurrentYear)
          formData.append('default_price_high_season_working_days_night_current_year', this.defaultPriceHighSeasonWorkingDaysNightCurrentYear)
          formData.append('default_price_high_season_friday_night_current_year', this.defaultPriceHighSeasonFridayNightCurrentYear)
          formData.append('default_price_high_season_saturday_night_current_year', this.defaultPriceHighSeasonSaturdayNightCurrentYear)
          formData.append('default_price_high_season_sunday_night_current_year', this.defaultPriceHighSeasonSundayNightCurrentYear)
          formData.append('default_price_low_season_working_days_day_current_year', this.defaultPriceLowSeasonWorkingDaysDayCurrentYear)
          formData.append('default_price_low_season_friday_day_current_year', this.defaultPriceLowSeasonFridayDayCurrentYear)
          formData.append('default_price_low_season_saturday_day_current_year', this.defaultPriceLowSeasonSaturdayDayCurrentYear)
          formData.append('default_price_low_season_sunday_day_current_year', this.defaultPriceLowSeasonSundayDayCurrentYear)
          formData.append('default_price_low_season_working_days_night_current_year', this.defaultPriceLowSeasonWorkingDaysNightCurrentYear)
          formData.append('default_price_low_season_friday_night_current_year', this.defaultPriceLowSeasonFridayNightCurrentYear)
          formData.append('default_price_low_season_saturday_night_current_year', this.defaultPriceLowSeasonSaturdayNightCurrentYear)
          formData.append('default_price_low_season_sunday_night_current_year', this.defaultPriceLowSeasonSundayNightCurrentYear)
          // Next year default prices
          formData.append('default_price_high_season_working_days_day_next_year', this.defaultPriceHighSeasonWorkingDaysDayNextYear)
          formData.append('default_price_high_season_friday_day_next_year', this.defaultPriceHighSeasonFridayDayNextYear)
          formData.append('default_price_high_season_saturday_day_next_year', this.defaultPriceHighSeasonSaturdayDayNextYear)
          formData.append('default_price_high_season_sunday_day_next_year', this.defaultPriceHighSeasonSundayDayNextYear)
          formData.append('default_price_high_season_working_days_night_next_year', this.defaultPriceHighSeasonWorkingDaysNightNextYear)
          formData.append('default_price_high_season_friday_night_next_year', this.defaultPriceHighSeasonFridayNightNextYear)
          formData.append('default_price_high_season_saturday_night_next_year', this.defaultPriceHighSeasonSaturdayNightNextYear)
          formData.append('default_price_high_season_sunday_night_next_year', this.defaultPriceHighSeasonSundayNightNextYear)
          formData.append('default_price_low_season_working_days_day_next_year', this.defaultPriceLowSeasonWorkingDaysDayNextYear)
          formData.append('default_price_low_season_friday_day_next_year', this.defaultPriceLowSeasonFridayDayNextYear)
          formData.append('default_price_low_season_saturday_day_next_year', this.defaultPriceLowSeasonSaturdayDayNextYear)
          formData.append('default_price_low_season_sunday_day_next_year', this.defaultPriceLowSeasonSundayDayNextYear)
          formData.append('default_price_low_season_working_days_night_next_year', this.defaultPriceLowSeasonWorkingDaysNightNextYear)
          formData.append('default_price_low_season_friday_night_next_year', this.defaultPriceLowSeasonFridayNightNextYear)
          formData.append('default_price_low_season_saturday_night_next_year', this.defaultPriceLowSeasonSaturdayNightNextYear)
          formData.append('default_price_low_season_sunday_night_next_year', this.defaultPriceLowSeasonSundayNightNextYear)
          formData.append('current_year', this.yearCurrent)
          formData.append('next_year', this.yearNext)
          formData.append('high_season_months', JSON.stringify(highSeason))
          formData.append('low_season_months', JSON.stringify(lowSeason))

          if (this.propertyData.has_invoice) {
            formData.append('has_invoice', 1)
          } else {
            formData.append('has_invoice', 0)
          }

          this.$http.post(this.appApiPath + '/api/property_add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
            console.log('success response from property_add')
            console.log(response.body)

            this.showSpinner = false

            store.dispatch({
              type: 'setAppProperties',
              properties: response.body.data.properties
            })
            this.savePropertiesInStorage(response.body.data.properties, 'admin')

            store.dispatch({
              type: 'setAppPricesList',
              pricesList: response.body.data.prices
            })
            this.$localStorage.set('pricesList', JSON.stringify(response.body.data.prices))

            router.push({ name: 'properties', params: { isAlert: true, alertType: 'create-success' } })
          }, response => {
            console.warn('error from property_add')
            console.log(response)

            this.showSpinner = false
          })
        }
      },
      setPropertyAddress(event) {
        if (this.propertyFormType === 'add') {
          this.propertyData.address = event[0].formatted_address
          this.propertyData.lat = event[1]
          this.propertyData.lng = event[2]
        } else if (this.propertyFormType === 'edit') {
          this.property.address = event[0].formatted_address
          this.property.lat = event[1]
          this.property.lng = event[2]
        }
      },
      updateProperty(event) {
        event.preventDefault()

        this.formSent = true

        console.log('form submitted')
        console.log(this.propertyData)

        let pricesInvalid = false
        if (this.defaultPriceHighSeasonWorkingDaysDayCurrentYear <= 0 || this.defaultPriceHighSeasonFridayDayCurrentYear <= 0 || this.defaultPriceHighSeasonSaturdayDayCurrentYear <= 0 || this.defaultPriceHighSeasonSundayDayCurrentYear <= 0) {
          pricesInvalid = true
        }
        if (this.defaultPriceHighSeasonWorkingDaysNightCurrentYear <= 0 || this.defaultPriceHighSeasonFridayNightCurrentYear <= 0 || this.defaultPriceHighSeasonSaturdayNightCurrentYear <= 0 || this.defaultPriceHighSeasonSundayNightCurrentYear <= 0) {
          pricesInvalid = true
        }
        if (this.defaultPriceLowSeasonWorkingDaysDayCurrentYear <= 0 || this.defaultPriceLowSeasonFridayDayCurrentYear <= 0 || this.defaultPriceLowSeasonSaturdayDayCurrentYear <= 0 || this.defaultPriceLowSeasonSundayDayCurrentYear <= 0) {
          pricesInvalid = true
        }
        if (this.defaultPriceLowSeasonWorkingDaysNightCurrentYear <= 0 || this.defaultPriceLowSeasonFridayNightCurrentYear <= 0 || this.defaultPriceLowSeasonSaturdayNightCurrentYear <= 0 || this.defaultPriceLowSeasonSundayNightCurrentYear <= 0) {
          pricesInvalid = true
        }

        if (this.$v.$invalid || pricesInvalid) {
          this.$v.name.$touch()
          this.$v.defaultPriceHighSeasonWorkingDaysDayCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonFridayDayCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonSaturdayDayCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonSundayDayCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonWorkingDaysNightCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonFridayNightCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonSaturdayNightCurrentYear.$touch()
          this.$v.defaultPriceHighSeasonSundayNightCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonWorkingDaysDayCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonFridayDayCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonSaturdayDayCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonSundayDayCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonWorkingDaysNightCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonFridayNightCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonSaturdayNightCurrentYear.$touch()
          this.$v.defaultPriceLowSeasonSundayNightCurrentYear.$touch()

          if (this.language === 'en') {
            this.$toasted.show('Please fill in the required fields', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Gerekli alanlari doldurunuz.', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else {
          this.showSpinner = true
          // console.log('edit the property')
          // console.log(this.property)
          // console.log(this.propertyImages)

          // Put months in two simple array
          let highSeason = []
          let lowSeason = []

          for (let i = 0; i < this.months.length; i++) {
            let month = this.months[i]
            if (month.season === 'high') {
              highSeason.push(month.id)
            }
            if (month.season === 'low') {
              lowSeason.push(month.id)
            }
          }

          let formData = {
            id: this.property.id,
            name: this.name,
            description: this.propertyData.description,
            capacity_general: this.propertyData.capacity_general,
            capacity_with_food: this.propertyData.capacity_with_food,
            minimum_deposit: this.propertyData.minimum_deposit,
            managers: JSON.stringify(this.selectedManagers),
            address: this.propertyData.address,
            lat: this.propertyData.lat,
            lng: this.propertyData.lng,
            user_id: this.user.id,
            high_season_months: JSON.stringify(highSeason),
            low_season_months: JSON.stringify(lowSeason),
            current_year: this.yearCurrent,
            next_year: this.yearNext,
            // Current year
            default_price_high_season_working_days_day_current_year: this.defaultPriceHighSeasonWorkingDaysDayCurrentYear,
            default_price_high_season_friday_day_current_year: this.defaultPriceHighSeasonFridayDayCurrentYear,
            default_price_high_season_saturday_day_current_year: this.defaultPriceHighSeasonSaturdayDayCurrentYear,
            default_price_high_season_sunday_day_current_year: this.defaultPriceHighSeasonSundayDayCurrentYear,
            default_price_high_season_working_days_night_current_year: this.defaultPriceHighSeasonWorkingDaysNightCurrentYear,
            default_price_high_season_friday_night_current_year: this.defaultPriceHighSeasonFridayNightCurrentYear,
            default_price_high_season_saturday_night_current_year: this.defaultPriceHighSeasonSaturdayNightCurrentYear,
            default_price_high_season_sunday_night_current_year: this.defaultPriceHighSeasonSundayNightCurrentYear,
            default_price_low_season_working_days_day_current_year: this.defaultPriceLowSeasonWorkingDaysDayCurrentYear,
            default_price_low_season_friday_day_current_year: this.defaultPriceLowSeasonFridayDayCurrentYear,
            default_price_low_season_saturday_day_current_year: this.defaultPriceLowSeasonSaturdayDayCurrentYear,
            default_price_low_season_sunday_day_current_year: this.defaultPriceLowSeasonSundayDayCurrentYear,
            default_price_low_season_working_days_night_current_year: this.defaultPriceLowSeasonWorkingDaysNightCurrentYear,
            default_price_low_season_friday_night_current_year: this.defaultPriceLowSeasonFridayNightCurrentYear,
            default_price_low_season_saturday_night_current_year: this.defaultPriceLowSeasonSaturdayNightCurrentYear,
            default_price_low_season_sunday_night_current_year: this.defaultPriceLowSeasonSundayNightCurrentYear,

            // Next year
            default_price_high_season_working_days_day_next_year: this.defaultPriceHighSeasonWorkingDaysDayNextYear,
            default_price_high_season_friday_day_next_year: this.defaultPriceHighSeasonFridayDayNextYear,
            default_price_high_season_saturday_day_next_year: this.defaultPriceHighSeasonSaturdayDayNextYear,
            default_price_high_season_sunday_day_next_year: this.defaultPriceHighSeasonSundayDayNextYear,
            default_price_high_season_working_days_night_next_year: this.defaultPriceHighSeasonWorkingDaysNightNextYear,
            default_price_high_season_friday_night_next_year: this.defaultPriceHighSeasonFridayNightNextYear,
            default_price_high_season_saturday_night_next_year: this.defaultPriceHighSeasonSaturdayNightNextYear,
            default_price_high_season_sunday_night_next_year: this.defaultPriceHighSeasonSundayNightNextYear,
            default_price_low_season_working_days_day_next_year: this.defaultPriceLowSeasonWorkingDaysDayNextYear,
            default_price_low_season_friday_day_next_year: this.defaultPriceLowSeasonFridayDayNextYear,
            default_price_low_season_saturday_day_next_year: this.defaultPriceLowSeasonSaturdayDayNextYear,
            default_price_low_season_sunday_day_next_year: this.defaultPriceLowSeasonSundayDayNextYear,
            default_price_low_season_working_days_night_next_year: this.defaultPriceLowSeasonWorkingDaysNightNextYear,
            default_price_low_season_friday_night_next_year: this.defaultPriceLowSeasonFridayNightNextYear,
            default_price_low_season_saturday_night_next_year: this.defaultPriceLowSeasonSaturdayNightNextYear,
            default_price_low_season_sunday_night_next_year: this.defaultPriceLowSeasonSundayNightNextYear,
          }

          if (this.propertyData.has_invoice) {
            formData.has_invoice = 1
          } else {
            formData.has_invoice = 0
          }

          if (this.user.role === 'manager') {
            formData.log = true
            formData.managerId = this.user.id
          } else if (this.user.role === 'admin') {
            formData.log = false
          }

          console.log(formData)

          this.$http.post(this.appApiPath + '/api/property_update', formData)
            .then(response => {
              console.log('success response from property_update')
              console.log(response.body)
              this.showSpinner = false

              store.dispatch({
                type: 'setAppProperties',
                properties: response.body.data.properties
              })
              this.savePropertiesInStorage(response.body.data.properties, 'admin')

              store.dispatch({
                type: 'setAppPricesList',
                pricesList: response.body.data.prices
              })
              this.$localStorage.set('pricesList', JSON.stringify(response.body.data.prices))

              router.push({ name: 'properties', params: { isAlert: true, alertType: 'create-success' } })
            }, response => {
              console.warn('error from test upload')
              console.log(response)

              this.showSpinner = false
            })
        }
      },
      openContractModal(event) {
        event.preventDefault()
        this.$refs.modalAssignContract.show()
      },
      contractAssign(event) {
        event.preventDefault()
        this.$refs.modalAssignContract.hide()
        console.log('assigning contract')
        console.log(this.contractSelected)
        let contract = {}
        for (let i = 0; i < this.contracts.length; i++) {
          if (this.contractSelected.value === this.contracts[i].id) {
            contract = this.contracts[i]
          }
        }

        if (this.propertyFormType === 'add') {
          this.propertyData.contract_id = contract.id
          this.propertyData.contract = contract
        } else if (this.propertyFormType === 'edit') {
          let formData = new FormData()
          formData.append('property_id', this.property.id)
          formData.append('contract_id', contract.id)
          formData.append('user_id', this.user.id)
          this.$http.post(this.appApiPath + '/api/property_contract_save', formData)
            .then(response => {
              console.log('success response from property_contract_save')
              console.log(response.body)

              // Update contracts
              store.dispatch({
                type: 'setAppContracts',
                contracts: response.body.data.contracts
              })
              this.saveContractsInStorage(response.body.data.contracts)
              // Update properties
              let properties = response.body.data.properties
              store.dispatch({
                type: 'setAppProperties',
                properties: properties
              })
              this.savePropertiesInStorage(properties, 'admin')
              // Update current property
              for (let i = 0; i < properties.length; i++) {
                if (properties[i].id === this.property.id) {
                  this.propertyData = properties[i]
                  store.dispatch({
                    type: 'setAppCurrentProperty',
                    currentProperty: properties[i]
                  })
                  this.saveCurrentPropertyInStorage(properties[i])
                }
              }
              // Display toast
              if (response.body.data.result) {
                if (this.$language === 'en') {
                  this.$toasted.show('Contract successfully assigned to the property!', {icon: 'fa-check-circle', type: 'success'})
                } else if (this.$language === 'tr') {
                  this.$toasted.show('Contract successfully assigned to the property!', {icon: 'fa-check-circle', type: 'success'})
                }
              }
            }, response => {
              console.warn('error from property_contract_save')
              console.log(response)
              if (this.$language === 'en') {
                this.$toasted.show('Something went wrong', {icon: 'fa-exclamation-triangle', type: 'error'})
              } else if (this.$language === 'tr') {
                this.$toasted.show('Bir hata oluştu', {icon: 'fa-exclamation-triangle', type: 'error'})
              }
            })
        }
      },
      mapRightClick(event) {
        this.propertyData.lat = event[0]
        this.propertyData.lng = event[1]
      },
      changeSeason(index, event) {
        event.preventDefault()
        if (this.months[index].season === 'high') {
          this.months[index].season = 'low'
        } else if (this.months[index].season === 'low') {
          this.months[index].season = 'high'
        }
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .btn i {
    margin-right: 5px;
  }

  .dropzoneContainer {
    margin-top: 23px;
  }

  .md-checkbox-container {
    border-color: rgba(0,0,0,.54)!important;
  }

  #greySquare {
    width: 30px;
    height: 30px;
    background-color: #A7B5D0;
    float: left;
  }

  #orangeSquare {
    width: 30px;
    height: 30px;
    background: #F9AE18;
    float: left;
  }

  .legendBlock {
    display: inline-block;
    float: left;
    width: 120px;
    margin-right: 10px;
    margin-bottom: 6px;
  }

  .legendText {
    font-weight: 300;
    font-size: 0.8rem;
    color: #777;
    vertical-align: sub;
    margin-left: 5px;
  }

  .errorContainerUnder {
    margin-top: -21px;
    margin-left: 44px;
  }

  .mt0 {
    margin-top: 0!important;
  }

  .btnSmallCustom {
    font-size: 0.825rem!important;
  }

  .seasonChooseInfo {
    display: block;
    clear: left;
    color: #777!important;
    font-weight: 300;
    margin-bottom: 5px;
  }



</style>




