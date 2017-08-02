(function() {
	'use strict';

	angular
		.module('core')
		.controller('ReportsController', ReportsController);

	ReportsController.$inject = ['CommonService', 'EmailBookingServices', 'DATA_BACKGROUND_COLOR', 'hallsResolve', '$filter', '$scope', 'Notification', '$rootScope', '$mdpDatePicker', 'SearchBookingServices'];

	function ReportsController(CommonService, EmailBookingServices, DATA_BACKGROUND_COLOR, hallsResolve, $filter, $scope, Notification, $rootScope, $mdpDatePicker, SearchBookingServices) {

		$scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

		$rootScope.isUserLoggedIn = true;

		$scope.model = {
			halls: hallsResolve,
			startDate: $filter('date')(new Date(), "yyyy-MM-dd"),
			endDate: $filter('date')(new Date(), "yyyy-MM-dd"),
		};

		$scope.ui = {
			searching: false
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
					stacked: true,
				}],
				yAxes: [{
					stacked: true
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
			$mdpDatePicker($scope.model.startDate, {
					targetEvent: ev,
				})
				.then(function(dateTime) {
					$scope.model.startDate = moment(dateTime).format('YYYY-MM-DD');
				});
		};

		$scope.showEndDatePicker = function(ev) {
			$mdpDatePicker($scope.model.endDate, {
					targetEvent: ev,
				})
				.then(function(dateTime) {
					$scope.model.endDate = moment(dateTime).format('YYYY-MM-DD');
				});
		};

		$scope.selectHallsByDefault = function(hall) {
			var pluckHalls = _.map($scope.searchParams.selectedHalls, 'name');
			return _.includes(pluckHalls, hall.name);
		};

		$scope.searchReports = function() {
			$scope.labels = [];
			var fromMonthValue = new Date($scope.model.startDate).getMonth();
			var toMonthValue = new Date($scope.model.endDate).getMonth();

			if((Date.parse($scope.model.startDate) > Date.parse($scope.model.endDate))) {
				swal("End date should be greater than start date!")
				return false;
			};

			if(monthDiff(new Date($scope.model.startDate), new Date($scope.model.endDate)) > 11) {
				swal("Report generated in between 12 months.")
				return false;
			};
			// $scope.chart.data[0].length = 0;
			// $scope.chart.data[1].length = 0;
			// $scope.chart.data[2].length = 0;
			// $scope.chart.data[3].length = 0;
			// $scope.chart.data[4].length = 0;
			$scope.ui.searching = true;
			var searchParams = {
				selectedHalls: $scope.searchParams.selectedHalls,
				startDate: fromBrightening(),
				endDate: toMidNight()
			};
			SearchBookingServices.requestSearchReports(searchParams).then(function(searchResults) {
				$scope.ui.searching = false;
				var fromMonthValue = new Date($scope.model.startDate).getMonth();
				var toMonthValue = new Date($scope.model.endDate).getMonth();

				$scope.chart = {
					data: [
						[],
						[],
						[],
						[],
						[]
					]
				};

				var count = 0;
				for (var iter = fromMonthValue;  fromMonthValue <= toMonthValue; fromMonthValue ++)  {
					var monthArray = _.filter(searchResults, function(searchResult) {
						return new Date(searchResult.mStartDateTime).getMonth() === fromMonthValue;
          });

					if (monthArray.length > 0) {
						$scope.fromMonth = $filter('date')(new Date(2014, fromMonthValue), 'MMMM');
						$scope.labels.push($scope.fromMonth);

						var totalCollection = 0;
						var totalRevenue = 0;
						var totalDiscount = 0;
						var totalElectricityCharges = 0;
						var totalTaxes = 0;

						for(var idx = 0; idx < monthArray.length; idx ++) {
							var selectedHalls = monthArray[idx].mSelectedHalls;
							for(var index = 0; index < selectedHalls.length; index ++) {
								totalCollection += selectedHalls[index].mCollection;
								totalRevenue += selectedHalls[index].mRevenue;
								totalDiscount += selectedHalls[index].mDiscount;
								totalElectricityCharges += selectedHalls[index].mElectricityCharges;
								totalTaxes += (selectedHalls[index].mCGST + selectedHalls[index].mSGST);
							}
						}

						$scope.chart.data[count].push(totalCollection);
						$scope.chart.data[count].push(totalRevenue);
						$scope.chart.data[count].push(totalDiscount);
						$scope.chart.data[count].push(totalElectricityCharges);
						$scope.chart.data[count].push(totalTaxes);

						if(fromMonthValue === toMonthValue) {
							buildColumnWiseData($scope.chart.data);
						}
						count++;
					}
				}
			});
		};

		function buildColumnWiseData(data) {
			$scope.chart = {
				data: [
					[],
					[],
					[],
					[],
					[]
				]
			};

			for(var array = 0;  array <  4; array ++) {
				if(data[array].length > 0) {
					$scope.chart.data[0].push(data[array][0]);
					$scope.chart.data[1].push(data[array][1]);
					$scope.chart.data[2].push(data[array][2]);
					$scope.chart.data[3].push(data[array][3]);
					$scope.chart.data[4].push(data[array][4]);
				}
			}

			$scope.chart.monthData = $scope.chart.data;
		}

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

		$scope.exportReport = function () {
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
    }

    function onRequestEmailReportError(response) {
			Notification.error({
				message: response.message,
				title: '<i class="glyphicon glyphicon-remove"></i> Email failed to snet !!!'
			});
		}
  }
}());