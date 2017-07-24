(function() {
    'use strict';
    angular.module('core')

    .factory('CommonService', ['$http', function($http) {

        var CommonService = {};

        CommonService.findRateSummariesByDate = function(rateSummaries, date) {
            var summaries = _.filter(rateSummaries, function(summary) {
                var createdHallEffectiveDate = new Date(summary.effectiveDate);
                return ((createdHallEffectiveDate.getFullYear() === date.getFullYear()) && (createdHallEffectiveDate.getMonth() === date.getMonth()));
            });

            return summaries;
        };

        CommonService.getTaxRateByName = function(taxes, name) {
            var taxArray = _.filter(taxes, function(tax) {
                return tax.name === name;
            });
            return taxArray[0].percentage;
        };

        return CommonService;

    }]);

}).call(this);

//# sourceMappingURL=PageCtrl.js.map