var autocomplete = angular.module('app', []);


autocomplete.directive('dhAutocomplete', ['$filter','$timeout',function($filter,$timeout) {
	return {
		restrict: 'E',
		scope: {
			items: '=',
			holder:'@',
			display: '@',
			model: '=',
			onSelect:'&',
			limit:'@'
		},
		
		link:function(scope,elem,attrs){
			
			scope.$index=0;
			elem.bind("keydown", function (event) {
				
				if(event.which === 13) {
					var list = $filter('filter')(scope.items, scope.model);
					scope.handleSelection(list[scope.current].name);
					scope.$apply();
				    event.preventDefault();
			    }
				
				else if(event.which === 38) {
					if(scope.$index>0){
					scope.$index=scope.current;
					scope.$index--;
				    scope.setCurrent(scope.$index);
				    scope.$apply();
				    event.preventDefault();
				    }
					event.preventDefault();
				}
				
				else if(event.which === 40) {
					var lim=document.getElementsByClassName("list").length;
					if(scope.$index < (lim-1)){
         			scope.$index=scope.current;
					scope.$index++;
				    scope.setCurrent(scope.$index);
				    scope.$apply();
				    event.preventDefault();
					}
				}
				else if(event.which === 8) {
					scope.current=0;
					scope.setCurrent(scope.current);
					scope.$index=scope.current;
					scope.$apply();
					}
				
			});
			
			scope.handleSelection=function(selectedItem){
				scope.model=selectedItem;
				scope.current=0;
				scope.selected=true;        
				$timeout(function(){
					scope.onSelect();
				},200);
			};
			scope.current=0;
			scope.selected=true;
			scope.isCurrent=function(index){
				return scope.current==index;
			};
			scope.setCurrent=function(index){
				scope.current=index;
			};
			
		
			
		},
		
		 
		
		template: '<input type="text" ng-model="model" placeholder="{{holder}}" ng-keydown="selected=false"/><br />'+
		          '<div ng-hide="!model.length || selected" class="divlist">'+ 
		          '<div class="divitem" ng-repeat="item in items | filter:model | limitTo:limit||7 track by $index"'+ 
		          'ng-class="{active:isCurrent($index)}"'+ 
		          'ng-click="handleSelection(item[display])" style="cursor:pointer"'+
		          'ng-mouseenter="setCurrent($index)">'+ 
		          '<ul class="list" ng-model="displist" ng-bind-html="item.{{display}} | highlight:model"'+
		          '<li tabindex={{$index}} value={{item[display]}}>{{item[display]}}</li>'+
		          '</ul>'+
		          '</div>'+
		          '</div>'
		          
	}
}]);

autocomplete.filter('highlight', function($sce) {
    return function(text, phrase) {
      if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
        '<span class="highlighted">$1</span>')
      return $sce.trustAsHtml(text)
    }
  });

autocomplete.factory('getCallFactory', function($http) {
	return {
		get: function(url) {
			return $http.get(url)
			.then(function(resp) {
				return resp.data;
			});
		}
	};
});
