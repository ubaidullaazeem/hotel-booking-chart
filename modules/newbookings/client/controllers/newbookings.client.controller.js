(function() {
  'use strict';

  // Newbookings controller
  angular
    .module('newbookings')
    .controller('NewbookingsController', NewbookingsController);

  NewbookingsController.$inject = ['AuthenticationService', 'CGST', 'SGST', 'DATA_BACKGROUND_COLOR', 'EmailBookingServices', 'HARDCODE_VALUES', 'PAYMENT_STATUS', '$filter', '$scope', '$state', 'selectedEvent', '$location', '$mdDialog', '$templateRequest', '$sce', 'NewbookingsService', 'selectedDate', 'HallsService', 'EventtypesService', 'TaxesService', 'PaymentstatusesService', 'Notification', '$mdpTimePicker', '$mdpDatePicker', 'PAY_MODES', 'CommonService', 'ValidateOverlapBookingServices', 'viewMode', 'GOOGLE_CALENDAR_COLOR_IDS', 'Upload', '$timeout', 'RupeeWords', '$rootScope', 'isPastReceiptEffectiveDate', 'isPastInvoiceEffectiveDate', 'BILL_TYPES'];

  function NewbookingsController(AuthenticationService, CGST, SGST, DATA_BACKGROUND_COLOR, EmailBookingServices, HARDCODE_VALUES, PAYMENT_STATUS, $filter, $scope, $state, selectedEvent, $location, $mdDialog, $templateRequest, $sce, NewbookingsService, selectedDate, HallsService, EventtypesService, TaxesService, PaymentstatusesService, Notification, $mdpTimePicker, $mdpDatePicker, PAY_MODES, CommonService, ValidateOverlapBookingServices, viewMode, GOOGLE_CALENDAR_COLOR_IDS, Upload, $timeout, RupeeWords, $rootScope, isPastReceiptEffectiveDate, isPastInvoiceEffectiveDate, BILL_TYPES) {
    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    var cgstPercent = 0;
    var sgstPercent = 0;
    var totalCostToDiscountProrate = 0;
    var pendingSubTotalPercentage = 0;
    var pendingCGSTPercentage = 0;
    var pendingSGSTPercentage = 0;
    var hallsNotInGoogleCalendar = '';
    var isShownHallsNotInGoogleCalendar = false;

    $scope.model = {
      halls: HallsService.query(),
      filteredHalls: [],
      eventTypes: EventtypesService.query(),
      paymentStatuses: PaymentstatusesService.query(),
      taxes: TaxesService.query(),
      paymentModes: PAY_MODES,
      selectedEventSelectedHalls: selectedEvent ? angular.copy(selectedEvent.mSelectedHalls) : [],
      BILL_TYPES: BILL_TYPES
    };

    setInitialScopeData(true);


    function setInitialScopeData(isFromBookings) {

      cgstPercent = 0;
      sgstPercent = 0;
      totalCostToDiscountProrate = 0;
      pendingSubTotalPercentage = 0;
      pendingCGSTPercentage = 0;
      pendingSGSTPercentage = 0;
      hallsNotInGoogleCalendar = '';
      isShownHallsNotInGoogleCalendar = false;

      $scope.ui = {
        mSelectedDateToDisplay: moment(selectedDate).format('DD-MMMM-YYYY'),
        mPricePattern: /^[0-9]+(\.[0-9]{1,2})?$/,
        mEmailPattern: /^.+@.+\..+$/,
        mNumberPattern: /^[0-9]*$/,
        createMode: true,
        showMdSelect: true,
        mailsending: false,
        viewMode: viewMode,
        isActualChargesView: false,
        isBookingInProgress: false,
        isPastEvent: selectedEvent ? moment(selectedEvent.mStartDateTime) < moment(new Date().setHours(0, 0, 0, 0)) : true,
        isFullyPaid: selectedEvent ? selectedEvent.mSelectedPaymentStatus.name === PAYMENT_STATUS[1] : false,
        photoIdFile: '',
        isDataChanged: false,
        isPageLoadingDone: false,
        isPastReceiptEffectiveDate: isPastReceiptEffectiveDate,
        isPastInvoiceEffectiveDate: isPastInvoiceEffectiveDate
      };

      $scope.model.selectedEventSelectedHalls = selectedEvent ? angular.copy(selectedEvent.mSelectedHalls) : [];

      $scope.mPaymentHistory = {
        amountPaid: null,
        paidDate: new Date(),
        paymentMode: null,
        details: '',
        drawnOn: '',
        CGSTPercent: 0,
        SGSTPercent: 0,
        paidSubTotal: 0,
        paidCGST: 0,
        paidSGST: 0,
        isDeletedPayment: false,
        receiptNo: null,
        receiptDate: new Date(),
        isSendingMail: false
      };

      $scope.PAYMENT_STATUS = PAYMENT_STATUS;

      $scope.taxableChargesBeforeDiscount = 0;

      $scope.mixins = {
        _id: selectedEvent ? selectedEvent._id : undefined,
        mSelectedHalls: selectedEvent ? selectedEvent.mSelectedHalls : [],
        mSelectedEventType: selectedEvent ? selectedEvent.mSelectedEventType : null,
        mOtherEvent: selectedEvent ? selectedEvent.mOtherEvent : null,
        mDescription: selectedEvent ? selectedEvent.mDescription : null,
        mName: selectedEvent ? selectedEvent.mName : null,
        mPhone: selectedEvent ? selectedEvent.mPhone : null,
        mEmail: selectedEvent ? selectedEvent.mEmail : null,
        mAddress: selectedEvent ? selectedEvent.mAddress : null,
        mGSTINNumber: selectedEvent ? selectedEvent.mGSTINNumber : null,
        mPhotoId: selectedEvent ? selectedEvent.mPhotoId : null,
        mPhotoIdPath: selectedEvent ? selectedEvent.mPhotoIdPath : null,
        mSelectedPaymentStatus: selectedEvent ? selectedEvent.mSelectedPaymentStatus : null,
        mManagerName: selectedEvent ? selectedEvent.mManagerName : null,
        mDiscount: selectedEvent ? selectedEvent.mDiscount : 0,
        mSubTotal: selectedEvent ? selectedEvent.mSubTotal : 0,
        mCGST: selectedEvent ? selectedEvent.mCGST : 0,
        mSGST: selectedEvent ? selectedEvent.mSGST : 0,
        mGrandTotal: selectedEvent ? selectedEvent.mGrandTotal : 0,
        mPaymentHistories: selectedEvent ? selectedEvent.mPaymentHistories : [],
        mBalanceDue: selectedEvent ? selectedEvent.mBalanceDue : 0,
        mPendingSubTotal: selectedEvent ? selectedEvent.mPendingSubTotal : 0,
        mReceivedSubTotal: selectedEvent ? selectedEvent.mReceivedSubTotal : 0,
        mPendingCGST: selectedEvent ? selectedEvent.mPendingCGST : 0,
        mReceivedCGST: selectedEvent ? selectedEvent.mReceivedCGST : 0,
        mPendingSGST: selectedEvent ? selectedEvent.mPendingSGST : 0,
        mReceivedSGST: selectedEvent ? selectedEvent.mReceivedSGST : 0,
        mPendingGrandTotal: selectedEvent ? selectedEvent.mPendingGrandTotal : 0,
        mReceivedGrandTotal: selectedEvent ? selectedEvent.mReceivedGrandTotal : 0,
        invoiceNo: selectedEvent ? selectedEvent.invoiceNo : undefined,
        invoiceDate: selectedEvent ? selectedEvent.invoiceDate : undefined,
        bookingFormData: selectedEvent ? selectedEvent.bookingFormData : undefined
      };

      $scope.googleCalendar = {
        colorCode: selectedEvent ? ((selectedEvent.mSelectedPaymentStatus.name === PAYMENT_STATUS[1]) ? GOOGLE_CALENDAR_COLOR_IDS.RED : GOOGLE_CALENDAR_COLOR_IDS.GREEN) : GOOGLE_CALENDAR_COLOR_IDS.GREEN
      };

      $scope.eventTime = {
        mStartClock: selectedEvent ? new Date(selectedEvent.mStartDateTime) : new Date('1991-05-04T06:00:00'),
        mEndClock: selectedEvent ? new Date(selectedEvent.mEndDateTime) : new Date('1991-05-04T13:00:00'),
        mStartToDisplay: selectedEvent ? getTimeToDisplay(new Date(selectedEvent.mStartDateTime)) : getTimeToDisplay(new Date('1991-05-04T06:00:00')),
        mEndToDisplay: selectedEvent ? getTimeToDisplay(new Date(selectedEvent.mEndDateTime)) : getTimeToDisplay(new Date('1991-05-04T13:00:00')),
        mStartToServer: selectedEvent ? getTimeToServer(new Date(selectedEvent.mStartDateTime)) : getTimeToServer(new Date('1991-05-04T06:00:00')),
        mEndToServer: selectedEvent ? getTimeToServer(new Date(selectedEvent.mEndDateTime)) : getTimeToServer(new Date('1991-05-04T13:00:00'))
      };

      if (!isFromBookings) {
        calculateHallsRate();
        $scope.calculateBalanceDue();
      }
    }

    $scope.$watch('mixins.mSelectedHalls', function(newValue) {
      calculateHallsRate();
      $scope.calculateBalanceDue();
    }, true);

    // Fetch the Terms and conditions
    var templateUrl = $sce.getTrustedResourceUrl('/modules/newbookings/client/views/templates/newbookings-terms-and-conditions.html');

    $templateRequest(templateUrl).then(function(template) {
      $scope.termsAndConditions = template;
    });

    // For disabling the scroll behaviour in number input field
    $(document).on("wheel", "input[type=number]", function(e) {
      $(this).blur();
    });

    $scope.selectedHallsChanged = function() {
      $scope.mixins.mSelectedHalls = _.uniqBy($scope.mixins.mSelectedHalls, '_id');

      angular.forEach($scope.mixins.mSelectedHalls, function(hall) {
        /** Ubai New Code Start **/
        var selectedHalls = [];
        if (selectedEvent) {
          selectedHalls = _.filter(selectedEvent.mSelectedHalls, function(mSelectedHall) {
            return mSelectedHall._id === hall._id;
          });
        }
        /** End **/
        var effectiveSummaries = CommonService.findRateSummariesByDate(hall.rateSummaries, new Date($scope.eventTime.mStartToServer));
        if (effectiveSummaries.length > 0) {
          /** Ubai New Code Start **/
          hall.mBasicCost = selectedHalls.length > 0 ? selectedHalls[0].mBasicCost : effectiveSummaries[0].rate;
          hall.mElectricityCharges = selectedHalls.length > 0 ? selectedHalls[0].mElectricityCharges : effectiveSummaries[0].powerConsumpationCharges;
          hall.mActualElectricityCharges = selectedHalls.length > 0 ? selectedHalls[0].mActualElectricityCharges : 0;
          hall.mActualCleaningCharges = selectedHalls.length > 0 ? selectedHalls[0].mActualCleaningCharges : 0;
          hall.mDamages = selectedHalls.length > 0 ? selectedHalls[0].mDamages : 0;
          hall.mCleaningCharges = selectedHalls.length > 0 ? selectedHalls[0].mCleaningCharges : effectiveSummaries[0].cleaningCharges;
          hall.mGeneratorCharges = selectedHalls.length > 0 ? selectedHalls[0].mGeneratorCharges : 0;
          hall.mMiscellaneousCharges = selectedHalls.length > 0 ? selectedHalls[0].mMiscellaneousCharges : 0;
          /** End **/
          if (selectedHalls.length > 0 && selectedHalls[0].mCalendarId && selectedHalls[0].mEventId) {
            hall.mCalendarId = selectedHalls[0].mCalendarId;
            hall.mEventId = selectedHalls[0].mEventId;
          }
        } else {
          Notification.error({
            message: 'Effective date is not found for ' + hall.displayName,
            title: '<i class="glyphicon glyphicon-remove"></i> Effective date Error'
          });
          $mdDialog.cancel();
        }
      });

      calculateHallsRate();
      $scope.calculateBalanceDue();
    };

    $scope.$watch('mixins.mBalanceDue', function() {
      setSelectedPaymentStatus();
    }, true);

    function setSelectedPaymentStatus() {
      if (Number($scope.mixins.mBalanceDue) === 0 && $scope.mixins.mSelectedHalls.length > 0) //Fully Paid
      {
        var fullyPaid = _.filter($scope.model.paymentStatuses, function(obj) {
          return obj.name === PAYMENT_STATUS[1];
        });

        $scope.mixins.mSelectedPaymentStatus = fullyPaid[0];
        $scope.googleCalendar.colorCode = GOOGLE_CALENDAR_COLOR_IDS.RED;
      } else //Advance Paid
      {
        var advancePaid = _.filter($scope.model.paymentStatuses, function(obj) {
          return obj.name === PAYMENT_STATUS[0];
        });

        $scope.mixins.mSelectedPaymentStatus = advancePaid[0];
        $scope.googleCalendar.colorCode = GOOGLE_CALENDAR_COLOR_IDS.GREEN;
      }
    }

    $scope.getOtherEvents = function() {
      var events = _.filter($scope.model.eventTypes, function(eventType) {
        return eventType.name === HARDCODE_VALUES[0];
      });
      return events[0];
    };

    $scope.showStartTimePicker = function(ev) {
      $mdpTimePicker($scope.eventTime.mStartClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mStartClock = dateTime;
          $scope.eventTime.mStartToDisplay = getTimeToDisplay(dateTime);
          $scope.eventTime.mStartToServer = getTimeToServer(dateTime);

          validateStartAndEndTime();

          $scope.ui.isDataChanged = true;
        });
    };

    $scope.showEndTimePicker = function(ev) {
      $mdpTimePicker($scope.eventTime.mEndClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mEndClock = dateTime;
          $scope.eventTime.mEndToDisplay = getTimeToDisplay(dateTime);
          $scope.eventTime.mEndToServer = getTimeToServer(dateTime);

          validateStartAndEndTime();

          $scope.ui.isDataChanged = true;
        });
    };

    $scope.onPaymentModeChanged = function() {
      if ($scope.mPaymentHistory.paymentMode !== $scope.model.paymentModes[0] && $scope.mPaymentHistory.paidDate > new Date()) {
        $scope.mPaymentHistory.paidDate = new Date();
      }

      if ($scope.mPaymentHistory.paymentMode === $scope.model.paymentModes[2]) {
        $scope.mPaymentHistory.details = '';
        $scope.mPaymentHistory.drawnOn = '';
      }
    };

    $scope.showPaidDatePicker = function(ev) {

      if ($scope.mPaymentHistory.paymentMode) {

        var maxDate = $scope.mPaymentHistory.paymentMode !== $scope.model.paymentModes[0] ? new Date() : null;

        var dateToPicker = $scope.mPaymentHistory.paidDate ? new Date($scope.mPaymentHistory.paidDate) : new Date();

        $mdpDatePicker(dateToPicker, {
          targetEvent: ev,
          maxDate: maxDate
        }).then(function(date) {
          $scope.mPaymentHistory.paidDate = new Date(date);
        });
      } else {
        Notification.info({
          message: 'Please select payment mode.',
          title: '<i class="glyphicon glyphicon-remove"></i> Payment Mode'
        });
      }
    };

    $scope.showEventDatePicker = function(ev) {
      var today = new Date();
      today.setDate(today.getDate() - 1);
      $mdpDatePicker(new Date(selectedDate), {
        targetEvent: ev,
        minDate: today
      }).then(function(date) {
        $scope.ui.isDataChanged = true;

        selectedDate = date;
        var startTime = new Date($scope.ui.createMode ? $scope.eventTime.mStartToServer : selectedEvent.mStartDateTime);
        var startTimeFormat = new Date(date).setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
        var endTime = new Date($scope.ui.createMode ? $scope.eventTime.mEndToServer : selectedEvent.mEndDateTime);
        var endTimeFormat = new Date(date).setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
        var dtGMTStart = new Date((new Date(startTimeFormat)).toUTCString()).toISOString();
        var dtGMTEnd = new Date((new Date(endTimeFormat)).toUTCString()).toISOString();
        $scope.eventTime.mStartToDisplay = getTimeToDisplay(new Date(startTimeFormat));
        $scope.eventTime.mEndToDisplay = getTimeToDisplay(new Date(endTimeFormat));
        $scope.eventTime.mStartToServer = dtGMTStart;
        $scope.eventTime.mEndToServer = dtGMTEnd;
        $scope.ui.mSelectedDateToDisplay = moment(date).format('DD-MMMM-YYYY');

        getCommonHalls();

        calculateTaxRate();
        $scope.selectedHallsChanged();
      });
    };

    function getEventName() {
      var eventName = ($scope.mixins.mSelectedEventType.name.toLowerCase().trim() === HARDCODE_VALUES[0]) ? $scope.mixins.mOtherEvent : $scope.mixins.mSelectedEventType.displayName;

      return eventName;
    }

    function getConfirmedEventName() {
      var eventName = (selectedEvent.mSelectedEventType.name.toLowerCase().trim() === HARDCODE_VALUES[0]) ? selectedEvent.mOtherEvent : selectedEvent.mSelectedEventType.displayName;

      return eventName;
    }

    $scope.printBooking = function(form, billType, index) {
      if (form.$valid) {

        var documentContent;
        switch (billType) {
          case BILL_TYPES[0]:
            documentContent = getBookingFormData(true);
            break;
          case BILL_TYPES[1]:
            documentContent = getReceiptData(index, true);
            break;
          case BILL_TYPES[2]:
            documentContent = getInvoiceData(true);
            break;

          default:
            return;
        }

        printElement(document.getElementById('printThis'));
        var printContents = document.getElementById('printSection').innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write(documentContent);
        popupWin.document.close();
      }
    };

    function printElement(elem) {
      var domClone = elem.cloneNode(true);
      var $printSection = document.getElementById('printSection');

      if (!$printSection) {
        var $printSection = document.createElement('div');
        $printSection.id = 'printSection';
        $($printSection).hide();
        document.body.appendChild($printSection);
      }

      $printSection.innerHTML = '';
      $printSection.appendChild(domClone);
    }

    function getBookingFormData(isPrint) {
      var baseUrl = $location.$$absUrl.replace($location.$$url, '');
      var halls = _.map(selectedEvent.mSelectedHalls, 'displayName');
      var fontSize = isPrint ? '16px' : '12px';

      return '<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head>' +
        '<body onload="window.print()"><html><head> <title>Mirth</title></head>' +
        '<body><html><head><style type="text/css">td { font-size: '+fontSize+'; }</style> <title>Mirth</title></head>' +
        '<body><div><div>' +
        '<table width="100%" style="border-collapse: collapse; border: 1px solid black; table-layout: fixed;" cellspacing="0" cellpadding="0"> <tbody>' +
        '<tr style="border-bottom: 1px solid black; text-align:center;"><td width="100%"><img style="width: 150px;" src="' + baseUrl + '/modules/core/client/img/logo-bw.png"/></td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr><td width="60%" rowspan="2" style="border-right: 1px solid black;">Dev&apos;s Ark, Second Floor, AD-79&80, 5th Avenue<br/> Anna Nagar, Chennai - 600 040<br/> Phone Nos : 044-45552479 / 044-26222479</td><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Date</b></td><td width="25%" style="border-bottom: 1px solid black;">'+ moment(selectedEvent.bookingFormData.bookedDate).format('DD/MM/YYYY')+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black;"><b>GSTIN No.</b></td><td width="25%">33AAFPJ8706K1ZM</td></tr>'+
          '</table></td></tr>'+
        '<tr style="border-bottom: 1px solid black; text-align:center;"><td width="100%"><b>BOOKING DETAILS</b></td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr style="vertical-align:top;"><td width="50%"><b>Name</b></td><td width="50%">'+selectedEvent.mName+'</td></tr>'+
            '<tr style="vertical-align:top;"><td width="50%"><b>Address</b></td><td width="50%">'+selectedEvent.mAddress+'</td></tr>'+
            '<tr style="vertical-align:top;"><td width="50%"><b>GSTIN #</b></td><td width="50%">'+getValidValue(selectedEvent.mGSTINNumber)+'</td></tr>'+
            '<tr style="vertical-align:top;"><td width="50%"><b>Contact #</b></td><td width="50%">'+selectedEvent.mPhone+'</td></tr>'+
            '<tr style="vertical-align:top;"><td width="50%"><b>Email I.D</b></td><td width="50%">'+getValidValue(selectedEvent.mEmail)+'</td></tr>'+
            '<tr style="vertical-align:top;"><td width="50%"><b>Purpose for which auditorium required</b></td><td width="50%">'+getConfirmedEventName()+'</td></tr>'+
            '<tr style="vertical-align:top;"><td width="50%"><b>Function’s date & time</b></td><td width="50%">'+moment(new Date(selectedEvent.mStartDateTime)).format('MMMM DD, YYYY hh:mm:a')+' to '+moment(new Date(selectedEvent.mEndDateTime)).format('hh:mm:a')+'</td></tr>'+
            '<tr style="vertical-align:top;"><td width="50%"><b>Payment Mode (Cheque/DD/Cash/NEFT)</b></td><td width="50%">'+selectedEvent.bookingFormData.paymentHistory.paymentMode+' '+selectedEvent.bookingFormData.paymentHistory.details+', '+moment(selectedEvent.bookingFormData.paymentHistory.paidDate).format('DD/MM/YYYY')+'</td></tr>'+
            '<tr style="vertical-align:top;"><td width="50%"><b>Halls</b></td><td width="50%">'+halls+'</td></tr>'+
            '<tr style="vertical-align:top;"><td width="50%"><b>Description</b></td><td width="50%">'+getValidValue(selectedEvent.mDescription)+'</td></tr>'+
          '</table></td></tr>'+
        '<tr style="border-bottom: 1px solid black; text-align:center;"><td width="100%"><b>DETAILS OF CHARGES</b></td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr style="border-bottom: 1px solid black;">'+
              '<td width="17%" style="border-right: 1px solid black;"><b>Rent & other charges</b></td>'+
              '<td width="16%" style="border-right: 1px solid black;"><b>CGST ('+selectedEvent.bookingFormData.paymentHistory.CGSTPercent+'%)</b></td>'+
              '<td width="16%" style="border-right: 1px solid black;"><b>SGST('+selectedEvent.bookingFormData.paymentHistory.SGSTPercent+'%)</b></td>'+
              '<td width="17%" style="border-right: 1px solid black;"><b>Grand Total</b></td>'+
              '<td width="17%" style="border-right: 1px solid black;"><b>Advance Received</b></td>'+
              '<td width="17%"><b>Balance Due</b></td>'+
            '</tr>'+
            '<tr>'+
              '<td width="17%" style="border-right: 1px solid black;">'+selectedEvent.bookingFormData.subTotal+'</td>'+
              '<td width="16%" style="border-right: 1px solid black;">'+selectedEvent.bookingFormData.cgst+'</td>'+
              '<td width="16%" style="border-right: 1px solid black;">'+selectedEvent.bookingFormData.sgst+'</td>'+
              '<td width="17%" style="border-right: 1px solid black;">'+selectedEvent.bookingFormData.grandTotal+'</td>'+
              '<td width="17%" style="border-right: 1px solid black;">'+Number(selectedEvent.bookingFormData.paymentHistory.amountPaid).toFixed(2)+'</td>'+
              '<td width="17%">'+selectedEvent.bookingFormData.balanceDue+'</td>'+
            '</tr>'+
          '</table></td></tr>'+
        '<tr height="5px"><td> </td></tr>'+
        '<tr><td>For Mirth</td></tr>'+
        '<tr height="25px"><td> </td></tr>'+
        '<tr><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr><td width="50%">Authorized Signatory</td><td width="50%" style="text-align:right;">Signature of the Guest</td></tr>'+
          '</table></td></tr>'+
        '</tbody></table>' +
        '</div>' + $scope.termsAndConditions + '</div>' +
        '</body></html></body></html></body></html>';
    }

    function getReceiptData(index, isPrint) {
      var baseUrl = $location.$$absUrl.replace($location.$$url, '');
      var halls = _.map(selectedEvent.mSelectedHalls, 'displayName');
      
      var paymentHistory = $scope.mixins.mPaymentHistories[index];
      var isFinalPayment = $scope.ui.isFullyPaid && (paymentHistory.receiptNo === getLastInsertedPayment().receiptNo) ? true : false;
      var fontSize = isPrint ? '16px' : '12px';
      
      return '<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head>' +
        '<body onload="window.print()"><html><head> <title>Mirth</title></head>' +
        '<body><html><head><style type="text/css">td { font-size: '+fontSize+'; }</style> <title>Mirth</title></head>' +
        '<body>' +
        '<table width="100%" style="border-collapse: collapse; border: 1px solid black; table-layout: fixed;" cellspacing="0" cellpadding="0"> <tbody>' +
        '<tr style="border-bottom: 1px solid black; text-align:center;"><td width="100%"><img style="width: 110px;" src="' + baseUrl + '/modules/core/client/img/logo-bw.png"/></td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr><td width="60%" rowspan="2" style="border-right: 1px solid black;">Dev&apos;s Ark, Second Floor, AD-79&80, 5th Avenue<br/> Anna Nagar, Chennai - 600 040<br/> Phone Nos : 044-45552479 / 044-26222479</td><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Date</b></td><td width="25%" style="border-bottom: 1px solid black;">'+ moment(new Date(paymentHistory.receiptDate)).format('DD/MM/YYYY')+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black;"><b>GSTIN No.</b></td><td width="25%">33AAFPJ8706K1ZM</td></tr>'+
          '</table></td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr style="vertical-align:top;"><td width="60%" rowspan="6" style="border-right: 1px solid black;"><b>Customer Name : </b>'+selectedEvent.mName+'<br/><b>Customer Address : </b>'+selectedEvent.mAddress+'<br/><b>Customer GSTIN # : </b>'+getValidValue(selectedEvent.mGSTINNumber)+'</td><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Receipt #</b></td><td width="25%" style="border-bottom: 1px solid black;">'+paymentHistory.receiptNo+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Hall Name</b></td><td width="25%" style="border-bottom: 1px solid black;">'+halls+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Purpose</b></td><td width="25%" style="border-bottom: 1px solid black;">'+getConfirmedEventName()+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Event Date</b></td><td width="25%" style="border-bottom: 1px solid black;">'+moment(new Date(selectedEvent.mStartDateTime)).format('DD/MM/YYYY')+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Start Time</b></td><td width="25%" style="border-bottom: 1px solid black;">'+moment(new Date(selectedEvent.mStartDateTime)).format('hh:mm:a')+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black;"><b>End Time</b></td><td width="25%">'+moment(new Date(selectedEvent.mEndDateTime)).format('hh:mm:a')+'</td></tr>'+
          '</table></td></tr>'+
        '<tr style="border-bottom: 1px solid black; text-align:center;"><td width="100%"><b>RECEIPT DETAILS</b></td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr style="border-bottom: 1px solid black;">'+
              '<td width="10%" style="border-right: 1px solid black;"><b>Sl.No.</b></td>'+
              '<td width="45%" style="border-right: 1px solid black;"><b>Particulars</b></td>'+
              '<td width="15%" style="border-right: 1px solid black;"><b>Amount</b></td>'+
              '<td width="15%" style="border-right: 1px solid black;"><b>CGST @'+paymentHistory.CGSTPercent+'%</b></td>'+
              '<td width="15%"><b>SGST @'+paymentHistory.SGSTPercent+'%</b></td>'+
            '</tr>'+
            '<tr>'+
              '<td width="10%" style="border-right: 1px solid black;">1</td>'+
              '<td width="45%" style="border-right: 1px solid black;">Rent Received for '+halls+'</td>'+
              '<td width="15%" style="border-right: 1px solid black;">'+paymentHistory.paidSubTotal+'</td>'+
              '<td width="15%" style="border-right: 1px solid black;">'+paymentHistory.paidCGST+'</td>'+
              '<td width="15%">'+paymentHistory.paidSGST+'</td>'+
            '</tr>'+
          '</table></td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr style="border-bottom: 1px solid black;">'+
              '<td width="85%" colspan="2" style="border-right: 1px solid black;"><b>Total </b>(Rupees '+RupeeWords.getRupeesToWords(Number(paymentHistory.amountPaid))+' only)</td>'+
              '<td width="15%">'+Number(paymentHistory.amountPaid).toFixed(2)+'</td>'+
            '</tr>'+
            '<tr style="border-bottom: 1px solid black;">'+
              '<td width="43%" style="border-right: 1px solid black;"><b>Cash/Cheque/Draft No. & Date</b></td>'+
              '<td width="42%" style="border-right: 1px solid black;"><b>Drawn on</b></td>'+
              '<td width="15%"><b>Amount</b></td>'+
            '</tr>'+
            '<tr>'+
              '<td width="43%" style="border-right: 1px solid black;">'+paymentHistory.paymentMode+' '+paymentHistory.details+' dt '+moment(new Date(paymentHistory.paidDate)).format('DD/MM/YYYY')+'</td>'+
              '<td width="42%" style="border-right: 1px solid black;">'+(paymentHistory.drawnOn != '' ? paymentHistory.drawnOn : 'N/A')+'</td>'+
              '<td width="15%">'+Number(paymentHistory.amountPaid).toFixed(2)+'</td>'+
            '</tr>'+
          '</table></td></tr>'+
        '<tr><td><b>Narration </b><input type="radio" value="Advance" '+(!isFinalPayment ? 'checked' : 'unchecked')+'> '+(isFinalPayment ? 'Advance' : '<b>Advance</b>' )+'<input type="radio" value="Final" '+(isFinalPayment ? 'checked' : 'unchecked')+'> '+(isFinalPayment ? '<b>Final Payment</b>' : 'Final Payment' )+'</td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td>Being '+paymentHistory.paymentMode+' received towards '+(isFinalPayment ? 'final payment' : 'advance')+' for the above hall and event</td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td><b>Note :</b> Booking will be confirmed only on the receipt of full and final payment</td></tr>'+
        '<tr><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr><td width="75%"></td><td width="25%"><b>For Mirth</b></td></tr>'+
            '<tr height="22px"><td></td><td></td></tr>'+
            '<tr><td width="75%"></td><td width="25%"><b>Authorized Signatory</b></td></tr>'+
          '</table></td></tr>'+
        '</tbody></table>' +        
        '</body></html></body></html></body></html>';
            
    }

    function getInvoiceData(isPrint) {
      var baseUrl = $location.$$absUrl.replace($location.$$url, '');
      var halls = _.map(selectedEvent.mSelectedHalls, 'displayName');
      var fontSize = isPrint ? '16px' : '12px';

      return '<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head>' +
        '<body onload="window.print()"><html><head> <title>Mirth</title></head>' +
        '<body><html><head><style type="text/css">td { font-size: '+fontSize+'; }</style> <title>Mirth</title></head>' +
        '<body>' +
        '<table width="100%" style="border-collapse: collapse; border: 1px solid black; table-layout: fixed;" cellspacing="0" cellpadding="0"> <tbody>' +
        '<tr style="border-bottom: 1px solid black; text-align:center;"><td width="100%"><img style="width: 150px;" src="' + baseUrl + '/modules/core/client/img/logo-bw.png"/></td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr><td width="60%" rowspan="2" style="border-right: 1px solid black;">Dev&apos;s Ark, Second Floor, AD-79&80, 5th Avenue<br/> Anna Nagar, Chennai - 600 040<br/> Phone Nos : 044-45552479 / 044-26222479</td><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Date</b></td><td width="25%" style="border-bottom: 1px solid black;">'+ moment(new Date(selectedEvent.invoiceDate)).format('DD/MM/YYYY')+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black;"><b>GSTIN No.</b></td><td width="25%">33AAFPJ8706K1ZM</td></tr>'+
          '</table></td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr style="vertical-align:top;"><td width="60%" rowspan="6" style="border-right: 1px solid black;"><b>Customer Name : </b>'+selectedEvent.mName+'<br/><b>Customer Address : </b>'+selectedEvent.mAddress+'<br/><b>Customer GSTIN # : </b>'+getValidValue(selectedEvent.mGSTINNumber)+'</td><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Invoice #</b></td><td width="25%" style="border-bottom: 1px solid black;">'+selectedEvent.invoiceNo+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Hall Name</b></td><td width="25%" style="border-bottom: 1px solid black;">'+halls+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Purpose</b></td><td width="25%" style="border-bottom: 1px solid black;">'+getConfirmedEventName()+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Event Date</b></td><td width="25%" style="border-bottom: 1px solid black;">'+moment(new Date(selectedEvent.mStartDateTime)).format('DD/MM/YYYY')+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black; border-bottom: 1px solid black;"><b>Start Time</b></td><td width="25%" style="border-bottom: 1px solid black;">'+moment(new Date(selectedEvent.mStartDateTime)).format('hh:mm:a')+'</td></tr>'+
            '<tr><td width="15%" style="border-right: 1px solid black;"><b>End Time</b></td><td width="25%">'+moment(new Date(selectedEvent.mEndDateTime)).format('hh:mm:a')+'</td></tr>'+
          '</table></td></tr>'+
        '<tr style="border-bottom: 1px solid black; text-align:center;"><td width="100%"><b>INVOICE DETAILS</b></td></tr>'+
        '<tr><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr style="border-bottom: 1px solid black;">'+
              '<td width="10%" style="border-right: 1px solid black;"><b>Sl.No.</b></td>'+
              '<td width="48%" style="border-right: 1px solid black;"><b>Particulars</b></td>'+
              '<td width="8%" style="border-right: 1px solid black;"><b>Units</b></td>'+
              '<td width="8%" style="border-right: 1px solid black;"><b>Qty</b></td>'+
              '<td width="8%" style="border-right: 1px solid black;"><b>Rate</b></td>'+
              '<td width="18%"><b>Amount</b></td>'+
            '</tr>'+
            '<tr>'+
              '<td width="10%" style="border-right: 1px solid black;"></td>'+
              '<td width="48%" style="border-right: 1px solid black;"><b>HSN CODE : 997212</b></td>'+
              '<td width="8%" style="border-right: 1px solid black;"></td>'+
              '<td width="8%" style="border-right: 1px solid black;"></td>'+
              '<td width="8%" style="border-right: 1px solid black;"></td>'+
              '<td width="18%"></td>'+
            '</tr>'+getPaymentHistoryRowsToInvoice(halls)+
          '</table></td></tr>'+
        '<tr><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr style="border-bottom: 1px solid black;">'+
              '<td width="82%" style="border-right: 1px solid black;"><b>Total </b>(Rupees '+RupeeWords.getRupeesToWords(Number(selectedEvent.mGrandTotal))+' only)</td>'+
              '<td width="18%" style="text-align:right;">'+Number(selectedEvent.mGrandTotal).toFixed(2)+'</td>'+
            '</tr>'+
          '</table></td></tr>'+
        '<tr style="border-bottom: 1px solid black; text-align:center;"><td width="100%"><b>PAYMENT SUMMARY</b></td></tr>'+
        '<tr style="border-bottom: 1px solid black;"><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr style="border-bottom: 1px solid black;">'+
              '<td width="17%" style="border-right: 1px solid black;"><b>Rent & other charges</b></td>'+
              '<td width="16%" style="border-right: 1px solid black;"><b>CGST</b></td>'+
              '<td width="16%" style="border-right: 1px solid black;"><b>SGST</b></td>'+
              '<td width="17%" style="border-right: 1px solid black;"><b>Grand Total</b></td>'+
              '<td width="17%" style="border-right: 1px solid black;"><b>Advance Received</b></td>'+
              '<td width="17%"><b>Balance Due</b></td>'+
            '</tr>'+
            '<tr>'+
              '<td width="17%" style="border-right: 1px solid black;">'+Number(selectedEvent.mSubTotal).toFixed(2)+'</td>'+
              '<td width="16%" style="border-right: 1px solid black;">'+Number(selectedEvent.mCGST).toFixed(2)+'</td>'+
              '<td width="16%" style="border-right: 1px solid black;">'+Number(selectedEvent.mSGST).toFixed(2)+'</td>'+
              '<td width="17%" style="border-right: 1px solid black;">'+Number(selectedEvent.mGrandTotal).toFixed(2)+'</td>'+
              '<td width="17%" style="border-right: 1px solid black;">'+Number(selectedEvent.mReceivedGrandTotal).toFixed(2)+'</td>'+
              '<td width="17%">'+Number(selectedEvent.mBalanceDue).toFixed(2)+'</td>'+
            '</tr>'+
          '</table></td></tr>'+
        '<tr height="5px"><td> </td></tr>'+
        '<tr><td>For Mirth</td></tr>'+
        '<tr height="25px"><td> </td></tr>'+
        '<tr><td>'+
          '<table width="100%" style="border-collapse: collapse; table-layout: fixed;">'+
            '<tr><td width="50%">Authorized Signatory</td><td width="50%" style="text-align:right;">Signature of the Guest</td></tr>'+
          '</table></td></tr>'+
          '</tbody></table>' +        
        '</body></html></body></html></body></html>';      
    }
    
    function getPaymentHistoryRowsToInvoice(halls) {
      var paymentList = '';
      var serialNumber = 0;
      var paymentHistories = $scope.getUnDeletedPaymentHistories();

      for (var i = paymentHistories.length - 1; i >= 0; i--) {
        var item = paymentHistories[i];
        serialNumber++;

        paymentList = paymentList + '<tr>' +
          '<td width="10%" rowspan="3" style="border-right: 1px solid black; border-bottom: 1px solid black; text-align: center;">'+serialNumber+'</td>' +
          '<td width="48%" style="border-right: 1px solid black;">Rent Received for '+halls+' on '+moment(new Date(item.receiptDate)).format('DD/MM/YYYY')+'. Receipt # '+item.receiptNo+'</td>' +
          '<td width="8%" style="border-right: 1px solid black; text-align: center;">LS</td>' +
          '<td width="8%" style="border-right: 1px solid black;"></td>' +
          '<td width="8%" style="border-right: 1px solid black;"></td>' +
          '<td width="18%" style="text-align:right;">'+Number(item.paidSubTotal).toFixed(2)+'</td>' +
          '</tr>' +
          '<tr>' +
          '<td width="48%" style="border-right: 1px solid black;">Add: CGST @'+item.CGSTPercent+'%</td>' +
          '<td width="8%" style="border-right: 1px solid black;"></td>' +
          '<td width="8%" style="border-right: 1px solid black;"></td>' +
          '<td width="8%" style="border-right: 1px solid black;"></td>' +
          '<td width="18%" style="text-align:right;">'+Number(item.paidCGST).toFixed(2)+'</td>' +
          '</tr>' +
          '<tr style="border-bottom: 1px solid black;">' +
          '<td width="48%" style="border-right: 1px solid black;">Add: SGST @'+item.SGSTPercent+'%</td>' +
          '<td width="8%" style="border-right: 1px solid black;"></td>' +
          '<td width="8%" style="border-right: 1px solid black;"></td>' +
          '<td width="8%" style="border-right: 1px solid black;"></td>' +
          '<td width="18%" style="text-align:right;">'+Number(item.paidSGST).toFixed(2)+'</td>' +
          '</tr>';
      }      

      return paymentList;
    }
    
    function getEventDateTime() {
      return $scope.ui.mSelectedDateToDisplay + ' ' + $scope.eventTime.mStartToDisplay + ' - ' + $scope.eventTime.mEndToDisplay;
    }

    function getValidValue(data) {
      return (data !== null && data !== undefined) ? data : '--';
    }

    function getLastInsertedPayment() {
      return _.max($scope.getUnDeletedPaymentHistories(), function(item){ return item.receiptNo; });
    }

    $scope.sendMail = function(form, billType, index) {
      if (form.$valid && $scope.mixins.mEmail) {

        var documentContent;
        var mailSubject;
        var attachmentName;
        switch (billType) {
          case BILL_TYPES[0]:
            documentContent = getBookingFormData(false);
            mailSubject = 'Mirth Hall Booking Details';
            attachmentName = 'Booking_Form.pdf';
            break;
          case BILL_TYPES[1]:
            documentContent = getReceiptData(index, false);
            mailSubject = 'Mirth Hall Receipt Details';
            attachmentName = 'Receipt.pdf';
            break;
          case BILL_TYPES[2]:
            documentContent = getInvoiceData(false);
            mailSubject = 'Mirth Hall Invoice Details';
            attachmentName = 'Invoice.pdf';
            break;

          default:
            return;
        }
       
        var emailContent = {
          content: documentContent,
          newBooking: $scope.mixins,
          totalCharges: Number($scope.mixins.mSubTotal),
          halls: _.map($scope.mixins.mSelectedHalls, 'displayName'),
          paymentMode: $scope.mPaymentHistory.paymentMode,
          eventDateTime: getEventDateTime(),
          eventName: getEventName(),
          subject: mailSubject,
          attachmentName: attachmentName
        };

        if ($scope.mixins.mEmail === null) {
          Notification.error({
            message: 'Email Id Missing Error',
            title: '<i class="glyphicon glyphicon-remove"></i> Email id not found'
          });
        } else {
          setSendingEmail(billType, index, true);

          EmailBookingServices.requestSendEmail(emailContent)
            .then(onRequestEmailBookingSuccess)
            .catch(onRequestEmailBookingError);
        }
      }

      function onRequestEmailBookingSuccess(response) {
        setSendingEmail(billType, index, false);

        Notification.success({
          message: response.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Email drop successfully'
        });
      }

      function onRequestEmailBookingError(response) {
        setSendingEmail(billType, index, false);
        
        Notification.error({
          message: response.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Email failed to send'
        });
      }

    };
    
    function setSendingEmail(billType, index, isSending) {
      switch (billType) {
        case BILL_TYPES[0]:
          $scope.ui.mailsending = isSending;
          break;
        case BILL_TYPES[1]:
          $scope.mixins.mPaymentHistories[index].isSendingMail = isSending;
          break;
        case BILL_TYPES[2]:
          $scope.ui.mailsending = isSending;
          break;

        default:
          return;
      }
    }

    function validateStartAndEndTime() {
      if ($scope.bookingForm) {
        var bool = (Date.parse($scope.eventTime.mEndToServer) > Date.parse($scope.eventTime.mStartToServer));
        $scope.bookingForm.end.$setValidity('greater', bool);
        $scope.bookingForm.start.$setValidity('lesser', bool);
      }
    }

    function getTimeToDisplay(date) {
      return moment(date).format('hh:mm:a');
    }

    function getTimeToServer(date) {
      var dt = (new Date(selectedDate)).setHours(date.getHours(), date.getMinutes(), 0, 0);
      var dtGMT = new Date((new Date(dt)).toUTCString()).toISOString();

      return dtGMT;
    }

    $scope.onFileSelected = function(files, events, b) {

      $scope.ui.isDataChanged = true;
      if (files.length > 0) {
        $scope.ui.photoIdFile = files[0];
        var fileExtension = $scope.ui.photoIdFile.name.split('.').pop();
        if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'gif') {
          $scope.ui.fileSelected = true;
        } else {
          $scope.ui.fileSelected = false;
          $scope.ui.photoIdFile = '';

          Notification.error({
            message: 'Unsupported file.',
            title: '<i class="glyphicon glyphicon-remove"></i> Image Error'
          });
        }
      }
    };

    $scope.showLargeImage = function(ev) {
      $mdDialog.show({
          controller: 'LargeImageController',
          templateUrl: 'modules/newbookings/client/views/view.largeimage.client.view.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: true,
          multiple: true,
          resolve: {
            filePath: function() {
              return $scope.ui.fileSelected ? $scope.ui.photoIdFile : $scope.mixins.mPhotoIdPath;
            }
          },
        })
        .then(function(updatedItem) {

        }, function() {
          console.log('You cancelled the large image dialog.');
        });
    };

    $scope.cancelFile = function() {
      $scope.ui.fileSelected = false;
      $scope.ui.photoIdFile = '';
    };

    var init = function() {
      if ($scope.mixins._id) {
        $scope.ui.createMode = false;
        $scope.ui.showMdSelect = false;
      }

      var hasContainsTaxName = CommonService.hasContainsTaxName($scope.model.taxes);

      var isCGSTRatePresentforToday = false;
      var isSGSTRatePresentforToday = false;
      if (hasContainsTaxName) {
        var cgst = CommonService.findRateSummariesByDateOfFutureTax(CommonService.getTaxRateByName($scope.model.taxes, CGST).rateSummaries, new Date());
        var sgst = CommonService.findRateSummariesByDateOfFutureTax(CommonService.getTaxRateByName($scope.model.taxes, SGST).rateSummaries, new Date());

        if (cgst.length > 0) {
          isCGSTRatePresentforToday = true;
        }

        if (sgst.length > 0) {
          isSGSTRatePresentforToday = true;
        }
      }

      if (!isCGSTRatePresentforToday) {
        Notification.error({
          message: 'CGST tax rate is not found for today.',
          title: '<i class="glyphicon glyphicon-remove"></i> Tax Missing Error'
        });
        $mdDialog.cancel();
        return;
      }

      if (!isSGSTRatePresentforToday) {
        Notification.error({
          message: 'SGST tax rate is not found for today.',
          title: '<i class="glyphicon glyphicon-remove"></i> Tax Missing Error'
        });
        $mdDialog.cancel();
        return;
      }

      if (!hasContainsTaxName) {
        Notification.error({
          message: 'Please add both CGST and SGST tax rate.',
          title: '<i class="glyphicon glyphicon-remove"></i> Tax Missing Error'
        });
        $mdDialog.cancel();
      } else {
        calculateTaxRate();
      }

      $scope.calculateBalanceDue();

    };

    $scope.model.taxes.$promise.then(function(result) {
      doInitialProcessing();
      setSelectedPaymentStatus();
    });

    function doInitialProcessing() {
      init();
      $scope.ui.isPageLoadingDone = true;
      getCommonHalls();
      $scope.bookingForm.$setPristine();
    }

    $scope.setForm = function(form) {
      $scope.bookingForm = form;
    };

    function getBookingData() {
      var bookingData = {
        bookedDate: new Date(),
        name: $scope.mixins.mName,
        address: $scope.mixins.mAddress,
        GSTINNumber: $scope.mixins.mGSTINNumber,
        phone: $scope.mixins.mPhone,
        email: $scope.mixins.mEmail,
        purpose: getEventName(),
        startTime: $scope.mixins.mStartDateTime,
        endTime: $scope.mixins.mEndDateTime,
        halls: $scope.mixins.mSelectedHalls,
        description: $scope.mixins.mDescription,
        subTotal: $scope.mixins.mSubTotal,
        cgst: $scope.mixins.mCGST,
        sgst: $scope.mixins.mSGST,
        grandTotal: $scope.mixins.mGrandTotal,
        paymentHistory: $scope.mPaymentHistory,
        balanceDue: $scope.mixins.mBalanceDue
      };

      return bookingData;
    }

    // Save Newbooking
    $scope.saveBooking = function(form) {

      if (form.$valid) {

        if (Number($scope.mixins.mBalanceDue) < 0) {
          Notification.error({
            message: 'Please enter valid data.',
            title: '<i class="glyphicon glyphicon-remove"></i> Error'
          });

          return;
        }

        /* DeletePhotoIdServices.deletePhotoIdPicture({
           mPhotoIdPath: $scope.mixins.mPhotoIdPath
         }).then(function(res) {});*/

        $scope.mixins.mStartDateTime = $scope.eventTime.mStartToServer;
        $scope.mixins.mEndDateTime = $scope.eventTime.mEndToServer;
        $scope.mixins.date = new Date($scope.eventTime.mStartToServer).getDate();
        $scope.mixins.month = new Date($scope.eventTime.mStartToServer).getMonth() + 1;
        $scope.mixins.year = new Date($scope.eventTime.mStartToServer).getFullYear();

        $scope.mixins.mSelectedHalls = _.uniqBy($scope.mixins.mSelectedHalls, '_id');

        var startOfTheDayInLocal = new Date($scope.eventTime.mStartToServer);
        startOfTheDayInLocal.setHours(0, 0, 0, 0);
        var endOfTheDayInLocal = new Date($scope.eventTime.mEndToServer);
        endOfTheDayInLocal.setHours(23, 59, 59, 999);
        var gmtDateTime = {
          startGMT: new Date(startOfTheDayInLocal.toUTCString()).toISOString(),
          endGMT: new Date(endOfTheDayInLocal.toUTCString()).toISOString()
        };

        ValidateOverlapBookingServices.requestvalidateoverlap(gmtDateTime).then(function(eventsOfTheDay) {

          if (!$scope.ui.createMode) {
            eventsOfTheDay = _.reject(eventsOfTheDay, function(hallonday) {
              return hallonday._id === $scope.mixins._id;
            });
          }

          var isEventOverlaps = false;
          for (var i = 0; i < eventsOfTheDay.length; i++) {
            var eventItem = eventsOfTheDay[i];

            var commonHallIdsArray = _.intersection(_.map(eventItem.mSelectedHalls, '_id'), _.map($scope.mixins.mSelectedHalls, '_id'));
            var commonHallNamesArray = _.intersection(_.map(eventItem.mSelectedHalls, 'displayName'), _.map($scope.mixins.mSelectedHalls, 'displayName'));

            if (commonHallIdsArray.length > 0) {
              //  already booked hall selected              
              if (($scope.eventTime.mStartToServer < addHours(eventItem.mEndDateTime, 3)) && ($scope.eventTime.mEndToServer > subtractHours(eventItem.mStartDateTime, 3))) { // overlaps
                isEventOverlaps = true;

                var msg = '';
                if (commonHallNamesArray.length > 1)
                  msg = 'Halls ' + commonHallNamesArray + ' are already booked on the date between ' + $scope.eventTime.mStartToDisplay + ' and ' + $scope.eventTime.mEndToDisplay;
                else
                  msg = commonHallNamesArray + ' hall is already booked on the date between ' + $scope.eventTime.mStartToDisplay + ' and ' + $scope.eventTime.mEndToDisplay;

                Notification.error({
                  message: msg,
                  title: '<i class="glyphicon glyphicon-remove"></i> Hall Booking Overlap'
                });

                break;
              }
            }
          }

          if (!isEventOverlaps) {

            if ($scope.ui.isBookingInProgress) {
              return;
            } else {
              $scope.ui.isBookingInProgress = true;
            }

            if (!$scope.ui.isPastInvoiceEffectiveDate && $scope.mixins.mSelectedPaymentStatus && $scope.mixins.mSelectedPaymentStatus.name === PAYMENT_STATUS[1] && $scope.mixins.invoiceNo != undefined && $scope.mixins.invoiceDate === undefined) {
              $scope.mixins.invoiceDate = new Date();
            }

            if ($scope.ui.createMode) {
              $scope.mixins.mPaymentHistories.push($scope.mPaymentHistory);

              $scope.mixins.bookingFormData = getBookingData();
            } else {
              pushPayment();
              clearPaymentHistory();
            }

            // Calculate Prorate Charges
            calculateProrateCharges();

            if ($scope.ui.photoIdFile && $scope.ui.photoIdFile !== '') {
              //  Uploading PhotoId
              Upload.upload({
                url: '/api/newbookings/picture',
                data: {
                  newPhotoIdPicture: $scope.ui.photoIdFile
                }
              }).then(function(response) { // Success
                $timeout(function() {
                  $scope.mixins.mPhotoIdPath = response.data.path;
                  saveOrUpdate();
                });
              }, function(response) { //  failed
                saveOrUpdate();
              }, function(evt) {
                //  var progress = parseInt(100.0 * evt.loaded / evt.total, 10);
              });
            } else {
              saveOrUpdate();
            }
          }
        });

        function saveOrUpdate() {
          if ($scope.mixins._id) {
            NewbookingsService.update($scope.mixins, successCallback, errorCallback);
          } else {
            NewbookingsService.save($scope.mixins, successCallback, errorCallback);
          }
        }

        function successCallback(res) {
          if ($scope.ui.createMode) { //  Create booking
            createEventsInGoogleCalendar(res);
          } else { // Edit booking
            updateEventsInGoogleCalendar(res);
          }
        }

        function errorCallback(res) {
          Notification.error({
            message: res.data.message,
            title: '<i class="glyphicon glyphicon-remove"></i> Create Booking Error'
          });
        }

      }
    };

    function createEventsInGoogleCalendar(res) {
      var calendarListReq = gapi.client.calendar.calendarList.list();
      calendarListReq.execute(function(respCalList) {
        if (respCalList && respCalList.hasOwnProperty('error')) // error
        {
          Notification.error({
            message: "Unable to fetch the halls from Google Calendar",
            title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Error'
          });

          showBookingCompleteMessage(res);
        } else // success
        {
          var processedHalls = 0;
          angular.forEach($scope.mixins.mSelectedHalls, function(hall) {

            var matchedCalendars = _.filter(respCalList.items, function(obj) {
              return obj.summary.toLowerCase().trim() === hall.name.toLowerCase().trim();
            });

            if (matchedCalendars.length > 0) {
              var matchedCalendar = matchedCalendars[0];
              var eventName = getEventName();

              var insertEventReq = gapi.client.calendar.events.insert({
                calendarId: matchedCalendar.id,
                start: {
                  timeZone: 'Asia/Kolkata',
                  dateTime: $scope.eventTime.mStartToServer
                },
                end: {
                  timeZone: 'Asia/Kolkata',
                  dateTime: $scope.eventTime.mEndToServer
                },
                description: $scope.mixins.mDescription,
                summary: eventName,
                colorId: $scope.googleCalendar.colorCode
              });

              insertEventReq.execute(function(insertEventRes) {
                processedHalls++;

                if (insertEventRes && insertEventRes.hasOwnProperty('error')) { // error
                  Notification.error({
                    message: "Unable to add the event in " + matchedCalendar.summary,
                    title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Error'
                  });
                } else // success
                {
                  hall.mCalendarId = matchedCalendar.id;
                  hall.mEventId = insertEventRes.id;
                }

                if (processedHalls === $scope.mixins.mSelectedHalls.length) {
                  updateCalendarData(res);
                }
              });
            } else {
              processedHalls++;
              if (processedHalls === $scope.mixins.mSelectedHalls.length) {
                updateCalendarData(res);
              }

              Notification.warning({
                message: "Unable to find the " + hall.displayName + " in Google Calendar",
                title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Warning'
              });
            }
          });
        }

      });
    };

    function updateEventsInGoogleCalendar(res) {

      var removedHalls = _.pullAllBy(selectedEvent.mSelectedHalls, $scope.mixins.mSelectedHalls, '_id');
      if (removedHalls.length > 0) {
        var deleteProcessedHalls = 0;
        angular.forEach(removedHalls, function(hall) {

          var deleteEventReq = gapi.client.calendar.events.delete({
            calendarId: hall.mCalendarId,
            eventId: hall.mEventId
          });

          deleteEventReq.execute(function(response) {
            deleteProcessedHalls++;
            if (response && response.hasOwnProperty('error')) { // error
              Notification.warning({
                message: 'Unable to remove the event from ' + hall.displayName + ' hall in Google Calendar',
                title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Error'
              });
            } else // success
            {
              //no need to do anything.
            }

            if (deleteProcessedHalls == removedHalls.length) {
              insertOrUpdateEventInGoogleCalendar(res);
            }
          });

        });
      } else {
        insertOrUpdateEventInGoogleCalendar(res);
      }
    };

    function getCommonHalls() {
      var calendarListReq = gapi.client.calendar.calendarList.list();
      calendarListReq.execute(function(respCalList) {
        if (respCalList && respCalList.hasOwnProperty('error')) { // error
          Notification.error({
            message: 'Unable to fetch the halls from Google Calendar',
            title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Error'
          });
        } else // success
        {
          var withOutFutureRateHalls = [];
          angular.forEach($scope.model.halls, function(hall) {
            var effectiveSummaries = CommonService.findRateSummariesByDateOfFutureHalls(hall.rateSummaries, new Date($scope.eventTime.mStartToServer));
            if (effectiveSummaries.length > 0) {
              withOutFutureRateHalls.push(hall);
            } else {
              // To remove the future halls from already selected halls if the event date is changed.
              var selectedHallIds = _.map($scope.mixins.mSelectedHalls, '_id');
              if (_.includes(selectedHallIds, hall._id)) {
                var index = _.indexOf(selectedHallIds, hall._id);
                $scope.mixins.mSelectedHalls.splice(index, 1);

                Notification.warning({
                  message: 'Effective date is not found for the '+hall.displayName+' hall',
                  title: '<i class="glyphicon glyphicon-remove"></i> Effective Date Not Found'
                });
              }
            }
          });

          var googleCalendarHallNames = _.map(respCalList.items, function(item) {
            return item.summary.toLowerCase().trim();
          });

          var commonHalls = [];
          hallsNotInGoogleCalendar = '';
          angular.forEach(withOutFutureRateHalls, function(hall) {
            if (_.includes(googleCalendarHallNames, hall.name.toLowerCase().trim())) {
              commonHalls.push(hall);
            } else if (selectedEvent && _.includes(_.map(selectedEvent.mSelectedHalls, '_id'), hall._id)) {
              commonHalls.push(hall);
            } else {
              if (hallsNotInGoogleCalendar == '') {
                hallsNotInGoogleCalendar = hall.displayName;
              } else {
                hallsNotInGoogleCalendar = hallsNotInGoogleCalendar.trim() + ', ' + hall.displayName;
              }
            }
          });

          // selected  halls is not updating immediately so i setting empty array and then copying the halls.
          var sSelectedHalls = angular.copy($scope.mixins.mSelectedHalls);
          $scope.mixins.mSelectedHalls = [];
          $scope.mixins.mSelectedHalls = angular.copy(sSelectedHalls);

          $scope.model.filteredHalls.length = 0;
          $scope.model.filteredHalls = commonHalls;

          // If the hall name is changed to keep old name of the hall for already booked halls
          if (selectedEvent) {
            for (var i = 0; i < $scope.model.halls.length; i++) {
              for (var j = 0; j < selectedEvent.mSelectedHalls.length; j++) {
                if (selectedEvent.mSelectedHalls[j]._id === $scope.model.halls[i]._id) {
                  $scope.model.halls[i].name = selectedEvent.mSelectedHalls[j].name;
                  $scope.model.halls[i].displayName = selectedEvent.mSelectedHalls[j].displayName;

                  break;
                }
              }
            }
          }

          // Some times selected halls is not updating immediately, so I am applying the scope.
          $scope.$apply();

          if (!$scope.ui.viewMode)
            shownHallsNotInGoogleCalendarMessage();
        }
      });
    }

    function insertOrUpdateEventInGoogleCalendar(res) {
      var calendarListReq = gapi.client.calendar.calendarList.list();
      calendarListReq.execute(function(respCalList) {
        if (respCalList && respCalList.hasOwnProperty('error')) { // error
          Notification.error({
            message: 'Unable to fetch the halls from Google Calendar',
            title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Error'
          });

          showBookingCompleteMessage(res);
        } else // success
        {
          var processedHalls = 0;
          angular.forEach($scope.mixins.mSelectedHalls, function(hall) {

            if (hall.hasOwnProperty('mCalendarId') && hall.hasOwnProperty('mEventId')) { //Update

              var eventName = getEventName();

              var updateEventReq = gapi.client.calendar.events.update({
                calendarId: hall.mCalendarId,
                eventId: hall.mEventId,
                start: {
                  timeZone: 'Asia/Kolkata',
                  dateTime: $scope.eventTime.mStartToServer
                },
                end: {
                  timeZone: 'Asia/Kolkata',
                  dateTime: $scope.eventTime.mEndToServer
                },
                description: $scope.mixins.mDescription,
                summary: eventName,
                colorId: $scope.googleCalendar.colorCode
              });
              updateEventReq.execute(function(updateEventRes) {
                processedHalls++;

                if (updateEventRes && updateEventRes.hasOwnProperty('error')) // error
                {
                  Notification.error({
                    message: "Unable to update the event in " + hall.displayName,
                    title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Error'
                  });
                } else // success
                {
                  hall.mCalendarId = hall.mCalendarId;
                  hall.mEventId = updateEventRes.id;
                }

                if (processedHalls === $scope.mixins.mSelectedHalls.length) {
                  updateCalendarData(res);
                }
              });
            } else //Insert
            {
              var matchedCalendars = _.filter(respCalList.items, function(obj) {
                return obj.summary.toLowerCase().trim() === hall.name.toLowerCase().trim();
              });

              if (matchedCalendars.length > 0) {
                var matchedCalendar = matchedCalendars[0];
                var eventName = getEventName();

                var insertEventReq = gapi.client.calendar.events.insert({
                  calendarId: matchedCalendar.id,
                  start: {
                    timeZone: 'Asia/Kolkata',
                    dateTime: $scope.eventTime.mStartToServer
                  },
                  end: {
                    timeZone: 'Asia/Kolkata',
                    dateTime: $scope.eventTime.mEndToServer
                  },
                  description: $scope.mixins.mDescription,
                  summary: eventName,
                  colorId: $scope.googleCalendar.colorCode
                });

                insertEventReq.execute(function(insertEventRes) {
                  processedHalls++;

                  if (insertEventRes && insertEventRes.hasOwnProperty('error')) // error
                  {
                    Notification.error({
                      message: "Unable to add the event in " + matchedCalendar.summary,
                      title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Error'
                    });
                  } else // success
                  {
                    hall.mCalendarId = matchedCalendar.id;
                    hall.mEventId = insertEventRes.id;
                  }

                  if (processedHalls === $scope.mixins.mSelectedHalls.length) {
                    updateCalendarData(res);
                  }
                });
              } else {
                processedHalls++;
                if (processedHalls === $scope.mixins.mSelectedHalls.length) {
                  updateCalendarData(res);
                }

                Notification.warning({
                  message: 'Unable to find the ' + hall.displayName + ' in Google Calendar',
                  title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Warning'
                });
              }
            }
          });
        }
      });
    }

    function updateCalendarData(res) {
      var updatedData = {
        _id: res._id,
        mSelectedHalls: $scope.mixins.mSelectedHalls
      };
      NewbookingsService.update(updatedData, updateSuccessCallback, updateErrorCallback);

      function updateSuccessCallback(res) {
        showBookingCompleteMessage(res);
      }

      function updateErrorCallback(res) {
        Notification.error({
          message: 'Unable to update the Google calendar event details in database',
          title: '<i class="glyphicon glyphicon-remove"></i> Error'
        });

        showBookingCompleteMessage(res);
      }
    }

    $scope.cancel = function(bookingForm) {
      if (bookingForm.$dirty || $scope.ui.isDataChanged) {
        var confirm = $mdDialog.confirm().title('Do you want to close?').textContent('If you close, data will not be saved.').ok('Yes').cancel('No').multiple(true);
        $mdDialog.show(confirm).then(function() {
            $mdDialog.cancel();
          },
          function() {
            console.log('no');
          });
      } else
        $mdDialog.cancel();
    };

    /*$scope.selectHallsByDefault = function(hall) {
      var pluckHalls = _.map($scope.mixins.mSelectedHalls, '_id');
      return _.includes(pluckHalls, hall._id);
    };*/

    $scope.showMdselect = function() {
      var confirm = $mdDialog.confirm().title('Do you want to change the hall?').textContent('If you change the hall, new rate will be applied.').ok('Yes').cancel('No').multiple(true);
      $mdDialog.show(confirm).then(function() {
          $scope.ui.showMdSelect = true;
          $scope.$apply();
        },
        function() {
          console.log('no');
        });
    };

    $scope.editBooking = function() {
      $scope.ui.viewMode = false;
      shownHallsNotInGoogleCalendarMessage();
    };

    $scope.shiftChargesView = function(isShowActualChargesView) {

      if ($scope.ui.viewMode) {
        $scope.ui.isActualChargesView = isShowActualChargesView;
        return;
      }

      if ($scope.bookingForm.$dirty || ($scope.ui.isActualChargesView ? false : $scope.ui.isDataChanged)) {
        var confirm = $mdDialog.confirm().title(isShowActualChargesView ? 'Do you want to move to actual charges view?' : 'Do you want to move to booking charges view?')
          .textContent('Updated data will not be saved.').ok('Yes').cancel('No').multiple(true);
        $mdDialog.show(confirm).then(function() {

            changeView(isShowActualChargesView);
          },
          function() {
            console.log('no');
          });
      } else {
        changeView(isShowActualChargesView);
      }
    };

    function changeView(isShowActualChargesView) {
      
      viewMode = false;
      $scope.mixins.mSelectedHalls = null;
      setInitialScopeData(false);
      $scope.ui.isActualChargesView = isShowActualChargesView;
      doInitialProcessing();
    }

    $scope.saveActualCharges = function(actualChargesForm) {
      if (actualChargesForm.$invalid)
        return;

      var updatedActualChargesData = {
        _id: selectedEvent._id,
        mSelectedHalls: $scope.model.selectedEventSelectedHalls
      };

      NewbookingsService.update(updatedActualChargesData, updateActuralChargesSuccessCallback, updateActuralChargesErrorCallback);

      function updateActuralChargesSuccessCallback(res) {
        Notification.success({
          message: 'Actual charges updated successfully',
          title: '<i class="glyphicon glyphicon-remove"></i> Success'
        });

        selectedEvent = res;
        viewMode = true;
        $scope.mixins.mSelectedHalls = null;
        setInitialScopeData(false);
        $scope.ui.isActualChargesView = true;
        doInitialProcessing();
      }

      function updateActuralChargesErrorCallback(res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Error'
        });
      }
    };

    $scope.deleteBooking = function() {
      var confirm = $mdDialog.confirm().title('Do you want to delete the booking?').textContent('Booking detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
      $mdDialog.show(confirm).then(function() {
          selectedEvent.$remove(deleteSuccessCallback, deleteErrorCallback);

          function deleteSuccessCallback(res) {
            var deleteProcessedHalls = 0;
            angular.forEach($scope.mixins.mSelectedHalls, function(hall) {

              var deleteEventReq = gapi.client.calendar.events.delete({
                calendarId: hall.mCalendarId,
                eventId: hall.mEventId
              });

              deleteEventReq.execute(function(response) {
                deleteProcessedHalls++;
                if (response && response.hasOwnProperty('error')) { // error
                  Notification.error({
                    message: 'Unable to delete the event from ' + hall.displayName + ' hall in Google Calendar',
                    title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Error'
                  });
                } else { // success
                  //  no need to do anything.
                }

                if (deleteProcessedHalls === $scope.mixins.mSelectedHalls.length) {
                  res.isDelete = true;
                  //$mdDialog.hide(res);
                  $mdDialog.cancel();
                  // Sending broadcast to bookings.client.controller
                  $rootScope.$broadcast('editBooking', res);
                }
              });

            });
          }

          function deleteErrorCallback(res) {
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Delete Booking Detail Error'
            });
          }
        },
        function() {
          console.log('no');
        });
    };

    /**
     * Booking Completion
     */
    function showBookingCompleteMessage(res) {
      Notification.success({
        message: $scope.ui.createMode ? 'Booked successfully' : 'Updated successfully',
        title: '<i class="glyphicon glyphicon-remove"></i> Success'
      });

      var bookingTitle = res.mSelectedEventType.name;
      if (res.mSelectedEventType.name.toLowerCase().trim() === HARDCODE_VALUES[0]) {
        bookingTitle = res.mOtherEvent;
      }
      $scope.ui.isBookingInProgress = false;
      //$mdDialog.hide(res);

      // Sending broadcast to bookings.client.controller
      $rootScope.$broadcast($scope.ui.createMode ? 'newBooking' : 'editBooking', res);

      selectedEvent = res;
      viewMode = true;
      $scope.mixins.mSelectedHalls = null;
      setInitialScopeData(false);
      doInitialProcessing();
    }

    function clearPaymentHistory() {
      $scope.mPaymentHistory = {
        amountPaid: null,
        paidDate: new Date(),
        paymentMode: null,
        details: '',
        drawnOn: '',
        CGSTPercent: 0,
        SGSTPercent: 0,
        paidSubTotal: 0,
        paidCGST: 0,
        paidSGST: 0,
        isDeletedPayment: false,
        receiptNo: null,
        receiptDate: new Date(),
        isSendingMail: false
      };

      calculateTaxRate();
    }

    $scope.addPayment = function() {
      pushPayment();
      clearPaymentHistory();
    };

    $scope.removePayment = function(index) {
      var confirm = $mdDialog.confirm().title('Do you want to delete the payment?').ok('Yes').cancel('No').multiple(true);
      $mdDialog.show(confirm).then(function() {

          if ($scope.mixins.mPaymentHistories[index].hasOwnProperty('_id')) { // Confirmed payment
            $scope.mixins.mPaymentHistories[index].isDeletedPayment = true;
            $scope.calculateBalanceDue();
          } else { // Unconfirmed payment
            $scope.mixins.mPaymentHistories.splice(index, 1);
            $scope.calculateBalanceDue();
          }
        },
        function() {
          console.log('no');
        });
    };

    $scope.onUnConfirmedAmountChanged = function() {
      $scope.mPaymentHistory.amountPaid = ($scope.mPaymentHistory.amountPaid == undefined) ? null : $scope.mPaymentHistory.amountPaid;

      $scope.calculateBalanceDue();
      proRateAmountPaid();
    };

    function pushPayment() {
      if ($scope.mPaymentHistory.amountPaid && $scope.mPaymentHistory.paymentMode && $scope.mPaymentHistory.paidDate && ($scope.mPaymentHistory.paymentMode === $scope.model.paymentModes[2] || ($scope.mPaymentHistory.details != '' && $scope.mPaymentHistory.drawnOn != '')) && ($scope.ui.isPastReceiptEffectiveDate || $scope.mPaymentHistory.receiptNo)) {

        $scope.mixins.mPaymentHistories.unshift($scope.mPaymentHistory);
      }
    }

    function proRateAmountPaid() {
      $scope.mPaymentHistory.paidSubTotal = Number(($scope.mPaymentHistory.amountPaid * pendingSubTotalPercentage) / 100).toFixed(2);
      $scope.mPaymentHistory.paidCGST = Number(($scope.mPaymentHistory.amountPaid * pendingCGSTPercentage) / 100).toFixed(2);
      $scope.mPaymentHistory.paidSGST = Number(($scope.mPaymentHistory.amountPaid * pendingSGSTPercentage) / 100).toFixed(2);
    }

    /**
     * Date convertion to YYYY-MM-DD HH:MM:SS
     */

    function convertDate(date) {
      return new Date(date).toString().replace(/GMT.+/, '');
    }

    /**
     * Date convertion to timestamp
     */

    function convertTimeStamp(date) {
      return new Date(date).getTime();
    }

    /**
     * Add hours
     */

    function addHours(dateTime, hours) {

      var addedLocalTime = new Date(dateTime);
      addedLocalTime.setHours(addedLocalTime.getHours() + hours);

      var addedGMT = new Date(addedLocalTime.toUTCString()).toISOString();
      return addedGMT;

    }

    /**
     * Subtract hours
     */

    function subtractHours(dateTime, hours) {

      var subtractedLocalTime = new Date(dateTime);
      subtractedLocalTime.setHours(subtractedLocalTime.getHours() - hours);

      var subtractedGMT = new Date(subtractedLocalTime.toUTCString()).toISOString();
      return subtractedGMT;
    }

    function shownHallsNotInGoogleCalendarMessage() {
      isShownHallsNotInGoogleCalendar = true;

      if (hallsNotInGoogleCalendar !== '') {
        var message;
        if (hallsNotInGoogleCalendar.indexOf(',') > -1)
          message = hallsNotInGoogleCalendar + ' halls are not in Google Calendar.';
        else
          message = hallsNotInGoogleCalendar + ' hall is not in Google Calendar.';

        Notification.warning({
          message: message,
          title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Error'
        });
      }
    }

    $scope.getUnDeletedPaymentHistories = function() {
      return _.filter($scope.mixins.mPaymentHistories, function(paymentHistory) {

        return paymentHistory.isDeletedPayment === false;
      });
    }

    $scope.calculateBalanceDue = function() {

      var previouslyPaidSubTotal = selectedEvent ? CommonService.sumOfArray(_.map($scope.getUnDeletedPaymentHistories(), 'paidSubTotal')) : 0;
      var discount = ($scope.mixins.mDiscount === undefined) ? 0 : $scope.mixins.mDiscount; 

      //  without payment history subtotal
      $scope.mixins.mPendingSubTotal = Number(Number($scope.taxableChargesBeforeDiscount) - Number(discount) - Number(previouslyPaidSubTotal)).toFixed(2);
      $scope.mixins.mPendingCGST = Number(Number($scope.mixins.mPendingSubTotal) * cgstPercent).toFixed(2);
      $scope.mixins.mPendingSGST = Number(Number($scope.mixins.mPendingSubTotal) * sgstPercent).toFixed(2);
      $scope.mixins.mPendingGrandTotal = Number(Math.round(Number($scope.mixins.mPendingSubTotal) + Number($scope.mixins.mPendingCGST) + Number($scope.mixins.mPendingSGST))).toFixed(2);

      if (Number($scope.mixins.mPendingSubTotal) === 0 && Number($scope.mixins.mPendingGrandTotal) === 0) { // 0/0 returns undefined
        pendingSubTotalPercentage = 0;
        pendingCGSTPercentage = 0;
        pendingSGSTPercentage = 0;
      } else {
        pendingSubTotalPercentage = (Number($scope.mixins.mPendingSubTotal) / Number($scope.mixins.mPendingGrandTotal)) * 100;
        pendingCGSTPercentage = (Number($scope.mixins.mPendingCGST) / Number($scope.mixins.mPendingGrandTotal)) * 100;
        pendingSGSTPercentage = (Number($scope.mixins.mPendingSGST) / Number($scope.mixins.mPendingGrandTotal)) * 100;
      }

      var paymentHistorySubTotal = ($scope.mPaymentHistory.amountPaid * pendingSubTotalPercentage) / 100;
      var paymentHistoryCGST = ($scope.mPaymentHistory.amountPaid * pendingCGSTPercentage) / 100;
      var paymentHistorySGST = ($scope.mPaymentHistory.amountPaid * pendingSGSTPercentage) / 100;

      //  with payment history subtotal
      $scope.mixins.mPendingSubTotal = Number(Number($scope.taxableChargesBeforeDiscount) - Number(discount) - Number(previouslyPaidSubTotal) - Number(paymentHistorySubTotal)).toFixed(2);
      $scope.mixins.mPendingCGST = Number(Number($scope.mixins.mPendingSubTotal) * cgstPercent).toFixed(2);
      $scope.mixins.mPendingSGST = Number(Number($scope.mixins.mPendingSubTotal) * sgstPercent).toFixed(2);
      $scope.mixins.mPendingGrandTotal = Number(Math.round(Number($scope.mixins.mPendingSubTotal) + Number($scope.mixins.mPendingCGST) + Number($scope.mixins.mPendingSGST))).toFixed(2);

      $scope.mixins.mReceivedSubTotal = Number(Number(previouslyPaidSubTotal) + Number(paymentHistorySubTotal)).toFixed(2);
      $scope.mixins.mReceivedCGST = Number(Number(selectedEvent ? CommonService.sumOfArray(_.map($scope.getUnDeletedPaymentHistories(), 'paidCGST')) : 0) + Number(paymentHistoryCGST)).toFixed(2);
      $scope.mixins.mReceivedSGST = Number(Number(selectedEvent ? CommonService.sumOfArray(_.map($scope.getUnDeletedPaymentHistories(), 'paidSGST')) : 0) + Number(paymentHistorySGST)).toFixed(2);
      $scope.mixins.mReceivedGrandTotal = Number(Math.round(Number($scope.mixins.mReceivedSubTotal) + Number($scope.mixins.mReceivedCGST) + Number($scope.mixins.mReceivedSGST))).toFixed(2);

      $scope.mixins.mSubTotal = Number(Math.round(Number($scope.mixins.mPendingSubTotal) + Number($scope.mixins.mReceivedSubTotal))).toFixed(2);
      $scope.mixins.mCGST = Number(Math.round(Number($scope.mixins.mPendingCGST) + Number($scope.mixins.mReceivedCGST))).toFixed(2);
      $scope.mixins.mSGST = Number(Math.round(Number($scope.mixins.mPendingSGST) + Number($scope.mixins.mReceivedSGST))).toFixed(2);
      $scope.mixins.mGrandTotal = Number(Math.round(Number($scope.mixins.mPendingGrandTotal) + Number($scope.mixins.mReceivedGrandTotal))).toFixed(2);

      $scope.mixins.mBalanceDue = Number(Math.round(Number($scope.mixins.mPendingGrandTotal))).toFixed(2);

    };

    function calculateProrateCharges() {

      var discount = ($scope.mixins.mDiscount === undefined) ? 0 : $scope.mixins.mDiscount; 

      for (var i = 0; i < $scope.mixins.mSelectedHalls.length; i++) {

        //  individual discounts
        $scope.mixins.mSelectedHalls[i].Discount = {
          mRateDiscount: ($scope.mixins.mSelectedHalls[i].mBasicCost / totalCostToDiscountProrate) * discount,
          mElectricityDiscount: ($scope.mixins.mSelectedHalls[i].mElectricityCharges / totalCostToDiscountProrate) * discount,
          mCleaningDiscount: ($scope.mixins.mSelectedHalls[i].mCleaningCharges / totalCostToDiscountProrate) * discount
        };

        //  Total discount
        var sHall = $scope.mixins.mSelectedHalls[i];
        var discounts = sHall.Discount;
        $scope.mixins.mSelectedHalls[i].mTotalDiscount = discounts.mRateDiscount + discounts.mElectricityDiscount + discounts.mCleaningDiscount;

        $scope.mixins.mSelectedHalls[i].GST = {
          mRateCGST: ((sHall.mBasicCost - discounts.mRateDiscount) / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mCGST),
          mRateSGST: ((sHall.mBasicCost - discounts.mRateDiscount) / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mSGST),
          mElectricityCGST: ((sHall.mElectricityCharges - discounts.mElectricityDiscount) / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mCGST),
          mElectricitySGST: ((sHall.mElectricityCharges - discounts.mElectricityDiscount) / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mSGST),
          mCleaningCGST: ((sHall.mCleaningCharges - discounts.mCleaningDiscount) / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mCGST),
          mCleaningSGST: ((sHall.mCleaningCharges - discounts.mCleaningDiscount) / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mSGST),
          mGeneratorCGST: (sHall.mGeneratorCharges / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mCGST),
          mGeneratorSGST: (sHall.mGeneratorCharges / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mSGST),
          mMiscellaneousCGST: (sHall.mMiscellaneousCharges / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mCGST),
          mMiscellaneousSGST: (sHall.mMiscellaneousCharges / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mSGST),
          mDamagesCGST: (sHall.mDamages / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mCGST),
          mDamagesSGST: (sHall.mDamages / Number($scope.mixins.mSubTotal)) * Number($scope.mixins.mSGST)
        };

        var GSTs = $scope.mixins.mSelectedHalls[i].GST;
        $scope.mixins.mSelectedHalls[i].mTotalCGST = GSTs.mRateCGST + GSTs.mElectricityCGST + GSTs.mCleaningCGST + GSTs.mGeneratorCGST + GSTs.mMiscellaneousCGST + GSTs.mDamagesCGST;

        $scope.mixins.mSelectedHalls[i].mTotalSGST = GSTs.mRateSGST + GSTs.mElectricitySGST + GSTs.mCleaningSGST + GSTs.mGeneratorSGST + GSTs.mMiscellaneousSGST + GSTs.mDamagesSGST;

        //  All rate before applying the discount
        $scope.mixins.mSelectedHalls[i].mRevenue = $scope.mixins.mSelectedHalls[i].mBasicCost + $scope.mixins.mSelectedHalls[i].mElectricityCharges + $scope.mixins.mSelectedHalls[i].mCleaningCharges + $scope.mixins.mSelectedHalls[i].mGeneratorCharges + $scope.mixins.mSelectedHalls[i].mMiscellaneousCharges + $scope.mixins.mSelectedHalls[i].mDamages + $scope.mixins.mSelectedHalls[i].mTotalCGST + $scope.mixins.mSelectedHalls[i].mTotalSGST;

        //  Collection including CGST and SGST taxes.
        var receivedPayment = CommonService.sumOfArray(_.map($scope.getUnDeletedPaymentHistories(), 'amountPaid'));
        $scope.mixins.mSelectedHalls[i].Collection = {
          mBasicCostCollection: ((sHall.mBasicCost - discounts.mRateDiscount) / Number($scope.mixins.mSubTotal)) * receivedPayment,
          mElectricityCollection: ((sHall.mElectricityCharges - discounts.mElectricityDiscount) / Number($scope.mixins.mSubTotal)) * receivedPayment,
          mCleaningCollection: ((sHall.mCleaningCharges - discounts.mCleaningDiscount) / Number($scope.mixins.mSubTotal)) * receivedPayment,
          mGeneratorCollection: (sHall.mGeneratorCharges / Number($scope.mixins.mSubTotal)) * receivedPayment,
          mMiscellaneousCollection: (sHall.mMiscellaneousCharges / Number($scope.mixins.mSubTotal)) * receivedPayment,
          mDamageCollection: (sHall.mDamages / Number($scope.mixins.mSubTotal)) * receivedPayment
        };

        var Collections = $scope.mixins.mSelectedHalls[i].Collection;
        $scope.mixins.mSelectedHalls[i].mTotalCollection = Collections.mBasicCostCollection + Collections.mElectricityCollection + Collections.mCleaningCollection + Collections.mGeneratorCollection + Collections.mMiscellaneousCollection + Collections.mDamageCollection;

      }
    }

    function calculateHallsRate() {
      var basicCost = CommonService.sumOfArray(_.map($scope.mixins.mSelectedHalls, 'mBasicCost'));
      var electricityCost = CommonService.sumOfArray(_.map($scope.mixins.mSelectedHalls, 'mElectricityCharges'));
      var cleaningCost = CommonService.sumOfArray(_.map($scope.mixins.mSelectedHalls, 'mCleaningCharges'));
      var generatorCost = CommonService.sumOfArray(_.map($scope.mixins.mSelectedHalls, 'mGeneratorCharges'));
      var miscellaneousCost = CommonService.sumOfArray(_.map($scope.mixins.mSelectedHalls, 'mMiscellaneousCharges'));
      var damageCost = CommonService.sumOfArray(_.map($scope.mixins.mSelectedHalls, 'mDamages'));

      $scope.taxableChargesBeforeDiscount = Number(basicCost) + Number(electricityCost) + Number(cleaningCost) +
        Number(generatorCost) + Number(miscellaneousCost) + Number(damageCost);

      totalCostToDiscountProrate = Number(basicCost) + Number(electricityCost) + Number(cleaningCost);
    }

    function calculateTaxRate() {
      var cgst = CommonService.findRateSummariesByDate(CommonService.getTaxRateByName($scope.model.taxes, CGST).rateSummaries, new Date());
      var sgst = CommonService.findRateSummariesByDate(CommonService.getTaxRateByName($scope.model.taxes, SGST).rateSummaries, new Date());

      $scope.mPaymentHistory.CGSTPercent = cgst[0].percentage;
      $scope.mPaymentHistory.SGSTPercent = sgst[0].percentage;

      cgstPercent = Number(cgst[0].percentage) / 100;
      sgstPercent = Number(sgst[0].percentage) / 100;
    }
  }
}());