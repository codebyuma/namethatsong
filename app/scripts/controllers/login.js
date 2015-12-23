'use strict';
angular.module('ntsApp').controller('loginCtrl', function($scope, $rootScope, $http) {
          var stateKey = 'spotify_auth_state';
          
          // implicit grant flow

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

          /*XMLHttpRequest cannot load https://accounts.spotify.com/authorize?response_type=token&client_id=7025ce…user-read-email&redirect_uri=http://localhost:9000/&state=YcVUpXF4n9M4RKeg. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:9000' is therefore not allowed access.*/

          $scope.requestAuth = function (){
              var state = generateRandomString(16);
              localStorage.setItem(stateKey, state);

                var url = 'https://accounts.spotify.com/authorize'
                    url += '?response_type=token';
                    url += '&client_id=' + '7025ce5e8b8d4e839abd1fc0ba0fff17';
                    url += '&scope=' + 'user-read-private user-read-email';
                    url += '&redirect_uri=' + 'http://localhost:9000/';
                    url += '&state=' + generateRandomString(16);


                return $http.get(url)
                .then (function(response){
                  console.log('response: ', response.data);
                  return response.data;
                }, function (error){
                  //console.log('failed auth', error.data.error.message);
                  console.log('failed auth', error);
                  return error;
                });


          }



          // call requestAuth, then call getProfile to display it. 
          // will ADD TOKEN to scope for use in rest of app
          $scope.loginUser = function (){
            
            $scope.requestAuth()
            .then(function (response){

              var params = getHashParams();
              $scope.access_token = params.access_token;
              var state = params.state,
              storedState = localStorage.getItem(stateKey);

                if ($scope.access_token && (state == null || state !== storedState)) {
                  alert('There was an error during the authentication');
                } else {
                  localStorage.removeItem(stateKey);
                  if ($scope.access_token) {

                    $scope.getProfile($scope.access_token)
                    .then (function(response){
                      console.log("wooo", response);
                      $scope.loggedIn = true;
                    })

                  } else {
                      // $('#login').show();
                      // $('#loggedin').hide();
                      $scope.loggedIn = false;
                  }
                }

            }, function (error){
              console.log("error", error);
            });
            

          }

          // once user has authorized and we have their token, use it to get profile info
          // make get request to spotify/me
          // ALSO ADD TOKEN TO SCOPE
          $scope.getProfile = function (token){
            console.log("in get profile");

            var url = 'https://api.spotify.com/v1/me';
            $http.defaults.headers.common.Authorization = 'Bearer ' + token;

            return $http.get(url)
            .then (function(response){
              console.log('response for profile request: ', response.data);
              return response.data;
            }, function (error){
              console.log('failed to get profile', error.data);
              return error;
            });

          }

          // 1. get request to https://accounts.spotify.com/authorize
            // include client_id, response_type, redirect_uri, state, scope, show_dialog
            // https://accounts.spotify.com/authorize?client_id=5fe01282e94241328a84e7c5cc169164&redirect_uri=http:%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&response_type=token&state=123

          // 2. user authorzies

          // 3. user redirected to your specified uri. the url includes a hash fragment with the following data encoded as a query string
            // access_token - use in subsequent calls to api
            // token_type - "Bearer"
            // expires_in - time period in seconds
            // state - state param provided in request
            // https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123

          // 4. use the access token to access the spotify API



         //------------


            // $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
            // var spotifyUrl = 'https://api.spotify.com/v1/me';

         

            //     $scope.login = function() {
            //       console.log("in login");
            //         var client_id = '7025ce5e8b8d4e839abd1fc0ba0fff17'; // Your client id
            //         var redirect_uri = 'http://localhost:9000/'; // Your redirect uri
            //         var state = generateRandomString(16);
            //         localStorage.setItem(stateKey, state);
            //         var scope = 'user-read-private user-read-email';
            //         var url = 'https://accounts.spotify.com/authorize';
            //         url += '?response_type=token';
            //         url += '&client_id=' + encodeURIComponent(client_id);
            //         url += '&scope=' + encodeURIComponent(scope);
            //         url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
            //         url += '&state=' + encodeURIComponent(state);

            //         $scope.getAuth(url)
            //             .then(function(response) {
            //                 console.log("response in login", response)
            //             })
            //             // window.location = url;
            //     };


            //     $scope.getAuth = function(url) {
            //         return $http.get(url)
            //             .then(function(response) {
            //                 console.log("response", response);
            //                 // then put the response data onto scope for display

            //                 //userProfilePlaceholder.innerHTML = userProfileTemplate(response);
            //                 // $('#login').hide();
            //                 // $('#loggedin').show();
            //                 $scope.loggedIn = true;
            //                 return response.data;;
            //             }, function(error) {
            //                 console.log("error", error);
            //                 return error;
            //             })
            //     }

            // })

    


     })


// authorzation flow (with my secret)
          // 1. get request to https://accounts.spotify.com/authorize
              // include client_id, request_type, state, scope, redirect_uri, show_dialog (true)
              // GET https://accounts.spotify.com/authorize/?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&state=34fFs29kd09

          // 2. user will have to take action

          // 3. user is redirected to the redirect_uri
            // if user has accepted, response query string contains: - SHOULD PARSE THIS. ex. https://example.com/callback?error=access_denied&state=STATE
              // code - authoerization code that can be exchanged for access token
              // state - value of state param supplied in the request (check)
            // if user doesn't accept or error, response query string contains:
              // error and state

          // 4. post request to https://accounts.spotify.com/api/token
          // send authorization code to get the access token
          // post request body should contain grant_type ("authorization_code")
          // code (from above) and redirect_uri (should be same as above for validation), client_id and client_secret in the body
          // 5
          // 6


