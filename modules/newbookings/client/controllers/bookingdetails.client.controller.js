(function() {
  'use strict';

  // Newbookings controller
  angular
    .module('newbookings')
    .controller('BookingDetailsController', BookingDetailsController);

  BookingDetailsController.$inject = ['$scope', 'DATA_BACKGROUND_COLOR', 'EmailBookingServices', 'Notification', '$location', '$mdDialog', '$templateRequest', '$sce', 'selectedEvent', 'CommonService', 'HARDCODE_VALUES', 'NewbookingsService'];

  function BookingDetailsController($scope, DATA_BACKGROUND_COLOR, EmailBookingServices, Notification, $location, $mdDialog, $templateRequest, $sce, selectedEvent, CommonService, HARDCODE_VALUES, NewbookingsService) {
    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.mixins = {
      mSelectedHalls: selectedEvent.mSelectedHalls,
      mSelectedEventType: selectedEvent.mSelectedEventType,
      mOtherEvent: selectedEvent.mOtherEvent,
      mDescription: selectedEvent.mDescription,
      mName: selectedEvent.mName,
      mPhone: selectedEvent.mPhone,
      mEmail: selectedEvent.mEmail,
      mAddress: selectedEvent.mAddress,
      mPhotoId: selectedEvent.mPhotoId,
      mSelectedPaymentStatus: selectedEvent.mSelectedPaymentStatus,
      mManagerName: selectedEvent.mManagerName,
      mBasicCost: selectedEvent.mBasicCost,
      mElectricityCharges: selectedEvent.mElectricityCharges,
      mCleaningCharges: selectedEvent.mCleaningCharges,
      mGeneratorCharges: selectedEvent.mGeneratorCharges,
      mMiscellaneousCharges: selectedEvent.mMiscellaneousCharges,
      mDiscount: selectedEvent.mDiscount,
      mSubTotal: selectedEvent.mSubTotal,
      mCGST: selectedEvent.mCGST,
      mSGST: selectedEvent.mSGST,
      mGrandTotal: selectedEvent.mGrandTotal,
      mPaymentHistories: selectedEvent.mPaymentHistories,
      mBalanceDue: selectedEvent.mBalanceDue,
      mDamages: selectedEvent.mDamages,
      mActualElectricityCharges: selectedEvent.mActualElectricityCharges,
      selectedHallsString : CommonService.makeFirstLetterCapitalizeinArray(_.map(selectedEvent.mSelectedHalls, 'name')),      
      selectedEventName : (selectedEvent.mSelectedEventType.name === HARDCODE_VALUES[0]) ? selectedEvent.mOtherEvent : selectedEvent.mSelectedEventType.name,
      eventDate : new Date(selectedEvent.mStartDateTime),
      isPastEvent : moment(selectedEvent.mStartDateTime) < moment(new Date().setHours(0, 0, 0, 0))
    };

    $scope.ui = {
      mailsending: false
    }

    $scope.eventTime = {
      mStartToDisplay: getTimeToDisplay(selectedEvent.mStartDateTime),
      mEndToDisplay: getTimeToDisplay(selectedEvent.mEndDateTime),
    };

    // Fetch the Terms and conditions
    var templateUrl = $sce.getTrustedResourceUrl('/modules/newbookings/client/views/templates/newbookings-terms-and-conditions.html');

    $templateRequest(templateUrl).then(function(template) {
      $scope.termsAndConditions = template;
    });

     $scope.printBooking = function(form) {
      if (form.$valid) {
          printElement(document.getElementById("printThis"));
          var printContents = document.getElementById("printSection").innerHTML;
          var popupWin = window.open('', '_blank', 'width=300,height=300');
          popupWin.document.open();
          popupWin.document.write(getNewBookingData(form));
          popupWin.document.close();
      }
    }

    function printElement(elem) {
      var domClone = elem.cloneNode(true);
      var $printSection = document.getElementById("printSection");

      if (!$printSection) {
          var $printSection = document.createElement("div");
          $printSection.id = "printSection";
          $($printSection).hide();
          document.body.appendChild($printSection);
      }

      $printSection.innerHTML = "";
      $printSection.appendChild(domClone);
    }

    function getNewBookingData(form) {
      var baseUrl = $location.$$absUrl.replace($location.$$url, '');
      var halls = CommonService.makeFirstLetterCapitalizeinArray(_.map($scope.mixins.mSelectedHalls, 'name'));
      var paymentHistoryHTML = '';

      angular.forEach($scope.mixins.mPaymentHistories, function(paymentHistory) {
        paymentHistoryHTML += '<tr> <td style="width: 50%;"> Mode of Payment Cheque/DD/Cash/NEFT </td> <td style="width: 50%;">  : ' + getValidValue(paymentHistory.paymentMode) + '</td> </tr>';
      });

      return '<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()"><html><head> <title>Mirth</title></head><body><html><head> <title>Mirth</title></head><body><div style="border-style: solid; padding: 10px;"><div align="center"><div align="center"><img src="' + baseUrl + '/modules/core/client/img/logo-bw.png" /></div><h2 align="center"><u>BOOKING DETAILS</u></h2><table style="width: 100%;" align="center"> <tbody> <tr> <td style="width: 50%;"> Name </td> <td style="width: 50%;"> : ' + getValidValue($scope.mixins.mName) + ' </td> </tr> <tr> <td style="width: 50%;"> Address </td> <td style="width: 50%;">: ' +  getValidValue($scope.mixins.mAddress) + ' </td> </tr> <tr> <td style="width: 50%;"> Phone No./Mobile No. </td> <td style="width: 50%;"> : ' + getValidValue($scope.mixins.mPhone) + '</td> </tr> <tr> <td style="width: 50%;"> Email I.D </td> <td style="width: 50%;"> : ' + getValidValue($scope.mixins.mEmail) + '</td> </tr> <tr> <td style="width: 50%;"> Photo ID of the Person </td> <td style="width: 50%;"> : ' + getValidValue($scope.mixins.mPhotoId) + '</td> </tr> <tr> <td style="width: 50%;"> Purpose of which Auditorium required </td> <td style="width: 50%;"> : ' + getValidValue(halls) + ' </td> </tr> <tr> <td style="width: 50%;"> Date/Time of Function </td> <td style="width: 50%;"> : ' + getValidValue(getEventDateTime()) +' </td>' + paymentHistoryHTML + ' <tr> <td style="width: 50%;"> Halls </td> <td style="width: 50%;"> : ' + getValidValue(halls) + '</td> </tr> <tr> <td style="width: 50%;"> Description </td> <td style="width: 50%;"> : ' + getValidValue($scope.mixins.mDescription) + ' </td> </tr></tbody></table><h2 align="center"><u>DETAILS OF CHARGES</u></h2><table style="width: 100%;" align="center"> <tbody> <tr> <td style="width: 100%;" colspan="2"> <u>Service Code 997212:</u> </td> </tr> <tr> <td style="width: 50%;"> Rent(Ruby, Opal) + Electricity/Cleaning/Generator/Miscellaneous charges </td> <td style="width: 50%;"> : ' + $scope.mixins.mSubTotal  + ' </td> </tr> <tr> <td style="width: 50%;"> CGST @ 9% </td> <td style="width: 50%;"> : ' + getValidValue($scope.mixins.mCGST) + ' </td> </tr> <tr> <td style="width: 50%;"> SGST @ 9% </td> <td style="width: 50%;"> : ' + getValidValue($scope.mixins.mSGST) + '</td> </tr> <tr> <td style="width: 50%;"> Grand Total </td> <td style="width: 50%;"> : ' + getValidValue($scope.mixins.mGrandTotal) + '</td> </tr> <tr> <td style="width: 50%;"> Advance Received </td> <td style="width: 50%;"> : ' + getValidValue($scope.mixins.mBasicCost) + '</td> </tr> <tr> <td style="width: 50%;"> Balance Due </td> <td style="width: 50%;"> : ' + getValidValue($scope.mixins.mBalanceDue) + '</td> </tr> </tbody></table><p style="text-align:left">Note:- The entry to the hall will be permitted to the Service Providers &Guests only after the receipt of the entire payment.</p><br/><br/><br/><br/><table style="width:100%"><tbody><tr><td style="width: 33%; text-align: left">Signature of the Manager</td><td style="width: 67%; text-align: right"> Signature of the Guest</td></tr></tbody></table></div><br/><br/><br/>' + $scope.termsAndConditions + '</div></body></html></body></html></body></html>';
    }

    function getEventDateTime() {
      return  moment($scope.mixins.eventDate).format('DD-MMMM-YYYY') + ' ' + $scope.eventTime.mStartToDisplay + ' - ' + $scope.eventTime.mEndToDisplay;
    }

    // function getTotalCharges() {
    //   return $scope.mixins.mBasicCost + $scope.mixins.mElectricityCharges + $scope.mixins.mCleaningCharges + $scope.mixins.mGeneratorCharges + $scope.mixins.mMiscellaneousCharges;
    // }

    function getValidValue(data) {
      return (data !== null && data !== undefined) ?  data : '--';
    }

    $scope.sendMail = function() {
      if ($scope.mixins.mEmail) {
        $scope.ui.mailsending = true;
        var emailContent = {
          content: getNewBookingData(),
          newBooking: $scope.mixins,
          totalCharges: $scope.mixins.mSubTotal,
          halls: CommonService.makeFirstLetterCapitalizeinArray(_.map($scope.mixins.mSelectedHalls, 'name')),
          paymentMode: CommonService.makeFirstLetterCapitalizeinArray(_.map($scope.mixins.mPaymentHistories, 'paymentMode')),
          eventDateTime: getEventDateTime(),
          subject: "Mirth Hall Booking Details"
        };

        if ($scope.mixins.mEmail === null) {
          Notification.error({
            message: "Mail not sent",
            title: '<i class="glyphicon glyphicon-remove"></i> Email Id Missing Error !!!'
          });
        } else {
          EmailBookingServices.requestSendEmail(emailContent)
            .then(onRequestEmailBookingSuccess)
            .catch(onRequestEmailBookingError);
        }
      }
    };

    function onRequestEmailBookingSuccess(response) {
       $scope.ui.mailsending = false;
      Notification.success({
          message: response.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Email drop successfully !!!'
        });
    }

    function onRequestEmailBookingError(response) {
       $scope.ui.mailsending = false;
       Notification.error({
          message: response.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Email failed to snet !!!'
        });
    }

    
    function getTimeToDisplay(date) {
      return moment(date).format('hh:mm:a');
    };


    $scope.editBooking = function()
    {
      var oldShow = $mdDialog.show;
        $mdDialog.show = function(options) {
          if (options.hasOwnProperty("skipHide")) {
            options.multiple = options.skipHide;
          }
          return oldShow(options);
        };
      $mdDialog.cancel();

      NewbookingsService.get({
        newbookingId: selectedEvent._id
      }, function(data) {
        $mdDialog.show({
            controller: 'NewbookingsController',
            templateUrl: 'modules/newbookings/client/views/form-newbooking.client.view.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: true,
            resolve: {
              selectedDate: function() {
                return moment(selectedEvent.mStartDateTime);
              },
              selectedEvent: function() {
                return selectedEvent;
              }
            },
          })
          .then(function(updatedItem) {
            //var index = _.indexOf($scope.model.events, event);
            //$scope.model.events[index] = updatedItem;
            console.log('updatedItem');
          }, function() {
            console.log('You cancelled the dialog.');
          });
      }, function(error) {
         Notification.error({
            message: error.data.message,
            title: '<i class="glyphicon glyphicon-remove"></i> Edit Halls Error !!!'
          });
      });
    }


    $scope.cancel = function() {
      $mdDialog.cancel();
    };


  }
}());