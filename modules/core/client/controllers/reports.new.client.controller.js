(function() {
	'use strict';

	angular
		.module('core')
		.controller('ReportsControllerNew', ReportsControllerNew);

	ReportsControllerNew.$inject = ['CommonService', 'NewbookingsService', 'EmailBookingServices', 'DATA_BACKGROUND_COLOR', 'hallsResolve', '$filter', '$scope', 'Notification', '$rootScope', '$mdpDatePicker', 'SearchBookingServices', '$mdDialog'];

	function ReportsControllerNew(CommonService, NewbookingsService, EmailBookingServices, DATA_BACKGROUND_COLOR, hallsResolve, $filter, $scope, Notification, $rootScope, $mdpDatePicker, SearchBookingServices, $mdDialog) {

		$scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;
		$rootScope.isUserLoggedIn = true;

		$scope.newbookings = NewbookingsService.query();
		$scope.newbookings.$promise.then(function(result) {
			$scope.showStartDatePicker(); // First time date picker is not showing. so I am calling this function here.
			$scope.showEndDatePicker(); // First time date picker is not showing. so I am calling this function here.
			$scope.searchReports();
		});
		$scope.bookingList = [];

		var today = new Date();
		$scope.model = {
			startDate: $filter('date')(new Date(today.getFullYear(), today.getMonth(), 1), "yyyy-MM-dd"), // Get the first day of current month
			endDate: $filter('date')(new Date(today.getFullYear(), today.getMonth() + 1, 0), "yyyy-MM-dd") // Get the last day of current month			
		};

		$scope.ui = {
			isSearching: false,
			isEmailing: false
		}

		$scope.showStartDatePicker = function(ev) {
			new MaterialDatepicker('#reportStartDatePicker', {
				type: "month",
				closeAfterClick: true,
				onNewDate: function(dateTime) {
					var date = new Date(dateTime);
					var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
					$scope.model.startDate = $filter('date')(firstDay, "yyyy-MM-dd");
					angular.element("#reportStartDatePicker").val($scope.model.startDate);
				}
			});
		};

		$scope.showEndDatePicker = function(ev) {
			new MaterialDatepicker('#reportEndDatePicker', {
				type: "month",
				closeAfterClick: true,
				onNewDate: function(dateTime) {
					var date = new Date(dateTime);
					var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
					$scope.model.endDate = $filter('date')(lastDayOfMonth, "yyyy-MM-dd");
					angular.element("#reportEndDatePicker").val($scope.model.endDate);
				}
			});
		};


		$scope.searchReports = function() {
			if ((Date.parse($scope.model.startDate) > Date.parse($scope.model.endDate))) {
				$mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title('End date should be after start date.').ok('OK'));
				return false;
			};
			if (monthDiff(new Date($scope.model.startDate), new Date($scope.model.endDate)) > 11) {
				$mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title('Report generated in between 12 months only.').ok('OK'));
				return false;
			};


			$scope.ui.isSearching = true;
			var searchParams = {
				startDate: fromBrightening(),
				endDate: toMidNight()
			};
			SearchBookingServices.requestSearchReports(searchParams).then(function(searchResults) {
				$scope.ui.isSearching = false;
				//$scope.bookingList = searchResults;

				var sortedbyDateBookings = _.sortBy(searchResults, function(o) {
					return o.mStartDateTime;
				});

				var a = [];
				angular.forEach(sortedbyDateBookings, function(item, index){

					var receiptNumbers = _.map(item.mPaymentHistories, 'receiptNo');
					var latestReceiptNumber = Math.max.apply(Math, receiptNumbers);
					var lasttPayments = _.filter(item.mPaymentHistories, function(item) {
						return item.receiptNo === latestReceiptNumber;
					});
					var lasttPaymentsAmount = lasttPayments.length > 0 ? lasttPayments[0].amountPaid : '';

					
					var sObj = {
						serialNumber: index+1,
						bookedDate: moment(new Date(item.createdAt)).format('DD-MM-YYYY'),
						name: item.mName,
						grandTotal: item.mGrandTotal,
						eventDate: moment(new Date(item.mStartDateTime)).format('DD-MM-YYYY'),
						advanceReceived: item.mReceivedGrandTotal,
						finalPaymentReceived: lasttPaymentsAmount,
						balanceDue: item.mBalanceDue
					};

					a.push(sObj);
				});
				$scope.bookingList = a;

				console.log($scope.bookingList);

			});
		};

		function fromBrightening() {
			var startOfTheDayInLocal = new Date($scope.model.startDate);
			startOfTheDayInLocal.setHours(0, 0, 0, 0);
			return new Date(startOfTheDayInLocal.toUTCString()).toISOString();
		};

		function toMidNight() {
			var endOfTheDayInLocal = new Date($scope.model.endDate);
			endOfTheDayInLocal.setHours(23, 59, 59, 999);
			return new Date(endOfTheDayInLocal.toUTCString()).toISOString();
		};

		function monthDiff(d1, d2) {
			return d2.getMonth() - d1.getMonth() + (12 * (d2.getFullYear() - d1.getFullYear()));
		};

		$scope.exportReport = function(isSummary) {
			//$("div").scrollTop(1000);

		}

		$scope.emailReport = function(isSummary) {
			$scope.ui.isEmailing = true;
			$("div").scrollTop(1000);
			html2canvas(document.getElementById(isSummary ? 'exportSummaryData' : 'actualChargesData'), {
				onrendered: function(canvas) {
					var canvasdata = canvas.toDataURL("image/png");
					var emailContent = {
						to: $rootScope.globals.currentUser.email,
						content: canvasdata,
						subject: "Mirth Report between " + $scope.model.startDate + ' and ' + $scope.model.endDate
					};

					EmailBookingServices.requestSendReport(emailContent)
						.then(onRequestEmailReportSuccess)
						.catch(onRequestEmailReportError);
				}
			});
		}

		function onRequestEmailReportSuccess(response) {
			Notification.success({
				message: response.message,
				title: '<i class="glyphicon glyphicon-remove"></i> Email drop successfully'
			});
			$scope.ui.isEmailing = false;
		}

		function onRequestEmailReportError(response) {
			Notification.error({
				message: response.message,
				title: '<i class="glyphicon glyphicon-remove"></i> Email failed to send'
			});
			$scope.ui.isEmailing = false;
		}
	}
}());