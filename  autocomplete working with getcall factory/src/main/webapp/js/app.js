var myapp = angular.module('myapp', ['app']);

myapp.controller('myController',function($scope,getCallFactory){
	getCallFactory.get('cities.json')
	.then(function(data){
		$scope.items=data;		
	});
	$scope.name="";
	$scope.onItemSelected=function(){
 }
});
