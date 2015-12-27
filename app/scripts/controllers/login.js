'use strict';
angular.module('ntsApp').controller('loginCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
          $rootScope.stateKey = 'spotify_auth_state';
          

          var params = getHashParams();
              $scope.access_token = params["/access_token"];
              var state = params.state,
              storedState = localStorage.getItem($rootScope.stateKey);

                
          
          // Spotify's implicit grant flow

        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }
        /**
         * Generates a random string containing numbers and letters
         * @param  {number} length The length of the string
         * @return {string} The generated string
         */
          function generateRandomString(length) {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < length; i++) {
              text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
          };

          // get auth from the user by making get request to spotify.com/authorize


          // making an http request to get auth doesn't work - they want us to redirect via the browser
          $scope.requestAuth = function (){
              var state = generateRandomString(16);
              localStorage.setItem($rootScope.stateKey, state);

                var url = 'https://accounts.spotify.com/authorize'
                    url += '?response_type=token';
                    url += '&client_id=' + encodeURIComponent('7025ce5e8b8d4e839abd1fc0ba0fff17');
                    url += '&scope=' + encodeURIComponent('user-read-private user-read-email');
                    url += '&redirect_uri=' + encodeURIComponent('http://localhost:9000/');
                    url += '&state=' + encodeURIComponent(state);

                    window.location = url;
                  

          }



          // call requestAuth, then call getProfile to display it. 
          // will ADD TOKEN to scope for use in rest of app
          $scope.loginUser = function (){
            $scope.requestAuth()
          }

          
     


     }])


