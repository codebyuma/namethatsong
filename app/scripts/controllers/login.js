'use strict';
angular.module('ntsApp').controller('loginCtrl', function($scope, $rootScope, $http) {
          var stateKey = 'spotify_auth_state';
          console.log("hash", getHashParams());

          var params = getHashParams();
              $scope.access_token = params["/access_token"];
              var state = params.state,
              storedState = localStorage.getItem(stateKey);

              console.log("params", params)
              console.log("access token", $scope.access_token)
              console.log("state", state)
              console.log("stored state", storedState);

                
          
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
              localStorage.setItem(stateKey, state);

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

          
             
          

          // once user has authorized and we have their token, use it to get profile info
          // make get request to spotify/me
          // ALSO ADD TOKEN TO SCOPE
          $scope.getProfile = function (token){
            

            var url = 'https://api.spotify.com/v1/me';
            $http.defaults.headers.common.Authorization = 'Bearer ' + token;

            return $http.get(url)
            .then (function(response){
              //console.log('response for profile request: ', response.data);
              return response.data;
            }, function (error){
              //console.log('failed to get profile', error.data);
              return error;
            });

          }

          if ($scope.access_token && (state == null || state !== storedState)) {
                  console.log('There was an error during the authentication');
                } else {
                  localStorage.removeItem(stateKey);
                  if ($scope.access_token) {

                    $scope.getProfile($scope.access_token)
                    .then (function(response){
                      $scope.email = response.email;
                      $scope.country = response.country;
                      $scope.loggedIn = true;
                    })

                  } else {

                      $scope.loggedIn = false;
                  }
                }

       


     })


