export const labels = {
  data: function () {
    return {
      labelName: '',
      labelFirstName: '',
      labelLastName: '',
      labelAddress: '',
      labelCity: '',
      labelPhone: '',
      labelEmail: '',
      labelPassword: '',
      labelPasswordConfirmation: '',
      labelRole: '',
      labelMaxDiscount: '',
      labelDescription: '',
      labelCapacityGeneral: '',
      labelCapacityWithFood: '',
      labelModelName: '',
      labelModelTitle: '',
      labelModelSubtitle: '',
      labelCopyrightText: '',
      labelCost: '',
      labelFullName: '',
      labelTotalGuests: '',
      labelRegion: '',
      labelAdvance: '',
      labelNotes: '',
      labelSearch: '',
      labelDiscount: '',
      labelOldPassword: '',
      labelNewPassword: '',
      labelDaysExpiration: '',
      labelPaymentNotes: '',
      labelTotal: '',
      labelMessage: '',
      labelTotalBookings: '',
      labelDocumentId: '',
      labelTotalRefund: '',
      labelZipCode: '',
    }
  },
  created: function () {
    this.initLabel()
  },
  methods: {
    initLabel: function () {
      if (this.language === 'en') {
        this.labelName = 'Name'
        this.labelFirstName = 'First Name'
        this.labelLastName = 'Last Name'
        this.labelAddress = 'Address'
        this.labelCity = 'City'
        this.labelPhone = 'Phone'
        this.labelEmail = 'Email'
        this.labelPassword = 'Password'
        this.labelPasswordConfirmation = 'Password Confirmation'
        this.labelRole = 'Role'
        this.labelMaxDiscount = 'Max discount'
        this.labelDescription = 'Description'
        this.labelCapacityGeneral = 'Capacity general'
        this.labelCapacityWithFood = 'Capacity with food service'
        this.labelModelName = 'Model name'
        this.labelModelTitle = 'Model title'
        this.labelModelSubtitle = 'Model subtitle'
        this.labelCopyrightText = 'Copyright text'
        this.labelCost = 'Cost'
        this.labelFullName = 'Full name'
        this.labelTotalGuests = 'Total Guests'
        this.labelRegion = 'Region'
        this.labelAdvance = 'Advance'
        this.labelNotes = 'Notes'
        this.labelSearch = 'Search'
        this.labelDiscount = 'Discount'
        this.labelOldPassword = 'Old Password'
        this.labelNewPassword = 'New Password'
        this.labelDaysExpiration = 'Validity days'
        this.labelPaymentNotes = 'Payment notes'
        this.labelTotal = 'Total'
        this.labelMessage = 'Message'
        this.labelTotalBookings = 'Total Bookings'
        this.labelDocumentId = 'Passport number'
        this.labelCardHolder = 'Card holder'
        this.labelCardNumber = 'Card number'
        this.labelCardExpiry = 'Expiration date'
        this.labelCardCvc = 'Cvc'
        this.labelPropertyName = 'Property Name'
        this.labelMinimumDeposit = 'Minimum Deposit'
        this.labelTotalRefund = 'Total refund'
        this.labelZipCode = 'Zip Code'
      } else if (this.language === 'tr') {
        this.labelName = 'Adı'
        this.labelFirstName = 'Adı'
        this.labelLastName = 'Soyadı'
        this.labelAddress = 'Adres'
        this.labelCity = 'Şehir'
        this.labelPhone = 'Telefon'
        this.labelEmail = 'E-posta'
        this.labelPassword = 'Şifre'
        this.labelPasswordConfirmation = 'Şifre onayı'
        this.labelRole = 'Yetki'
        this.labelMaxDiscount = 'Maks İndirim'
        this.labelDescription = 'Açıklama'
        this.labelCapacityGeneral = 'Yemeksiz kapasite'
        this.labelCapacityWithFood = 'Yemekli kapasite'
        this.labelModelName = 'Sözleşme Tipi'
        this.labelModelTitle = 'Sözleşme başlığı'
        this.labelModelSubtitle = 'Sözleşme altbaşlığı'
        this.labelCopyrightText = 'Sözleşme sonu detayları'
        this.labelCost = 'Fiyat'
        this.labelFullName = 'Adı Soyadı'
        this.labelTotalGuests = 'Misafir sayısı'
        this.labelRegion = 'Yöre'
        this.labelAdvance = 'Alınan Kapora'
        this.labelNotes = 'Notlar'
        this.labelSearch = 'Ara'
        this.labelDiscount = 'İndirim'
        this.labelOldPassword = 'Eski şifre'
        this.labelNewPassword = 'Yeni şifre'
        this.labelDaysExpiration = 'Geçerli Günler'
        this.labelPaymentNotes = 'Ödeme notları'
        this.labelTotal = 'Toplam'
        this.labelMessage = 'Mesaj'
        this.labelTotalBookings = 'Toplam rezervasyonlar'
        this.labelDocumentId = 'T.C. Kimlik No.'
        this.labelCardHolder = 'Kart sahibi'
        this.labelCardNumber = 'Kart numarası'
        this.labelCardExpiry = 'Son kullanma tarihi'
        this.labelCardCvc = 'Cvc'
        this.labelPropertyName = 'İşletme adı'
        this.labelMinimumDeposit = 'Minimum Deposit'
        this.labelTotalRefund = 'Total refund'
        this.labelZipCode = 'Zip Code'
      }
    }
  }
}
