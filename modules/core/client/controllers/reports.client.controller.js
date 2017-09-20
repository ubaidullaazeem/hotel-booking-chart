(function() {
	'use strict';

	angular
		.module('core')
		.controller('ReportsController', ReportsController);

	ReportsController.$inject = ['CommonService', 'NewbookingsService', 'EmailBookingServices', 'DATA_BACKGROUND_COLOR', 'hallsResolve', '$filter', '$scope', 'Notification', '$rootScope', '$mdpDatePicker', 'SearchBookingServices', '$mdDialog', 'MESSAGES'];

	function ReportsController(CommonService, NewbookingsService, EmailBookingServices, DATA_BACKGROUND_COLOR, hallsResolve, $filter, $scope, Notification, $rootScope, $mdpDatePicker, SearchBookingServices, $mdDialog, MESSAGES) {

		$scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

		$rootScope.isUserLoggedIn = true;

		$scope.newbookings = NewbookingsService.query();
		$scope.newbookings.$promise.then(function(result) {
			$scope.ui.isBookingsLoadingDone = true;
		});

		var today = new Date();
		$scope.model = {
			halls: hallsResolve,
			startDate: $filter('date')(new Date(today.getFullYear(), today.getMonth(), 1), "yyyy-MM-dd"), // Get the first day of current month
			endDate: $filter('date')(new Date(today.getFullYear(), today.getMonth() + 1, 0), "yyyy-MM-dd"), // Get the last day of current month
		};

		$scope.ui = {
			searching: false,
			email: false,
			isBookingsLoadingDone: false
		}

		$scope.searchParams = {
			selectedHalls: []
		};
		
		$scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		$scope.labels = [];
		
		$scope.summaryChart = {
			data: [
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[]
			],
			series: ['Revenue', 'Collection', 'CGST', 'SGST', 'Discount', 'Generator Charges', 'Damages', 'Miscellaneous Charges'],
			colors: ['#0000FF', '#00FFFF', '#8A2BE2', '#A52A2A', '#008080', '#FF4500', '#008000', '#800080'],
			options: {
				scales: {
					xAxes: [{
						stacked: false,
					}],
					yAxes: [{
						stacked: false,
						ticks: {
							beginAtZero: true
						}
					}]
				},
				legend: {
					display: true,
					position: "bottom"
				}
			}

		};
		
		$scope.actualChargesChart = {
			data: [
				[],
				[],
				[],
				[]
			],
			series: ['Electricity Charges', 'Actual Electricity Charges', 'Cleaning Charges', 'Actual Cleaning Charges'],
			colors: ['#00008B', '#1E90FF', '#006400', '#90EE90'],
			options: {
				scales: {
					xAxes: [{
						stacked: false,
					}],
					yAxes: [{
						stacked: false,
						ticks: {
							beginAtZero: true
						}
					}]
				},
				legend: {
					display: true,
					position: "bottom"
				}
			}
		};

		$scope.model.halls.$promise.then(function(result) {
			$scope.searchParams.selectedHalls = result;
			$scope.showStartDatePicker();// First time date picker is not showing. so I am calling this function here.
			$scope.showEndDatePicker();// First time date picker is not showing. so I am calling this function here.
			$scope.searchReports();
		});

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

		$scope.selectHallsByDefault = function(hall) {
			var pluckHalls = _.map($scope.searchParams.selectedHalls, '_id');
			return _.includes(pluckHalls, hall._id);
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

			$scope.labels.length = 0;

			$scope.summaryChart.data[0].length = 0;
			$scope.summaryChart.data[1].length = 0;
			$scope.summaryChart.data[2].length = 0;
			$scope.summaryChart.data[3].length = 0;
			$scope.summaryChart.data[4].length = 0;
			$scope.summaryChart.data[5].length = 0;
			$scope.summaryChart.data[6].length = 0;
			$scope.summaryChart.data[7].length = 0;

			$scope.actualChargesChart.data[0].length = 0;
			$scope.actualChargesChart.data[1].length = 0;
			$scope.actualChargesChart.data[2].length = 0;
			$scope.actualChargesChart.data[3].length = 0;

			$scope.ui.searching = true;
			var searchParams = {
				selectedHalls: $scope.searchParams.selectedHalls,
				startDate: fromBrightening(),
				endDate: toMidNight()
			};
			SearchBookingServices.requestSearchReports(searchParams).then(function(searchResults) {
				$scope.ui.searching = false;
				var startDate = new Date($scope.model.startDate);
				var endDate = new Date($scope.model.endDate);

				var dateStart = moment(startDate);
				var dateEnd = moment(endDate).add(0, 'month');

				while (dateEnd > dateStart) {
					$scope.labels.push(dateStart.format('MMMM'));
					dateStart.add(1, 'month');
				};

				/** 
				 * Group by month
				 */
				var groupByMonthHalls = _.groupBy(searchResults, 'month');
				/**
				 * When getting mSelectedHalls object array from groupByMonthHalls we're using _.map
				 * After _.map mSelectedHalls array looks like [[][]], after we convert into single array [] with help of _.flatten
				 * similarly we're getting _id object from $scope.searchParams.selectedHalls, because we need to reject extra halls apart from searched halls
				 * Because for single booking we select multiple halls. 
				 */
				angular.forEach($scope.labels, function(month) {
					var indexMonth = _.indexOf($scope.months, month);
					var mapsearchResultsHalls = _.flatten(_.map(groupByMonthHalls[indexMonth + 1], 'mSelectedHalls'));
					var mapSelectedHalls = _.map($scope.searchParams.selectedHalls, '_id');
					var rejectHalls = _.filter(mapsearchResultsHalls, function(mapsearchResultsHall) {
						return _.includes(mapSelectedHalls, mapsearchResultsHall._id);
					});

					var mRevenue = CommonService.sumOfArray(_.map(rejectHalls, 'mRevenue'));
					var mCollection = CommonService.sumOfArray(_.map(rejectHalls, 'mTotalCollection'));
					var mCGST = CommonService.sumOfArray(_.map(rejectHalls, 'mTotalCGST'));
					var mSGST = CommonService.sumOfArray(_.map(rejectHalls, 'mTotalSGST'));
					var mDiscount = CommonService.sumOfArray(_.map(rejectHalls, 'mTotalDiscount'));
					var mGeneratorCharges = CommonService.sumOfArray(_.map(rejectHalls, 'mGeneratorCharges'));
					var mDamages = CommonService.sumOfArray(_.map(rejectHalls, 'mDamages'));
					var mMiscellaneousCharges = CommonService.sumOfArray(_.map(rejectHalls, 'mMiscellaneousCharges'));

					var mElectricityCharges = CommonService.sumOfArray(_.map(rejectHalls, 'mElectricityCharges'));
					var mActualElectricityCharges = CommonService.sumOfArray(_.map(rejectHalls, 'mActualElectricityCharges'));
					var mCleaningCharges = CommonService.sumOfArray(_.map(rejectHalls, 'mCleaningCharges'));
					var mActualCleaningCharges = CommonService.sumOfArray(_.map(rejectHalls, 'mActualCleaningCharges'));
					
					if (_.includes($scope.labels, $scope.months[indexMonth])) {
						$scope.summaryChart.data[0].push(Number(Math.round(mRevenue)));
						$scope.summaryChart.data[1].push(Number(Math.round(mCollection)));
						$scope.summaryChart.data[2].push(Number(Math.round(mCGST)));
						$scope.summaryChart.data[3].push(Number(Math.round(mSGST)));
						$scope.summaryChart.data[4].push(Number(Math.round(mDiscount)));
						$scope.summaryChart.data[5].push(Number(Math.round(mGeneratorCharges)));
						$scope.summaryChart.data[6].push(Number(Math.round(mDamages)));
						$scope.summaryChart.data[7].push(Number(Math.round(mMiscellaneousCharges)));

						$scope.actualChargesChart.data[0].push(mElectricityCharges);
						$scope.actualChargesChart.data[1].push(mActualElectricityCharges);
						$scope.actualChargesChart.data[2].push(mCleaningCharges);
						$scope.actualChargesChart.data[3].push(mActualCleaningCharges);
					} else {
						$scope.summaryChart.data[0].push(0);
						$scope.summaryChart.data[1].push(0);
						$scope.summaryChart.data[2].push(0);
						$scope.summaryChart.data[3].push(0);
						$scope.summaryChart.data[4].push(0);
						$scope.summaryChart.data[5].push(0);
						$scope.summaryChart.data[6].push(0);
						$scope.summaryChart.data[7].push(0);

						$scope.actualChargesChart.data[0].push(0);
						$scope.actualChargesChart.data[1].push(0);
						$scope.actualChargesChart.data[2].push(0);
						$scope.actualChargesChart.data[3].push(0);
					}
				});

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
			html2canvas(document.getElementById(isSummary ? 'exportSummaryData' : 'actualChargesData'), {
				onrendered: function(canvas) {
					var canvasdata = canvas.toDataURL("image/png");
					var a = document.createElement("a");
					a.download = isSummary ? 'Summary_Report.png' : 'Actual_Charges_Report.png';
					a.href = canvasdata;
					a.click();
				}
			});
		}

		$scope.emailReport = function(isSummary) {
			$scope.ui.email = true;
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
				title: '<i class="glyphicon glyphicon-remove"></i> '+MESSAGES.SUCCESS_TITLE_EMAIL_SENT
			});
			$scope.ui.email = false;
		}

		function onRequestEmailReportError(response) {
			Notification.error({
				message: response.message,
				title: '<i class="glyphicon glyphicon-remove"></i> '+MESSAGES.ERR_TITLE_EMAIL_SEND
			});
			$scope.ui.email = false;
		}
	}
}());