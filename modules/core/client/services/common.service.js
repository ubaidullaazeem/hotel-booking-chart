(function () {
	'use strict';
	angular
	.module('core')
    .factory('CommonService', CommonService);


	CommonService.$inject = ['$http', '$cookieStore', '$rootScope'];
	function CommonService('$http', '$cookieStore', '$rootScope') 
    {
		var service = {};
        service.findRateSummariesByDate = findRateSummariesByDate;

        return service;        

        function findRateSummariesByDate(rateSummaries, date) 
        {
            var summaries = _.filter(rateSummaries, function(summary) {
                var createdHallEffectiveDate = new Date(summary.effectiveDate);
                return ((createdHallEffectiveDate.getFullYear() === date.getFullYear()) && (createdHallEffectiveDate.getMonth() === date.getMonth()));
            });

            return summaries;
        }
        
    }

}).call(this);