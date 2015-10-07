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
        scope.loop = scope.loop || true;

        if(scope.cursor){
          var contentCursor = angular.element('<span class="cursor"> |</span>');
          contentCursor.insertAfter(element);
          $compile(contentCursor)(scope);
        }

        var iconEndIndexs = [];
        var count = 0;
        
        scope.typewrite_msgs = function(element, messages, messages_index, n, loop){

          var end = n + 1;
          var sentence = messages[messages_index];
          var singleLetter = sentence.substring(n,end);

          if(n < sentence.length + 1){

            // If start of html tag - perform magic
            if(singleLetter === '<') {
              for (var i = sentence.indexOf('/>'); i >= 0; i = sentence.indexOf('/>', i + 1)) {
                iconEndIndexs.push(i);
              }

              var endIcon = iconEndIndexs[count] + 2;
              var icon = sentence.substring(n, endIcon); // Find the icon in sentence 
              element.html(sentence.substring(0,n)); // Get Everything up until icon...
              element.append(icon); // then append the icon

              count++;
            } else {
              element.html(sentence.substring(0,n));
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
            iconEndIndexs = [];
            count = 0;
            $timeout(function(){
              scope.typewrite_msgs(element, messages, messages_index+1, 0, loop);
            }, scope.loopDelay);
          }
          else if(scope.loop) {
            iconEndIndexs = [];
            count = 0;
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

