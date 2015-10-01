angular.module("nate.util", [])
.directive("resizeable", [function(){
  return {
    restrict: "EA",
    scope:[],
    link: function(scope, element, attrs){
      console.log("Directive...");
      element.on("mouseup", function(e){
        console.log("mouse up");
      });
    }
  }
}])
.directive("typewriter", ["$timeout", "$compile", function($timeout, $compile){
  return {
    restrict: "EA",
    template: "",
    scope: {
      typeSpeed: '@',
      loop: '=loop',
      loopDelay: '@',
      cursor: '=cursor',
      messages: '=',
    },
    link: function(scope, element, attrs){

      $timeout(function(){
      
        scope.typeSpeed = scope.typeSpeed || 100;
        scope.loopDelay = scope.loopDelay || 2000;
        scope.cursor = scope.cursor || true;;
        
        if(scope.cursor){
          var contentCursor = angular.element('<span class="cursor"> |</span>');
          contentCursor.insertAfter(element);
          $compile(contentCursor)(scope);
        }
        
        scope.typewrite_msgs = function(element, text_array, array_idx, n, loop){
          if(n<text_array[array_idx].length+1){
            element.html(text_array[array_idx].substring(0,n));
            $timeout(function(){
              scope.typewrite_msgs(element, text_array, array_idx, n+1, loop);
            }, scope.typeSpeed);
          }
          else if(array_idx+1 < text_array.length){
            $timeout(function(){
              scope.typewrite_msgs(element, text_array, array_idx+1, 0, loop);
            }, scope.loopDelay);
          }
          else if(scope.loop) {
            $timeout(function(){
              scope.typewrite_msgs(element, text_array, 0, 0, loop);
            }, scope.loopDelay);
          }
        }
        
        if(scope.messages){
          scope.typewrite_msgs(element, scope.messages, 0, 0, scope.loop);
        }
      }, 1000);
    }
  }	
}]);

