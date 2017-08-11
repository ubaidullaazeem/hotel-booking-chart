(function() {
	'use strict';

	angular
		.module('core')
		.controller('ReportsController', ReportsController);

	ReportsController.$inject = ['CommonService', 'EmailBookingServices', 'DATA_BACKGROUND_COLOR', 'hallsResolve', '$filter', '$scope', 'Notification', '$rootScope', '$mdpDatePicker', 'SearchBookingServices'];

	function ReportsController(CommonService, EmailBookingServices, DATA_BACKGROUND_COLOR, hallsResolve, $filter, $scope, Notification, $rootScope, $mdpDatePicker, SearchBookingServices) {

		$scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

		$rootScope.isUserLoggedIn = true;

		var today = new Date();
		$scope.model = {
			halls: hallsResolve,
			startDate: $filter('date')(new Date(today.getFullYear(), today.getMonth(), 1), "yyyy-MM-dd"), // Get the first day of current month
			endDate: $filter('date')(new Date(today.getFullYear(), today.getMonth() + 1, 0), "yyyy-MM-dd"), // Get the last day of current month
		};

		$scope.ui = {
			searching: false,
			email: false
		}

		$scope.searchParams = {
			selectedHalls: hallsResolve
		};

		$scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		$scope.colors = ['#45b7cd', '#ff6384', '#ff8e72', '#ff0000', '#333333'];
		$scope.labels = [];

		$scope.type = 'StackedBar';
		$scope.series = ['Collection', 'Revenue', 'Discount', 'ActualElectricityCharges', 'Taxes'];
		$scope.options = {
			scales: {
				xAxes: [{
					stacked: false,
				}],
				yAxes: [{
					stacked: false
				}]
			},
			legend: {
				display: true,
				position: "bottom"
			}
		};

		$scope.chart = {
			monthData: [
				[],
				[],
				[],
				[],
				[]
			]
		};

		$scope.model.halls.$promise.then(function(result) {
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
			var pluckHalls = _.map($scope.searchParams.selectedHalls, 'name');
			return _.includes(pluckHalls, hall.name);
		};

		$scope.searchReports = function() {
			if ((Date.parse($scope.model.startDate) > Date.parse($scope.model.endDate))) {
				swal("End date should be greater than start date!")
				return false;
			};
			if (monthDiff(new Date($scope.model.startDate), new Date($scope.model.endDate)) > 11) {
				swal("Report generated in between 12 months.")
				return false;
			};
			$scope.chart.monthData[0].length = 0;
			$scope.chart.monthData[1].length = 0;
			$scope.chart.monthData[2].length = 0;
			$scope.chart.monthData[3].length = 0;
			$scope.chart.monthData[4].length = 0;
			$scope.labels.length = 0;
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
				 * similarly we're getting name object from $scope.searchParams.selectedHalls, because we need to reject extra halls apart from searched halls
				 * Because for single booking we select multiple halls. 
				 */
				angular.forEach($scope.labels, function(month) {
					var indexMonth = _.indexOf($scope.months, month);
					var mapsearchResultsHalls = _.flatten(_.map(groupByMonthHalls[indexMonth + 1], 'mSelectedHalls'));
					var mapSelectedHalls = _.map($scope.searchParams.selectedHalls, 'name');
					var rejectHalls = _.filter(mapsearchResultsHalls, function(mapsearchResultsHall) {
						return _.includes(mapSelectedHalls, mapsearchResultsHall.name);
					});
					var mCollection = CommonService.sumOfArray(_.map(rejectHalls, 'mBasicCost'));
					var mRevenue = CommonService.sumOfArray(_.map(rejectHalls, 'mBasicCost'));
					var mDiscount = CommonService.sumOfArray(_.map(rejectHalls, 'mTotalDiscount'));
					var mActualElectricityCharges = CommonService.sumOfArray(_.map(rejectHalls, 'mActualElectricityCharges'));
					var taxes = CommonService.sumOfArray(_.map(rejectHalls, 'mTotalCGST')) + CommonService.sumOfArray(_.map(rejectHalls, 'mTotalSGST'));
					if (_.includes($scope.labels, $scope.months[indexMonth])) {
						$scope.chart.monthData[0].push(mCollection);
						$scope.chart.monthData[1].push(mRevenue);
						$scope.chart.monthData[2].push(mDiscount);
						$scope.chart.monthData[3].push(mActualElectricityCharges);
						$scope.chart.monthData[4].push(taxes);
					} else {
						$scope.chart.monthData[0].push(0);
						$scope.chart.monthData[1].push(0);
						$scope.chart.monthData[2].push(0);
						$scope.chart.monthData[3].push(0);
						$scope.chart.monthData[4].push(0);
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

		$scope.exportReport = function() {
			$("div").scrollTop(1000);
			html2canvas(document.getElementById('exportData'), {
				onrendered: function(canvas) {
					var canvasdata = canvas.toDataURL("image/png");
					var a = document.createElement("a");
					a.download = "Report.png";
					a.href = canvasdata;
					a.click();
				}
			});
		}

		$scope.emailReport = function() {
			$scope.ui.email = true;
			$("div").scrollTop(1000);
			html2canvas(document.getElementById('exportData'), {
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
				title: '<i class="glyphicon glyphicon-remove"></i> Email drop successfully !!!'
			});
			$scope.ui.email = false;
		}

		function onRequestEmailReportError(response) {
			Notification.error({
				message: response.message,
				title: '<i class="glyphicon glyphicon-remove"></i> Email failed to send !!!'
			});
			$scope.ui.email = false;
		}
	}
}());