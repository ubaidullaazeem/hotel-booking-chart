(function() {
  'use strict';

  // Newbookings controller
  angular
    .module('newbookings')
    .controller('BookingDetailsController', BookingDetailsController);

  BookingDetailsController.$inject = ['$scope', 'DATA_BACKGROUND_COLOR', '$mdDialog', 'selectedEvent', 'CommonService', 'HARDCODE_VALUES', 'NewbookingsService'];

  function BookingDetailsController($scope, DATA_BACKGROUND_COLOR, $mdDialog, selectedEvent, CommonService, HARDCODE_VALUES, NewbookingsService) {
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

    $scope.eventTime = {
      mStartToDisplay: getTimeToDisplay(selectedEvent.mStartDateTime),
      mEndToDisplay: getTimeToDisplay(selectedEvent.mEndDateTime),
    };

    
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