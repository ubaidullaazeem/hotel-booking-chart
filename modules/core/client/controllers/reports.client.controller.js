(function() {
	'use strict';

	angular
		.module('core')
		.controller('ReportsController', ReportsController);

	ReportsController.$inject = ['CommonService', 'DATA_BACKGROUND_COLOR', 'hallsResolve', '$filter', '$scope', 'Notification', '$rootScope', '$mdpDatePicker', 'SearchBookingServices'];

	function ReportsController(CommonService, DATA_BACKGROUND_COLOR, hallsResolve, $filter, $scope, Notification, $rootScope, $mdpDatePicker, SearchBookingServices) {

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
			}
		};

		$scope.chart = {
			data: [
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
			if((Date.parse($scope.model.startDate) > Date.parse($scope.model.endDate))) {
				swal("End date should be greater than start date!")
				return false;
			};
			if(monthDiff(new Date($scope.model.startDate), new Date($scope.model.endDate)) > 11) {
				swal("Report generated in between 12 months.")
				return false;
			};
			$scope.chart.data[0].length = 0;
			$scope.chart.data[1].length = 0;
			$scope.chart.data[2].length = 0;
			$scope.chart.data[3].length = 0;
			$scope.chart.data[4].length = 0;
			$scope.ui.searching = true;
			var searchParams = {
				selectedHalls: $scope.searchParams.selectedHalls,
				startDate: fromBrightening(),
				endDate: toMidNight()
			};
			SearchBookingServices.requestSearchReports(searchParams).then(function(searchResults) {
				$scope.ui.searching = false;
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


	}
}());