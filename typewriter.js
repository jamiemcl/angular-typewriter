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
        scope.cursor = scope.cursor || true;
        
        if(scope.cursor){
          var contentCursor = angular.element('<span class="cursor"> |</span>');
          contentCursor.insertAfter(element);
          $compile(contentCursor)(scope);
        }
        
        scope.typewrite_msgs = function(element, messages, messages_index, n, loop){
          var end = n + 1;
          var letter = messages[messages_index].substring(n,end);

          if(n < messages[messages_index].length + 1){
            if(letter === '<') {
              var endIcon = messages[messages_index].indexOf('/>') + 2;
              var icon = messages[messages_index].substring(n,endIcon);
              element.html(messages[messages_index].substring(0,n));
              element.append(icon);
            } else {
              element.html(messages[messages_index].substring(0,n));
            }
            if(typeof icon === 'undefined') {
              $timeout(function(){
                scope.typewrite_msgs(element, messages, messages_index, n+1, loop);
              }, scope.typeSpeed);
            } else {
              $timeout(function(){
                scope.typewrite_msgs(element, messages, messages_index, endIcon+1, loop);
              }, scope.typeSpeed);
            }
          }
          else if(messages_index+1 < messages.length){ // LOOPING BACK AROUND
            $timeout(function(){
              scope.typewrite_msgs(element, messages, messages_index+1, 0, loop);
            }, scope.loopDelay);
          }
          else if(scope.loop) {
            $timeout(function(){
              scope.typewrite_msgs(element, messages, 0, 0, loop);
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

