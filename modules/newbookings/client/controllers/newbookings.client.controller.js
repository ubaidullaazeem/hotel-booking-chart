(function() {
  'use strict';

  // Newbookings controller
  angular
    .module('newbookings')
    .controller('NewbookingsController', NewbookingsController);

  NewbookingsController.$inject = ['AuthenticationService', 'CGST', 'SGST', 'DATA_BACKGROUND_COLOR', 'EmailBookingServices', 'HARDCODE_VALUES', '$filter', '$scope', '$state', 'selectedEvent', '$mdDialog', '$templateRequest', '$sce', 'NewbookingsService', 'selectedDate', 'HallsService', 'EventtypesService', 'TaxesService', 'PaymentstatusesService', 'Notification', '$mdpTimePicker', '$mdpDatePicker', 'PAY_MODES', 'CommonService', 'ValidateOverlapBookingServices'];

  function NewbookingsController(AuthenticationService, CGST, SGST, DATA_BACKGROUND_COLOR, EmailBookingServices, HARDCODE_VALUES, $filter, $scope, $state, selectedEvent, $mdDialog, $templateRequest, $sce, NewbookingsService, selectedDate, HallsService, EventtypesService, TaxesService, PaymentstatusesService, Notification, $mdpTimePicker, $mdpDatePicker, PAY_MODES, CommonService, ValidateOverlapBookingServices) {
    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.ui = {
      mSelectedDateToDisplay: selectedDate.format('DD-MMMM-YYYY'),
      mNumberPattern: /^[0-9]*$/,
      mEmailPattern: /^.+@.+\..+$/,
      mMinBasicCost : 0,
      mMinElectricityCharges : 0,
      mMinCleaningCharges : 0,
      mMinActualElectricityCharges: 0,
      createMode: true,
      showMdSelect: true,
      mailsending: false,
    }

    $scope.model = {
      halls: HallsService.query(),
      eventTypes: EventtypesService.query(),
      paymentStatuses: PaymentstatusesService.query(),
      taxes: TaxesService.query(),
      paymentModes: PAY_MODES
    };

    $scope.mPaymentHistory = {
      amountPaid: null,
      paidDate: new Date(),
      paymentMode: null
    };

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
      mPhotoId: selectedEvent ? selectedEvent.mPhotoId : null,
      mSelectedPaymentStatus: selectedEvent ? selectedEvent.mSelectedPaymentStatus : null,
      mManagerName: selectedEvent ? selectedEvent.mManagerName : null,
      mBasicCost: selectedEvent ? selectedEvent.mBasicCost : 0,
      mElectricityCharges: selectedEvent ? selectedEvent.mElectricityCharges : 0,
      mCleaningCharges: selectedEvent ? selectedEvent.mCleaningCharges : 0,
      mGeneratorCharges: selectedEvent ? selectedEvent.mGeneratorCharges : 0,
      mMiscellaneousCharges: selectedEvent ? selectedEvent.mMiscellaneousCharges : 0,
      mDiscount: selectedEvent ? selectedEvent.mDiscount : 0,
      mSubTotal: selectedEvent ? selectedEvent.mSubTotal : 0,
      mCGST: selectedEvent ? selectedEvent.mCGST : 0,
      mSGST: selectedEvent ? selectedEvent.mSGST : 0,
      mGrandTotal: selectedEvent ? selectedEvent.mGrandTotal : 0,
      mPaymentHistories: selectedEvent ? selectedEvent.mPaymentHistories : [],
      mBalanceDue: selectedEvent ? selectedEvent.mBalanceDue : 0,
      mDamages: selectedEvent ? selectedEvent.mDamages : 0,
      mActualElectricityCharges: selectedEvent ? selectedEvent.mActualElectricityCharges : 0,
    };

    $scope.eventTime = {
      mStartClock: new Date('1991-05-04T06:00:00'),
      mEndClock: new Date('1991-05-04T13:00:00'),
      mStartToDisplay: getTimeToDisplay(new Date('1991-05-04T06:00:00')),
      mEndToDisplay: getTimeToDisplay(new Date('1991-05-04T13:00:00')),
      mStartToServer: getTimeToServer(new Date('1991-05-04T06:00:00')),
      mEndToServer: getTimeToServer(new Date('1991-05-04T13:00:00'))
    };

    // $scope.$watch('mPaymentHistory.paidDate', function(newValue) {
    //   $scope.mPaymentHistory.paidDate = $filter('date')(newValue, 'yyyy/MM/dd');
    // });

    // Fetch the Terms and conditions
    var templateUrl = $sce.getTrustedResourceUrl('/modules/newbookings/client/views/templates/newbookings-terms-and-conditions.html');

    $templateRequest(templateUrl).then(function(template) {
      $scope.termsAndConditions = template;
    });


    var selectedHallsTotalBasicCost=0, selectedHallsTotalEBCharges=0, selectedHallsTotalCleaningCharges=0;
    
    $scope.selectedHallsChanged = function() 
    {
      selectedHallsTotalBasicCost = 0, selectedHallsTotalEBCharges=0, selectedHallsTotalCleaningCharges=0;

      $scope.mixins.mSelectedHalls = _.uniqBy($scope.mixins.mSelectedHalls, '_id');
      
      angular.forEach($scope.mixins.mSelectedHalls, function(hall) {        
        
        var effectiveSummaries = CommonService.findRateSummariesByDate(hall.rateSummaries, new Date());

        if (effectiveSummaries.length > 0) 
        {
          selectedHallsTotalBasicCost = selectedHallsTotalBasicCost + effectiveSummaries[0].rate;
          selectedHallsTotalEBCharges = selectedHallsTotalEBCharges + effectiveSummaries[0].powerConsumpationCharges;
          selectedHallsTotalCleaningCharges = selectedHallsTotalCleaningCharges + effectiveSummaries[0].cleaningCharges;
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
      
      console.log("$scope.mixins.mBasicCost1  "+$scope.mixins.mBasicCost);
      console.log("selectedHallsTotalBasicCost  "+selectedHallsTotalBasicCost);

      $scope.ui.mMinBasicCost = selectedHallsTotalBasicCost;
      $scope.ui.mMinElectricityCharges = selectedHallsTotalEBCharges;
      $scope.ui.mMinCleaningCharges = selectedHallsTotalCleaningCharges;

      $scope.mixins.mBasicCost = selectedHallsTotalBasicCost;
      $scope.mixins.mElectricityCharges = selectedHallsTotalEBCharges;
      $scope.mixins.mCleaningCharges = selectedHallsTotalCleaningCharges;

      console.log("$scope.mixins.mBasicCost2  "+$scope.mixins.mBasicCost);

      $scope.calculateBalanceDue();
    };

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
        });
    };

    $scope.showPaidDatePicker = function(ev) {
      var dateToPicker = $scope.mPaymentHistory.paidDate ? new Date($scope.mPaymentHistory.paidDate) : new Date();

      $mdpDatePicker(dateToPicker, {
        targetEvent: ev
      }).then(function(date) {
        $scope.mPaymentHistory.paidDate = new Date(date);
      });
    };

    $scope.printBooking = function(form) {
      if (form.$valid) {
          printElement(document.getElementById("printThis"));
          var printContents = document.getElementById("printSection").innerHTML;
          var popupWin = window.open('', '_blank', 'width=300,height=300');
          popupWin.document.open();
          popupWin.document.write(getNewBookingData());
          popupWin.document.close();
      }
    }

    function printElement(elem) {
      var domClone = elem.cloneNode(true);
      var $printSection = document.getElementById("printSection");

      if (!$printSection) {
          var $printSection = document.createElement("div");
          $printSection.id = "printSection";
          document.body.appendChild($printSection);
      }

      $printSection.innerHTML = "";
      $printSection.appendChild(domClone);
    }

    function getNewBookingData() {
      return '<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()"><html><head> <title>Mirth</title></head><body><html><head> <title>Mirth</title></head><body><div><div align="center"><img src="/modules/core/client/img/logo-bw.png" /></div><h2 align="center"><u>BOOKING DETAILS</u></h2><table style="width: 100%;" align="center"> <tbody> <tr> <td style="width: 50%;"> Name: </td> <td style="width: 50%;">' +  $scope.mixins.mName + ' </td> </tr> <tr> <td style="width: 50%;"> Address </td> <td style="width: 50%;"> ' +  $scope.mixins.mAddress + ' </td> </tr> <tr> <td style="width: 50%;"> Phone No./Mobile No.: </td> <td style="width: 50%;"> ' + $scope.mixins.mPhone + '</td> </tr> <tr> <td style="width: 50%;"> Email I.D: </td> <td style="width: 50%;"> ' + $scope.mixins.mEmail + '</td> </tr> <tr> <td style="width: 50%;"> Photo ID of the Person: </td> <td style="width: 50%;"> ' + $scope.mixins.mPhotoId + '</td> </tr> <tr> <td style="width: 50%;"> Purpose of which Auditorium required: </td> <td style="width: 50%;"> ' + $scope.mixins.mSelectedHalls[0].name + ' </td> </tr> <tr> <td style="width: 50%;"> Date/Time of Function: </td> <td style="width: 50%;"> ' + $scope.mixins.mSelectedEventType.createdAt +' </td> </tr> <tr> <td style="width: 50%;"> Mode of Payment Cheque/DD/Cash/NEFT: </td> <td style="width: 50%;"> ' + $scope.mPaymentHistory.paymentMode + '</td> </tr> <tr> <td style="width: 50%;"> Halls: </td> <td style="width: 50%;"> ' + $scope.mixins.mSelectedHalls.name + '</td> </tr> <tr> <td style="width: 50%;"> Description: </td> <td style="width: 50%;"> ' + $scope.mixins.mDescription + ' </td> </tr></tbody></table><h2 align="center"><u>DETAILS OF CHARGES</u></h2><table style="width: 100%;" align="center"> <tbody> <tr> <td style="width: 100%;" colspan="2"> <u>Service Code 997212:</u> </td> </tr> <tr> <td style="width: 50%;"> Rent(Ruby, Opal) + Electricity/Cleaning/Generator/Miscellaneous charges: </td> <td style="width: 50%;"> ' + $scope.mixins.mElectricityCharges  + ' </td> </tr> <tr> <td style="width: 50%;"> CGST @ 9%: </td> <td style="width: 50%;"> ' + $scope.mixins.mCGST + ' </td> </tr> <tr> <td style="width: 50%;"> SGST @ 9%: </td> <td style="width: 50%;"> ' + $scope.mixins.mSGST + '</td> </tr> <tr> <td style="width: 50%;"> Grand Total: </td> <td style="width: 50%;"> ' + $scope.mixins.mGrandTotal + '</td> </tr> <tr> <td style="width: 50%;"> Advance Received: </td> <td style="width: 50%;"> ' + $scope.mixins.mBasicCost + '</td> </tr> <tr> <td style="width: 50%;"> Balance Due: </td> <td style="width: 50%;"> ' + $scope.mixins.mBalanceDue + '</td> </tr> </tbody></table><br/><br/><br/><br/><table style="width:100%"><tbody><tr><td style="width: 33%; text-align: left">Signature of the Manager</td><td style="width: 67%; text-align: right"> Signature of the Guest</td></tr></tbody></table></div><br/><br/><br/>' + $scope.termsAndConditions + '</body></html></body></html></body></html>';
    }

    $scope.sendMail = function() {
      $scope.ui.mailsending = true;
      var emailContent = {
        content: getNewBookingData(),
        name: $scope.mixins.mName,
        email: $scope.mixins.mEmail,
        subject: "Mirth Hall Booking Details"
      };

      if ($scope.mixins.mEmail === null) {
        Notification.error({
            message: "Mail not sent", title: '<i class="glyphicon glyphicon-remove"></i> Email Id Missing Error !!!'
        });
      } else {
        EmailBookingServices.requestSendEmail(emailContent)
          .then(onRequestEmailBookingSuccess)
          .catch(onRequestEmailBookingError);
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

    function validateStartAndEndTime() {
      if ($scope.bookingForm) {
        var bool = (Date.parse($scope.eventTime.mEndToServer) > Date.parse($scope.eventTime.mStartToServer));
        $scope.bookingForm.end.$setValidity("greater", bool);
        $scope.bookingForm.start.$setValidity("lesser", bool);
      }
    };

    function getTimeToDisplay(date) {
      return moment(date).format('hh:mm:a');
    };

    function getTimeToServer(date) {
      var dt = (new Date(selectedDate)).setHours(date.getHours(), date.getMinutes(), 0, 0);
      var dtGMT = new Date((new Date(dt)).toUTCString()).toISOString();

      return dtGMT;
    };

    //var divideRate;
    var cgstPercent, sgstPercent;
    var cgstString, sgstString;

    $scope.calculateBalanceDue = function() {   

      var subTotal = Number($scope.mixins.mBasicCost) + Number($scope.mixins.mElectricityCharges) + Number($scope.mixins.mCleaningCharges) +
        Number($scope.mixins.mGeneratorCharges) + Number($scope.mixins.mMiscellaneousCharges) - Number($scope.mixins.mDiscount);      

      var cgst = Number(Number(Number(subTotal) * cgstPercent).toFixed(2));
      var sgst = Number(Number(Number(subTotal) * sgstPercent).toFixed(2));
      var grandTot = Number(Number(Math.round(Number(subTotal) + Number(cgst) + Number(sgst))).toFixed(2));      
      var balance = Number(Number(Math.round(Number(grandTot) - Number($scope.mPaymentHistory.amountPaid))).toFixed(2));      
      
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
    };
    
    var init = function() {
      if($scope.mixins._id) {
        $scope.ui.createMode = false;
        $scope.ui.showMdSelect = false;
      };
      $scope.disabledSelectedHalls = CommonService.makeFirstLetterCapitalizeinArray(_.map($scope.mixins.mSelectedHalls, 'name'));
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

      $scope.calculateBalanceDue();   

    };

    $scope.model.taxes.$promise.then(function(result) {
      init();
    });

    // Save Newbooking
   // Save Newbooking
  $scope.save = function(form) {

      if (form.$valid) 
      {
        if (($scope.mixins.mSelectedPaymentStatus.name.toLowerCase() == 'fully paid' && $scope.mixins.mBalanceDue !== 0) || $scope.mixins.mSelectedPaymentStatus.name.toLowerCase() == 'advance paid' && $scope.mixins.mBalanceDue <= 0) {
          Notification.error({
            message: "Please check the payment status and payment received",
            title: '<i class="glyphicon glyphicon-remove"></i> Payment Status Error !!!'
          });

          return;
        }

        if ($scope.mixins.mBalanceDue < 0) {
          Notification.error({
            message: "Please enter valid data.",
            title: '<i class="glyphicon glyphicon-remove"></i> Error !!!'
          });

          return;
        }

        $scope.mixins.mStartDateTime = $scope.eventTime.mStartToServer;
        $scope.mixins.mEndDateTime = $scope.eventTime.mEndToServer;  
      
        if($scope.ui.createMode) {
          $scope.mixins.mPaymentHistories.push($scope.mPaymentHistory);
        } else {
          pushPayment();
        }

        // Calculate Prorate Charges
        calculateProrateCharges();

        $scope.mixins.mSelectedHalls = _.uniqBy($scope.mixins.mSelectedHalls, '_id');

        var startOfTheDayInLocal = new Date(selectedDate);
        startOfTheDayInLocal.setHours(0, 0, 0, 0);
        var endOfTheDayInLocal = new Date(selectedDate);
        endOfTheDayInLocal.setHours(23, 59, 59, 999);
        var gmtDateTime = {
          startGMT: new Date(startOfTheDayInLocal.toUTCString()).toISOString(),
          endGMT: new Date(endOfTheDayInLocal.toUTCString()).toISOString()
        };

        var overlap = false;
        var mapSelectedHallsByName = _.map($scope.mixins.mSelectedHalls, 'name');        

        ValidateOverlapBookingServices.requestvalidateoverlap(gmtDateTime).then(function(bookedHallsOnTheDay) {
          if(!$scope.ui.createMode) {
            bookedHallsOnTheDay = _.reject(bookedHallsOnTheDay, function(hallonday) {
              return hallonday._id === $scope.mixins._id;
            });
          }
          var mapEntriesBySelectedHalls = _.map(bookedHallsOnTheDay, 'mSelectedHalls');          
          angular.forEach(bookedHallsOnTheDay, function(bookedHallOnTheDay) {
            if (!overlap) {              
              if (($scope.eventTime.mStartToServer <= bookedHallOnTheDay.mEndDateTime) && ($scope.eventTime.mEndToServer >= bookedHallOnTheDay.mStartDateTime)) {
                angular.forEach(mapEntriesBySelectedHalls, function(bookedHall) {
                  if (!overlap) {
                    var mapEntrySelectedHallByName = _.map(bookedHall, 'name');
                    var commonHallsFromArrays = _.intersection(mapEntrySelectedHallByName, mapSelectedHallsByName);
                    if (commonHallsFromArrays.length > 0) {
                      overlap = true;
                      Notification.error({
                        message: "Halls '" + commonHallsFromArrays + "' are already booked on the date between startdate: " + convertDate($scope.eventTime.mStartToServer) + " enddate: " + convertDate($scope.eventTime.mEndToServer),
                        title: '<i class="glyphicon glyphicon-remove"></i> Hall Booking Overlap !!!'
                      });
                    };
                  }
                });
              }
            }
          });
          if (!overlap) {
            if ($scope.mixins._id) {
              NewbookingsService.update($scope.mixins, successCallback, errorCallback);
            } else {
              NewbookingsService.save($scope.mixins, successCallback, errorCallback);
            }
          }
        });

        function successCallback(res) 
        {          
          if ($scope.ui.createMode)//Create booking
          {              
            var calendarListReq = gapi.client.calendar.calendarList.list();                    
            calendarListReq.execute(function(respCalList) 
            {
              if(respCalList && respCalList.hasOwnProperty('error')) // error
              {
                Notification.error({
                  message: "Unable to fetch the halls from Google Calendar",
                  title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Error !!!'
                });

                showBookingCompleteMessage(res);
              } 
              else // success
              {
                var processedHalls = 0;
                angular.forEach($scope.mixins.mSelectedHalls, function(hall) {

                  var matchedCalendars = _.filter(respCalList.items, function(obj) {
                    return obj.summary.toLowerCase().trim() === hall.name.toLowerCase().trim();
                  });
                  
                  if (matchedCalendars.length > 0)
                  {
                    var matchedCalendar = matchedCalendars[0];
                    var eventName = ($scope.mixins.mSelectedEventType.name === HARDCODE_VALUES[0]) ? $scope.mixins.mOtherEvent : $scope.mixins.mSelectedEventType.name;

                    var insertEventReq = gapi.client.calendar.events.insert({calendarId : matchedCalendar.id, start : {timeZone: 'Asia/Kolkata', dateTime : $scope.eventTime.mStartToServer},
                                    end : {timeZone: 'Asia/Kolkata', dateTime : $scope.eventTime.mEndToServer}, description : $scope.mixins.mDescription, summary : eventName}); 
                                     
                    insertEventReq.execute(function(insertEventRes) 
                    {
                      processedHalls++;

                      if(insertEventRes && insertEventRes.hasOwnProperty('error')) // error
                      {
                        Notification.error({
                          message: "Unable to add the event in "+matchedCalendar.summary,
                          title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Error !!!'
                        });
                      } 
                      else // success
                      {
                        hall.mCalendarId = matchedCalendar.id;
                        hall.mEventId = insertEventRes.id;    
                      }  

                      if (processedHalls === $scope.mixins.mSelectedHalls.length) 
                      {
                        updateCalendarData(res);      
                      }
                    });
                  }
                  else
                  {   
                    processedHalls++;
                    if (processedHalls === $scope.mixins.mSelectedHalls.length) 
                    {
                      updateCalendarData(res);                     
                    }

                    Notification.warning({
                      message: "Unable to find the "+hall.name+ " in Google Calendar",
                      title: '<i class="glyphicon glyphicon-remove"></i> Google Calendar Warning !!!'
                    });                    
                  }
                });                   
              }      

            });
          }
          else//Edit booking
          {
             console.log("edit booking update To do Google calendar");
          }
        };

        function errorCallback(res) 
        {
          Notification.error({
            message: res.data.message,
            title: '<i class="glyphicon glyphicon-remove"></i> Create Booking Error !!!'
          });
        };

      };
  };

    function updateCalendarData(res)
    {
      var updatedData = {_id : res._id, mSelectedHalls : $scope.mixins.mSelectedHalls};
      NewbookingsService.update(updatedData, updateSuccessCallback, updateErrorCallback);

      function updateSuccessCallback(res) 
      { 
        showBookingCompleteMessage(res);
      }

      function updateErrorCallback(res) 
      {
        Notification.error({
          message: "Unable to update the Google calendar event details in database",
          title: '<i class="glyphicon glyphicon-remove"></i> Error !!!'
        });

        showBookingCompleteMessage(res);
      };
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.selectHallsByDefault = function(hall) {
      var pluckHalls = _.map($scope.mixins.mSelectedHalls, 'name');
      return _.includes(pluckHalls, hall.name);
    };

    $scope.showMdselect = function() {
      swal({
          title: "Do you want to change the hall?",
          text: "If you change the hall, new rate will be applied.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes",
          closeOnConfirm: true
        },
        function(isConfirm) {
          if(isConfirm) {
            $scope.ui.showMdSelect = true;  
            $scope.$apply(); 
          }                         
        });
    };

    function showBookingCompleteMessage(res) {
      Notification.success({
        message: "Booked successfully",
        title: '<i class="glyphicon glyphicon-remove"></i> Success !!!'
      });

      var bookingTitle = res.mSelectedEventType.name;
      if (res.mSelectedEventType.name === HARDCODE_VALUES[0]) {
        bookingTitle = res.mOtherEvent;
      }
            
      $mdDialog.hide(res);
    };

    function clearPaymentHistory() {
      $scope.mPaymentHistory = {
        amountPaid: null,
        paidDate: new Date(),
        paymentMode: null
      };
    };

    $scope.addPayment = function() {
      pushPayment();
      clearPaymentHistory();
    };

    $scope.removePayment = function(index) {
      $scope.mixins.mPaymentHistories.splice(index, 1);
    };

    function pushPayment() {
      if($scope.mPaymentHistory.amountPaid && $scope.mPaymentHistory.paymentMode) {
        $scope.mixins.mPaymentHistories.unshift($scope.mPaymentHistory);
      }      
    };    

    /**
     * Date convertion to YYYY-MM-DD HH:MM:SS
     */

    function convertDate(date) {
      return new Date(date).toString().replace(/GMT.+/, "");
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

    function addExtraHours(date, hours) {
      var dateTime = new Date(date);
      var addExtraTime = dateTime.setHours(dateTime.getHours() + hours);
      return addExtraTime;
    }

    function calculateProrateCharges() {
      for (var i = 0; i < $scope.mixins.mSelectedHalls.length; i++) {
        var effectiveSummaries = CommonService.findRateSummariesByDate($scope.mixins.mSelectedHalls[i].rateSummaries, new Date());

        if (effectiveSummaries.length > 0) {
          var effectiveSummary = effectiveSummaries[0];

          //Prorating basic cost, generator, miscellaneous and discount is based on hall's basic cost and electricity, cleaning is based hall's electricity and cleaning charges
          $scope.mixins.mSelectedHalls[i].mRate = (effectiveSummary.rate / selectedHallsTotalBasicCost) * $scope.mixins.mBasicCost;
          $scope.mixins.mSelectedHalls[i].mElectricityCharges = (effectiveSummary.powerConsumpationCharges / selectedHallsTotalEBCharges) * $scope.mixins.mElectricityCharges;
          $scope.mixins.mSelectedHalls[i].mActualElectricityCharges = 0; //updated while editing the booking
          $scope.mixins.mSelectedHalls[i].mCleaningCharges = (effectiveSummary.cleaningCharges / selectedHallsTotalCleaningCharges) * $scope.mixins.mCleaningCharges;
          $scope.mixins.mSelectedHalls[i].mGeneratorCharges = (effectiveSummary.rate / selectedHallsTotalBasicCost) * $scope.mixins.mGeneratorCharges;
          $scope.mixins.mSelectedHalls[i].mMiscellaneousCharges = (effectiveSummary.rate / selectedHallsTotalBasicCost) * $scope.mixins.mMiscellaneousCharges;
          $scope.mixins.mSelectedHalls[i].mDiscount = (effectiveSummary.rate / selectedHallsTotalBasicCost) * $scope.mixins.mDiscount;

          $scope.mixins.mSelectedHalls[i].mCGST = (effectiveSummary.rate / selectedHallsTotalBasicCost) * $scope.mixins.mCGST;
          $scope.mixins.mSelectedHalls[i].mSGST = (effectiveSummary.rate / selectedHallsTotalBasicCost) * $scope.mixins.mSGST;

          //All rate before applying the discount 
          $scope.mixins.mSelectedHalls[i].mRevenue = $scope.mixins.mSelectedHalls[i].mRate + $scope.mixins.mSelectedHalls[i].mElectricityCharges + $scope.mixins.mSelectedHalls[i].mCleaningCharges + $scope.mixins.mSelectedHalls[i].mGeneratorCharges + $scope.mixins.mSelectedHalls[i].mMiscellaneousCharges + $scope.mixins.mSelectedHalls[i].mCGST + $scope.mixins.mSelectedHalls[i].mSGST;

          $scope.mixins.mSelectedHalls[i].mCollection = (effectiveSummary.rate / selectedHallsTotalBasicCost) * $scope.mPaymentHistory.amountPaid;
        } else {
          Notification.error({
            message: "Effective date is not found for " + hall.name,
            title: '<i class="glyphicon glyphicon-remove"></i> Effective date Error !!!'
          });
          $mdDialog.cancel();
          break;
        }
      }
    }
  }
}());