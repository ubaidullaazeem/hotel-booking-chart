(function() {
    'use strict';
    angular.module('core')

    .factory('CommonService', ['CGST', 'SGST', 'INVOICE', 'RECEIPT', '$http', function(CGST, SGST, INVOICE, RECEIPT, $http) {

        var CommonService = {};

        CommonService.findRateSummariesByDateBeforeSave = function(rateSummaries, date) {
            return rateSummariesByDateImpl(rateSummaries, date);
        };

        CommonService.findRateSummariesByDate = function(rateSummaries, date) {
            try {
                var summaries = rateSummariesByDateImpl(rateSummaries, date);
                if (summaries.length > 0) {
                    return summaries;
                } else {
                    var previousDate = date.setDate(date.getDate() - 1);
                    return CommonService.findRateSummariesByDate(rateSummaries, new Date(previousDate));
                }
            } catch (exe) {
                return _.orderBy(rateSummaries, function(rateSummary) { return rateSummary.effectiveDate}, ['asc']);;
            }

        };

        CommonService.findRateSummariesByDateOfFutureHalls = function(rateSummaries, date) {
            try {
                var summaries = rateSummariesByDateImpl(rateSummaries, date);
                if (summaries.length > 0) {
                    return summaries;
                } else {
                    var previousDate = date.setDate(date.getDate() - 1);
                    return CommonService.findRateSummariesByDateOfFutureHalls(rateSummaries, new Date(previousDate));
                }
            } catch (exe) {
                return [];//Future rate summary halls
            }

        };

        CommonService.findRateSummariesByDateOfFutureTax = function(rateSummaries, date) {
            try {
                var summaries = rateSummariesByDateImpl(rateSummaries, date);
                if (summaries.length > 0) {
                    return summaries;
                } else {
                    var previousDate = date.setDate(date.getDate() - 1);
                    return CommonService.findRateSummariesByDateOfFutureTax(rateSummaries, new Date(previousDate));
                }
            } catch (exe) {
                return [];
            }

        };

        CommonService.getTaxRateByName = function(taxes, name) {
            var taxArray = _.filter(taxes, function(tax) {
                return tax.name === name;
            });
            return taxArray[0];
        };

        CommonService.hasContainsTaxName = function(taxes) {
            var isCGSTPresent = _.includes(_.map(taxes, 'name'), CGST);
            var isSGSTPresent = _.includes(_.map(taxes, 'name'), SGST);
            return isCGSTPresent && isSGSTPresent;
        };
        
        CommonService.getPaymentCountFromBookedHall = function(bookedHalls, name) {
            var paymentFromBookedHall = _.filter(bookedHalls, function(bookedHall) {
                return bookedHall.mSelectedPaymentStatus.name === name;
            });

            return paymentFromBookedHall.length;
        };

        CommonService.getEventTypeCountFromBookedHall = function(bookedHalls, name) {
            var eventTypeFromBookedHall = _.filter(bookedHalls, function(bookedHall) {
                return bookedHall.mSelectedEventType.name === name;
            });

            return eventTypeFromBookedHall.length;
        };

        CommonService.findBookedHallsByMonth = function(bookedHalls, date) {
            var monthHallList = _.filter(bookedHalls, function(bookedHall) {
                var bookedHallStartTime = new Date(bookedHall.mStartDateTime);
                return ((bookedHallStartTime.getFullYear() === date.getFullYear()) && (bookedHallStartTime.getMonth() === date.getMonth()));
            });

            return monthHallList;
        };

        CommonService.findBookedHallsByWeek = function(bookedHalls, date) {
            var weekHallList = _.filter(bookedHalls, function(bookedHall) {
                var bookedHallStartTime = new Date(bookedHall.mStartDateTime);
                return ((bookedHallStartTime.getFullYear() === date.getFullYear()) && (bookedHallStartTime.getMonth() === date.getMonth()) && (getWeekEndOfTheMonth(bookedHallStartTime) === getWeekEndOfTheMonth(date)));
            });

            return weekHallList;
        };

        CommonService.findBookedHallsByDay = function(bookedHalls, date) {
            var dayHallList = _.filter(bookedHalls, function(bookedHall) {
                var bookedHallStartTime = new Date(bookedHall.mStartDateTime);
                return ((bookedHallStartTime.getFullYear() === date.getFullYear()) && (bookedHallStartTime.getMonth() === date.getMonth()) && (bookedHallStartTime.getDate() === date.getDate()));
            });

            return dayHallList;
        };

        CommonService.sumOfArray = function(array) {
            return _.reduce(array, function(sum, n) {
                return sum + n;
            }, 0);
        };

        function rateSummariesByDateImpl(rateSummaries, date) {
            var summaries = _.filter(rateSummaries, function(summary) {
                var createdHallEffectiveDate = new Date(summary.effectiveDate);
                return ((createdHallEffectiveDate.getFullYear() === date.getFullYear()) && (createdHallEffectiveDate.getMonth() === date.getMonth()) && (createdHallEffectiveDate.getDate() === date.getDate()));
            });

            return summaries;
        }

        function getWeekEndOfTheMonth(bookedDate) {
            var date = bookedDate.getDate();
            var day = bookedDate.getDay();
            var weekOfMonth = Math.ceil((date - 1 - day) / 7);
            return weekOfMonth;
        };

        CommonService.hasContainsReceiptNumber = function(counters) {
            var isPresent = _.includes(_.map(counters, 'counterName'), RECEIPT);
            return isPresent;
        };

        CommonService.hasContainsInvoiceNumber = function(counters) {
            var isPresent = _.includes(_.map(counters, 'counterName'), INVOICE);
            return isPresent;
        };

        return CommonService;

    }]);

}).call(this);

//# sourceMappingURL=PageCtrl.js.map