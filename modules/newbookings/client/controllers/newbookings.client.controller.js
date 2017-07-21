(function() {
  'use strict';

  // Newbookings controller
  angular
    .module('newbookings')
    .controller('NewbookingsController', NewbookingsController);

  NewbookingsController.$inject = ['AuthenticationService', 'DATA_BACKGROUND_COLOR', 'HARDCODE_VALUES', '$scope', '$state', 'newbookingResolve', '$mdDialog', 'NewbookingsService', 'selectedDate', 'HallsService', 'EventtypesService', 'TaxesService', 'PaymentstatusesService', 'Notification', '$mdpTimePicker'];

  function NewbookingsController(AuthenticationService, DATA_BACKGROUND_COLOR, HARDCODE_VALUES, $scope, $state, newbooking, $mdDialog, NewbookingsService, selectedDate, HallsService, EventtypesService, TaxesService, PaymentstatusesService, Notification, $mdpTimePicker) {
    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.ui = {
      mSelectedDateToDisplay: selectedDate.format('DD-MMMM-YYYY'),
      mNumberPattern: /^[0-9]*$/,
      mEmailPattern: /^.+@.+\..+$/
    }

    $scope.model = {
      halls: HallsService.query(),
      eventTypes: EventtypesService.query(),
      taxes: TaxesService.query(),
      paymentStatuses: PaymentstatusesService.query(),
      paymentModes: ['None', 'Cheque', 'DD', 'Cash', 'NEFT']
    };

    $scope.mixins = {
      mSelectedHalls: [],
      mSelectedEventType: null,
      mOtherEvent: null,
      mDescription: null,
      mName: null,
      mPhone: null,
      mEmail: null,
      mAddress: null,
      mPhotoId: null,
      mSelectedPaymentStatus: null,
      mSelectedPaymentMode: null,
      mManagerName: null,
      mRent: 0,
      mElectricityCharges: 0,
      mCleaningCharges: 0,
      mGeneratorCharges: 0,
      mMiscellaneousCharges: 0,
      mDiscount: 0,
      mSubTotal: 0,
      mCGST: 0,
      mSGST: 0,
      mGrandTotal: 0,
      mAdvanceReceived: 0,
      mBalanceDue: 0,
    };

    $scope.eventTime = {
      mStartClock: new Date('1991-05-04T06:00:00'),
      mEndClock: new Date('1991-05-04T13:00:00'),
      mStartToDisplay: getTimeToDisplay(new Date('1991-05-04T06:00:00')),
      mEndToDisplay: getTimeToDisplay(new Date('1991-05-04T13:00:00')),
      mStartToServer: getTimeToServer(new Date('1991-05-04T06:00:00')),
      mEndToServer: getTimeToServer(new Date('1991-05-04T13:00:00'))
    };

    $scope.selectedHallsChanged = function() {
      $scope.calculateBalanceDue();
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
        });
    }

    $scope.showEndTimePicker = function(ev) {
      $mdpTimePicker($scope.eventTime.mEndClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mEndClock = dateTime;
          $scope.eventTime.mEndToDisplay = getTimeToDisplay(dateTime);
          $scope.eventTime.mEndToServer = getTimeToServer(dateTime);

          validateStartAndEndTime();
        });
    }

    $scope.sendMail = function() {
      if ($scope.mixins.mEmail === null) {
        Notification.error({
          message: "Mail not sent",
          title: '<i class="glyphicon glyphicon-remove"></i> Email Id Missing Error !!!'
        });
      }
    }

    function validateStartAndEndTime() {
      if ($scope.userForm) {
        var bool = (Date.parse($scope.eventTime.mEndToServer) > Date.parse($scope.eventTime.mStartToServer));
        $scope.userForm.end.$setValidity("greater", bool);
        $scope.userForm.start.$setValidity("lesser", bool);
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

    var divideRate;
    var cgstPercent, sgstPercent;
    var cgstString, sgstString;

    $scope.calculateBalanceDue = function() {
      var rent = 0;
      angular.forEach($scope.mixins.mSelectedHalls, function(hall) {
        rent = rent + Number(hall.rate);
      });
      $scope.mixins.mRent = rent;

      var subTotal = Number($scope.mixins.mRent) + Number($scope.mixins.mElectricityCharges) + Number($scope.mixins.mCleaningCharges) +
        Number($scope.mixins.mGeneratorCharges) + Number($scope.mixins.mMiscellaneousCharges) - Number($scope.mixins.mDiscount);

      subTotal = Number(Number(subTotal / divideRate).toFixed(2)); //floating point to 2 digit precision
      var cgst = Number(Number(Number(subTotal) * cgstPercent).toFixed(2));
      var sgst = Number(Number(Number(subTotal) * sgstPercent).toFixed(2));
      var grandTot = Number(Number(Math.round(Number(subTotal) + Number(cgst) + Number(sgst))).toFixed(2));
      var balance = Number(Number(Math.round(Number(grandTot) - Number($scope.mixins.mAdvanceReceived))).toFixed(2));

      $scope.mixins.mSubTotal = subTotal;
      $scope.mixins.mCGST = cgst;
      $scope.mixins.mSGST = sgst;
      $scope.mixins.mGrandTotal = grandTot;
      $scope.mixins.mBalanceDue = balance;

      console.log("$scope.mSubTotal " + $scope.mixins.mSubTotal);
      console.log("$scope.mCGST " + $scope.mixins.mCGST);
      console.log("$scope.mSGST " + $scope.mixins.mSGST);
      console.log("$scope.mGrandTotal " + $scope.mixins.mGrandTotal);
      console.log("$scope.mBalanceDue " + $scope.mixins.mBalanceDue);
    }

    $scope.onPaymentStatusChanged = function() {
      var getQueryPaymentStatus = _.filter($scope.model.paymentStatuses, function(paymentStatus) {
        return paymentStatus.name === HARDCODE_VALUES[1];
      });
      if ($scope.mixins.mSelectedPaymentStatus == getQueryPaymentStatus[0]) {
        $scope.mixins.mSelectedPaymentMode = $scope.model.paymentModes[0];
      } else {
        $scope.mixins.mSelectedPaymentMode = null;
      }
    }

    var init = function() {
      if ($scope.model.taxes.length == 2) {
        angular.forEach($scope.model.taxes, function(tax) {
          console.log("tax " + JSON.stringify(tax));

          if (tax.name == 'cgst') {
            cgstPercent = Number(tax.percentage) / 100;
            cgstString = tax.percentage + '%';

            console.log("cgst ");
          } else if (tax.name == 'sgst') {
            sgstPercent = Number(tax.percentage) / 100;
            sgstString = tax.percentage + '%';

            console.log("sgst ");
          } else {
            Notification.error({
              message: "Invalid tax name",
              title: '<i class="glyphicon glyphicon-remove"></i> Tax Missing Error !!!'
            });
            $mdDialog.cancel();
          }
        });


        if (!(cgstPercent && sgstPercent)) {
          Notification.error({
            message: "Invalid tax name",
            title: '<i class="glyphicon glyphicon-remove"></i> Tax Missing Error !!!'
          });
          $mdDialog.cancel();
        }

        divideRate = 1 + cgstPercent + sgstPercent;
        $scope.calculateBalanceDue();
      } else {
        Notification.error({
          message: "Please add both the tax percentage in settings page",
          title: '<i class="glyphicon glyphicon-remove"></i> Tax Missing Error !!!'
        });
        $mdDialog.cancel();
      }

    };

    $scope.model.taxes.$promise.then(function(result) {
      init();
    });

    // Save Newbooking
    $scope.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newbookingForm');
        return false;
      }

      $scope.mixins.mStartDateTime = new Date($scope.eventTime.mStartToServer);
      $scope.mixins.mEndDateTime = new Date($scope.eventTime.mEndToServer);
      $scope.mixins.startGMT = moment(selectedDate).startOf('day').toDate().toISOString();
      $scope.mixins.endGMT = moment(selectedDate).endOf('day').toDate().toISOString();

      angular.forEach($scope.mixins.mSelectedHalls, function(selectedHall) {
        selectedHall.mCleaningCharges = 0;
        selectedHall.mGeneratorCharges = 0;
        selectedHall.mMiscellaneousCharges = 0;
        selectedHall.mElectricityCharges = 0;
      });
      // TODO: move create/update logic to service
      NewbookingsService.save($scope.mixins, successCallback, errorCallback);

      function successCallback(res) {
        $mdDialog.hide(res);
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Create Booking Error !!!'
        });
      }
    }

    $scope.cancel = function() {
      $mdDialog.cancel();
    }
  }
}());