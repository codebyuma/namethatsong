'use strict';
angular.module('ntsApp').controller('loginCtrl', function($scope, $rootScope, $http) {

    /*** --------- Spotify Auth Functions - Implicit Grant Flow --------- ***/

    $scope.stateKey = 'spotify_auth_state';

    // Generates a random string containing numbers and letters
    function generateRandomString(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    // Following Spotify's process to redirect to spotify.com/authorize via the browser for auth request
    $scope.spotifyLoginUser = function() {
        var state = generateRandomString(16);
        localStorage.setItem($scope.stateKey, state);

        var url = 'https://accounts.spotify.com/authorize'
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent('7025ce5e8b8d4e839abd1fc0ba0fff17');
        url += '&scope=' + encodeURIComponent('user-read-private user-read-email');
        url += '&redirect_uri=' + encodeURIComponent('https://namethatsong.firebaseapp.com/');
        //url += '&redirect_uri=' + encodeURIComponent('http://localhost:9000');
        url += '&state=' + encodeURIComponent(state);

        window.location = url;


    }

})