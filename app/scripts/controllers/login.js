'use strict';
angular.module('ntsApp').controller('loginCtrl', function($scope, $rootScope, $http) {

			$scope.loggedIn = false;

            var stateKey = 'spotify_auth_state';
            /**
             * Obtains parameters from the hash of the URL
             * @return Object
             */
            function getHashParams() {
                var hashParams = {};
                var e, r = /([^&;=]+)=?([^&;]*)/g,
                    q = window.location.hash.substring(1);
                    console.log("in gethashparams, q", q);
                     console.log("in gethashparams, window location hash", window.location.hash);
                while (e = r.exec(q)) {
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

            // var userProfileSource = $('user-profile-template').innerHTML,
            //     //userProfileTemplate = Handlebars.compile(userProfileSource),
            //     userProfilePlaceholder = $('user-profile');
            // var oauthSource = $('oauth-template').innerHTML,
            //     //oauthTemplate = Handlebars.compile(oauthSource),
            //     oauthPlaceholder = $('oauth');

            // use the return URL to get the various variabls    
            var params = getHashParams();
            var access_token = params.access_token,
                state = params.state,
                storedState = localStorage.getItem(stateKey);
                console.log("params", params);
                console.log("LOCAL STORAGE? ", localStorage);
                console.log("access token?", access_token);
                 console.log("state", state);
                  console.log("storedState", storedState);

            if (access_token && (state == null || state !== storedState)) {
                alert('There was an error during the authentication');
            } else {
                localStorage.removeItem(stateKey);
                if (access_token) {
                    console.log("access_token", access_token);
                    $http.get({
                        url: 'https://api.spotify.com/v1/me',
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        }})
                    .then (function(response) {
                        	console.log("response", response);
                            //userProfilePlaceholder.innerHTML = userProfileTemplate(response);
                            // $('#login').hide();
                            // $('#loggedin').show();
                            $scope.loggedIn = true;
                        })
                    // });
                } else {
                    // $('#login').show();
                    // $('#loggedin').hide();
                    $scope.loggedIn = false;
                }
            }

                $scope.login = function() {

                    console.log("in login");
                    // $('login-button').addEventListener('click', function() {
                    var client_id = '7025ce5e8b8d4e839abd1fc0ba0fff17'; // Your client id
                    var redirect_uri = 'http://localhost:9000/'; // Your redirect uri
                    var state = generateRandomString(16);
                    localStorage.setItem(stateKey, state);
                    var scope = 'user-read-private user-read-email';
                    var url = 'https://accounts.spotify.com/authorize';
                    url += '?response_type=token';
                    url += '&client_id=' + encodeURIComponent(client_id);
                    url += '&scope=' + encodeURIComponent(scope);
                    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
                    url += '&state=' + encodeURIComponent(state);
                    
                    window.location = url;
                    console.log("url: url");

			                   
                };


            });



          
  // <script id="user-profile-template" type="text/x-handlebars-template">
  //     <h1>Logged in as {{display_name}}</h1>
  //     <div class="media">
  //       <div class="pull-left">
  //         <img class="media-object" width="150" src="{{images.0.url}}" />
  //       </div>
  //       <div class="media-body">
  //         <dl class="dl-horizontal">
  //           <dt>Display name</dt><dd class="clearfix">{{display_name}}</dd>
  //           <dt>Id</dt><dd>{{id}}</dd>
  //           <dt>Email</dt><dd>{{email}}</dd>
  //           <dt>Spotify URI</dt><dd><a href="{{external_urls.spotify}}">{{external_urls.spotify}}</a></dd>
  //           <dt>Link</dt><dd><a href="{{href}}">{{href}}</a></dd>
  //           <dt>Profile Image</dt><dd class="clearfix"><a href="{{images.0.url}}">{{images.0.url}}</a></dd>
  //           <dt>Country</dt><dd>{{country}}</dd>
  //         </dl>
  //       </div>
  //     </div>
  //   </script>

  //   <script id="oauth-template" type="text/x-handlebars-template">
  //     <h2>oAuth info</h2>
  //     <dl class="dl-horizontal">
  //       <dt>Access token</dt><dd class="text-overflow">{{access_token}}</dd>
  //     </dl>
  //   </script>
