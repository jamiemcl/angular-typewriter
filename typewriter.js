angular.module("nate.util", [])
.directive("resizeable", [function(){
  return {
    restrict: "EA",
    scope:[],
    link: function(scope, element, attrs){
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
      messageList: '='
    },
    link: function(scope, element, attrs){

      var messageList = scope.messageList;
      var wordsArray = [];
      var count = 1;

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
        var iconChange = false;
        var sentence = '';
        var sentenceCount = 0;
        var currentIndex = 0;
        var diff = 0;
        var splitJoined = '';
        var splitJoinCount = 0;
        var iconCount = 0;

        angular.forEach(messageList, function(msg){
          msg.indiciesAndIcons = [];
        });

        scope.typewrite_msgs = function(element, messageList, messages_index, n, loop){


          var set = messageList[messages_index];

          if(!sentence) {
            sentence = set.text;
          }

          if(diff) {
            angular.forEach(messageList, function(msg){
              msg.indiciesAndIcons = [];
            });
          }

          var splitWithIndex = sentence.splitWithIndex(' ');

          var indicies = [];
          angular.forEach(splitWithIndex, function(index){
            indicies.push(index[0]);
          });

          
          angular.forEach(set.wordsAndIcons, function(item){

            if(sentenceCount < set.wordsAndIcons.length) {
              angular.forEach(item.words, function(word){
                if(splitWithIndex[word] !== undefined) {
                  // Push index, word e.g. Books, and actual icon name
                  set.indiciesAndIcons.push([splitWithIndex[word][0] + diff, splitWithIndex[word][1], item.icon]);
                }
              });
              diff = 0;
              sentenceCount++;
            }
          });
          
          // WRITE ICONS AND WORDS TO TYPEWRITER
          if(n < sentence.length + 1){

            if(set.indiciesAndIcons.length) {
              angular.forEach(set.indiciesAndIcons, function(set, key){

                if(key === iconCount) {
                  var glyphPath = 'glyphicon glyphicon-' + set[2];
                  icon = '<i class="' + glyphPath + '"/>';
                }

                if(!diff) {
                  // initial Index, length of word + 1
                  var nextHit = set[0] + set[1].length;

                  if(sentence.length !== nextHit) {
                    nextHit = nextHit + 1;
                  }
                } else {
                  var nextHit = set[0];
                }
                if(n === nextHit) {

                  var after = sentence.substring(set[0] + set[1].length);
                  sentence = sentence.substring(0, set[0]) + icon;

                  diff = icon.length - set[1].length;

                  sentenceCount = 0;

                  currentIndex = sentence.length;
                  n = currentIndex;

                  sentence = sentence + after; 

                  iconCount++;
                }

              });
            }

            // If start of html tag - perform magic

            element.html(sentence.substring(0,n));

            $timeout(function(){
                scope.typewrite_msgs(element, messageList, messages_index, n+1, loop);
            }, scope.typeSpeed);

          } 

          else if(messages_index+1 < messageList.length){ // LOOPING TO NEXT MESSAGE
            iconEndIndexs = [];
            sentence = '';
            currentIndex = 0;
            diff = 0;
            splitJoined = '';
            splitJoinCount = 0;
            sentenceCount = 0;
            iconCount = 0;
            $timeout(function(){
              scope.typewrite_msgs(element, messageList, messages_index+1, 0, loop);
            }, scope.loopDelay);
          }
          else if(scope.loop) { // LOOPING BACK TO START
            iconEndIndexs = [];
            sentence = '';
            currentIndex = 0;
            diff = 0;
            splitJoined = '';
            splitJoinCount = 0;
            sentenceCount = 0;
            iconCount = 0;
            $timeout(function(){
              scope.typewrite_msgs(element, messageList, 0, 0, loop);
            }, scope.loopDelay);
          }
        }

        String.prototype.splitWithIndex=function(delim){

          var ret = [];
          var splits = this.split(delim);
          var index = 0;
          var changedCount = 0;

          for(var i=0; i < splits.length; i++){

            if(splits[i].indexOf('<i') >= 0 && splits[i+1].indexOf('glyphicon') >= 0 && splits[i+2].indexOf('glyphicon') >= 0) {
              if(splitJoinCount === 0) {
                var groupedIcon = splits[i] + ' ' + splits[i+1] + ' ' + splits[i+2];
                splitJoinCount++;
              }
              splitJoined = groupedIcon;

              ret.push([index,splitJoined]);
              index += splitJoined.length+delim.length;

              var iconChanged = true;
            } else {
              if(changedCount < 1 && iconChanged && splits[i+2]!==undefined) {
                i = i+2;
                changedCount++;
              }
              ret.push([index,splits[i]]);
              index += splits[i].length+delim.length;              
            }
          }
          splitJoined = '';
          splitJoinCount = 0;
          return ret;
        };

        if(scope.messageList){
          scope.typewrite_msgs(element, messageList, 0, 0, scope.loop);
        }

      }, 1000);
    }
  }	
}]);

