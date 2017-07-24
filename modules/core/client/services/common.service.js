(function() {
    'use strict';
    angular.module('core')

    .factory('CommonService', ['$http', function($http) {

        var CommonService = {};

        CommonService.findRateSummariesByDateBeforeSave = function(rateSummaries, date) {
            return rateSummariesByDateImpl(rateSummaries, date);
        };

        CommonService.findRateSummariesByDate = function(rateSummaries, date) {
            var summaries = rateSummariesByDateImpl(rateSummaries, date);
            if (summaries.length > 0) {
                return summaries;
            } else {
                var previousDate = date.setDate(date.getDate() - 1);
                return CommonService.findRateSummariesByDate(rateSummaries, new Date(previousDate));
            }
        };

        CommonService.getTaxRateByName = function(taxes, name) {
            var taxArray = _.filter(taxes, function(tax) {
                return tax.name === name;
            });
            return taxArray[0].percentage;
        };

        function rateSummariesByDateImpl(rateSummaries, date) {
            var summaries = _.filter(rateSummaries, function(summary) {
                var createdHallEffectiveDate = new Date(summary.effectiveDate);
                return ((createdHallEffectiveDate.getFullYear() === date.getFullYear()) && (createdHallEffectiveDate.getMonth() === date.getMonth()));
            });

            return summaries;
        }

        return CommonService;

    }]);

}).call(this);

//# sourceMappingURL=PageCtrl.js.map