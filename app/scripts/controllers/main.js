'use strict';

/**
 * @ngdoc function
 * @name bidmotionTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bidmotionTestApp
 */
var url = 'http://api.geonames.org/countryInfoJSON?formatted=true&username=hydrane';
var INIT_VAL = 'ALL';

angular.module('bidmotionTestApp')
.controller('MainCtrl', function ($scope, $http, $filter/*, $resource*/) {

  	// default values
  	var _ = window._;
  	$scope.dataLoaded = false;
	$scope.countries = null;
	$scope.continentList = [INIT_VAL];
	$scope.metrics = [INIT_VAL, 'areaInSqKm', 'population'];
	$scope.maxResults = [5, 10, 15, 20];
	
	// default selected values
	$scope.selectedContinent = $scope.continentList[0];
	$scope.selectedMetrics = $scope.metrics[0];
	$scope.selectedMaxResults = $scope.maxResults[0];

	/*$scope.getCountries = function() {
    	$scope.test = $resource.Countries.get({ formatted: true, username: 'hydrane' }, function(res){
        	console.log($scope.test);
    	});
	};*/
  	var postTreatment = function(countries) {
  		countries = _.map(countries, function(c) {
  			c.population = parseFloat(c.population);
  			c.areaInSqKm = parseFloat(c.areaInSqKm);
  			return c;
  		});
  		$scope.countries = countries;
  		$scope.continentList = [INIT_VAL].concat(_.sortBy(_.uniq(_.map($scope.countries, 'continentName'))));
  		$scope.totalPopulation = $filter('sumFilter')($scope.countries);

  		$scope.chartOptions = {
		    options: {
		      chart: {
		        type: 'plot'
		      },
		      plotOptions: {
		        series: {
		          stacking: ''
		        }
		      }
		    },
		    series: _.map($scope.countries, 'areaInSqKm'),
		    title: {
		      text: 'Pie chart representing '+$scope.selectedMetrics
		    },
		    credits: {
		      enabled: true
		    },
		    loading: false,
		    size: {}
		};
		$scope.pieData = [{}];
  	};

  	$scope.orderListBy = function(orderingKey) {
  		var columns = ['continentName','countryName','population'];
  		$scope.countries = _.sortBy($scope.countries, columns[orderingKey]);
  	};

  	$scope.requestCallback = function() {
  		$http.get(url)
        .success(function(response) {
        	postTreatment(response.geonames);
        	$scope.dataLoaded = true;
		});
	};
    
})
.factory('Countries', ['$resource',
    function($resource) {
        return $resource('http://api.geonames.org/countryInfoJSON?:formatted&:username',
        	{formatted: '@formatted', username: '@username'}, {query: {isArray: true}, update: {method: 'GET'}
        });
    }
])
.filter('sumFilter', function() {
     return function(countries) {
         var total = 0;
         for (var i=0; i<countries.length; i++) {
             total = total + countries[i].population;    
          }
         return total;
     };
 })
.directive('hcChart', function () {
  	return {
  		restrict: 'E',
        template: '<div></div>',
        scope: {
            options: '='
        },
        link: function (/*$scope, $element*/) {
           //Highcharts.chart($scope.pieData, $scope.options);
        }
    };
});
