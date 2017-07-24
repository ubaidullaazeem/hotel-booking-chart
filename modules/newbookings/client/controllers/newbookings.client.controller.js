(function() {
  'use strict';

  // Newbookings controller
  angular
    .module('newbookings')
    .controller('NewbookingsController', NewbookingsController);

  NewbookingsController.$inject = ['AuthenticationService', 'CGST', 'SGST', 'DATA_BACKGROUND_COLOR', 'HARDCODE_VALUES', '$scope', '$state', 'newbookingResolve', '$mdDialog', 'NewbookingsService', 'selectedDate', 'HallsService', 'EventtypesService', 'TaxesService', 'PaymentstatusesService', 'Notification', '$mdpTimePicker', '$mdpDatePicker', 'PAY_MODES', 'CommonService'];

  function NewbookingsController(AuthenticationService, CGST, SGST, DATA_BACKGROUND_COLOR, HARDCODE_VALUES, $scope, $state, newbooking, $mdDialog, NewbookingsService, selectedDate, HallsService, EventtypesService, TaxesService, PaymentstatusesService, Notification, $mdpTimePicker, $mdpDatePicker, PAY_MODES, CommonService) {
    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.ui = {
      mSelectedDateToDisplay: selectedDate.format('DD-MMMM-YYYY'),
      mNumberPattern: /^[0-9]*$/,
      mEmailPattern: /^.+@.+\..+$/,
      mMinBasicCost : 0,
    }

    $scope.model = {
      halls: HallsService.query(),
      eventTypes: EventtypesService.query(),
      taxes: TaxesService.query(),
      paymentStatuses: PaymentstatusesService.query(),
      paymentModes: PAY_MODES
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
      mManagerName: null,
      mBasicCost: 0,
      mElectricityCharges: 0,
      mCleaningCharges: 0,
      mGeneratorCharges: 0,
      mMiscellaneousCharges: 0,
      mDiscount: 0,
      mSubTotal: 0,
      mCGST: 0,
      mSGST: 0,
      mGrandTotal: 0,
      mPaymentHistory: [{
        amountPaid: '',
        paidDate: '',
        paymentMode: ''
      }],
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
    
    $scope.selectedHallsChanged = function() 
    {
      var totalBasicCost = 0, totalElectricityCharges=0, totalCleaningCharges=0;
      
      angular.forEach($scope.mixins.mSelectedHalls, function(hall) {        
        
        var effectiveSummaries = CommonService.findRateSummariesByDate(hall.rateSummaries, new Date());

        if (effectiveSummaries.length > 0) 
        {
          totalBasicCost = totalBasicCost + effectiveSummaries[0].rate;
          totalElectricityCharges = totalElectricityCharges + effectiveSummaries[0].powerConsumpationCharges;
          totalCleaningCharges = totalCleaningCharges + effectiveSummaries[0].cleaningCharges;
        }
        else
        {
          Notification.error({
            message: "Effective date is not found for " + hall.name,
            title: '<i class="glyphicon glyphicon-remove"></i> Effective date Error !!!'
          });
          $mdDialog.cancel();
        }

        $scope.ui.mMinBasicCost = totalBasicCost;

        $scope.mixins.mBasicCost = totalBasicCost;
        $scope.mixins.mElectricityCharges = totalElectricityCharges;
        $scope.mixins.mCleaningCharges = totalCleaningCharges;
      });

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

    $scope.showPaidDatePicker = function(ev) {
      var dateToPicker = $scope.mixins.mPaymentHistory[0].paidDate ? new Date($scope.mixins.mPaymentHistory[0].paidDate) : new Date();

      $mdpDatePicker(dateToPicker, {
        targetEvent: ev
      }).then(function(date) {
        $scope.mixins.mPaymentHistory[0].paidDate = new Date((new Date(date)).toUTCString()).toISOString();
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

      var subTotal = Number($scope.mixins.mBasicCost) + Number($scope.mixins.mElectricityCharges) + Number($scope.mixins.mCleaningCharges) +
        Number($scope.mixins.mGeneratorCharges) + Number($scope.mixins.mMiscellaneousCharges) - Number($scope.mixins.mDiscount);      

      var cgst = Number(Number(Number(subTotal) * cgstPercent).toFixed(2));
      var sgst = Number(Number(Number(subTotal) * sgstPercent).toFixed(2));
      var grandTot = Number(Number(Math.round(Number(subTotal) + Number(cgst) + Number(sgst))).toFixed(2));
      var balance = Number(Number(Math.round(Number(grandTot) - Number($scope.mixins.mPaymentHistory[0].amountPaid))).toFixed(2));

      /*var subTotal = Number($scope.mixins.mBasicCost) + Number($scope.mixins.mElectricityCharges) + Number($scope.mixins.mCleaningCharges) +
        Number($scope.mixins.mGeneratorCharges) + Number($scope.mixins.mMiscellaneousCharges) - Number($scope.mixins.mDiscount);

      subTotal = Number(Number(subTotal / divideRate).toFixed(2)); //floating point to 2 digit precision
      var cgst = Number(Number(Number(subTotal) * cgstPercent).toFixed(2));
      var sgst = Number(Number(Number(subTotal) * sgstPercent).toFixed(2));
      var grandTot = Number(Number(Math.round(Number(subTotal) + Number(cgst) + Number(sgst))).toFixed(2));
      var balance = Number(Number(Math.round(Number(grandTot) - Number($scope.mixins.mAdvanceReceived))).toFixed(2));
*/
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
    
    var init = function() {

      var hasContainsTaxName = CommonService.hasContainsTaxName($scope.model.taxes);
      if (!hasContainsTaxName) {
        Notification.error({
          message: "Please add both CGST and SGST tax rate.",
          title: '<i class="glyphicon glyphicon-remove"></i> Tax Missing Error !!!'
        });
        $mdDialog.cancel();
      } else {

        var cgst = CommonService.getTaxRateByName($scope.model.taxes, CGST);
        var sgst = CommonService.getTaxRateByName($scope.model.taxes, SGST);

        cgstPercent = Number(cgst) / 100;
        sgstPercent = Number(sgst) / 100;
        cgstString = cgst + '%';
        sgstString = sgst + '%';
      }

      divideRate = 1 + cgstPercent + sgstPercent;
      $scope.calculateBalanceDue();   

    };

    $scope.model.taxes.$promise.then(function(result) {
      init();
    });

    // Save Newbooking
    $scope.save = function(isValid) {

      console.log("save");

      $scope.mixins.mStartDateTime = new Date($scope.eventTime.mStartToServer);
      $scope.mixins.mEndDateTime = new Date($scope.eventTime.mEndToServer);
      
      /*var hallsTotalBasicCost=0;
      angular.forEach($scope.mixins.mSelectedHalls, function(hall) {
        var effectiveSummaries = CommonService.findRateSummariesByDate(hall.rateSummaries, new Date());
        if (effectiveSummaries.length > 0) 
        {
          hallsTotalBasicCost = hallsTotalBasicCost + effectiveSummaries[0].rate;
        }
        else
        {
          Notification.error({
            message: "Effective date is not found for " + hall.name,
            title: '<i class="glyphicon glyphicon-remove"></i> Effective date Error !!!'
          });
          $mdDialog.cancel();
        }
      });

      for(var i=0; i<$scope.mixins.mSelectedHalls.length; i++)
      {
        var effectiveSummaries = CommonService.findRateSummariesByDate($scope.mixins.mSelectedHalls[i].rateSummaries, new Date());

        console.log("effectiveSummaries "+JSON.stringify(effectiveSummaries));

        $scope.mixins.mSelectedHalls[i].mElectricityCharges = effectiveSummaries.powerConsumpationCharges;
        $scope.mixins.mSelectedHalls[i].mCleaningCharges = effectiveSummaries.cleaningCharges;
        $scope.mixins.mSelectedHalls[i].mGeneratorCharges = 0;
        $scope.mixins.mSelectedHalls[i].mMiscellaneousCharges = 0;
        $scope.mixins.mSelectedHalls[i].mRate =  (effectiveSummaries.rate / hallsTotalBasicCost) * $scope.mixins.mBasicCost;
        
        console.log("effectiveSummaries.powerConsumpationCharges "+effectiveSummaries.powerConsumpationCharges);
        console.log("mElectricityCharges "+$scope.mixins.mSelectedHalls[i].mElectricityCharges);
      }*/

      angular.forEach($scope.mixins.mSelectedHalls, function(selectedHall) {
        selectedHall.mCleaningCharges = 0;
        selectedHall.mGeneratorCharges = 0;
        selectedHall.mMiscellaneousCharges = 0;
        selectedHall.mElectricityCharges = 0;    

      });

      console.log("$scope.mixins "+JSON.stringify($scope.mixins));

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