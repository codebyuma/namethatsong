'use strict';


angular.module('ntsApp').controller('MainCtrl', function($scope, $rootScope, SongsFactory, ngAudio, $timeout, $http, $state) {

    /*** --------- Intitial Spotify Auth stuff --------- ***/
    $rootScope.stateKey = 'spotify_auth_state';
    var params = getHashParams();
    $rootScope.access_token = params["/access_token"];
    var spotifyState = params.state,
    storedSpotifyState = localStorage.getItem($rootScope.stateKey);


    /*** --------- Variable declarations and initializations --------- ***/

    $scope.start = true;
    $rootScope.gameOver = false;
    $scope.guessing = false;
    $rootScope.ready = false;
    $scope.haveResult = false;
    $scope.correct = false;
    $scope.winner = false;
    $rootScope.haveRounds = false;

    $scope.songList = [];
    $scope.songs = [];
    $rootScope.maxRounds = 10;
    $rootScope.round = 0;
    $rootScope.score = 0;
    $scope.myGuess = {};
    $scope.wins = 0;
    $scope.roundsRange = _.range(1, 10);


    /*** --------- Spotify Auth Functions --------- ***/

    // Obtains parameters from the hash of the URL
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    // Generates a random string containing numbers and letters
    function generateRandomString(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    // once user has authorized and we have their token, use it to get profile info
    $scope.getProfile = function(token) {
        var url = 'https://api.spotify.com/v1/me';
        $http.defaults.headers.common.Authorization = 'Bearer ' + token;
        return $http.get(url)
            .then(function(response) {
                return response.data;
            }, function(error) {
                return error;
            });
    }


    // when we load this state, check for Spotify access token and request profile info 
    // or redirect to login 
    if ($rootScope.access_token && (spotifyState == null || spotifyState !== storedSpotifyState)) {
        // console.log('There was an error during the authentication');
        $state.go('login');
    } else {
        localStorage.removeItem($rootScope.stateKey);
        if ($rootScope.access_token) {
            $scope.getProfile($rootScope.access_token)
                .then(function(response) {
                    $rootScope.username = response.id;
                    $rootScope.email = response.email;
                    $rootScope.country = response.country;
                    $scope.loggedIn = true;
                })

        } else {
            $scope.loggedIn = false;
        }
    }

    /*** --------- Game Play Functions --------- ***/

    $scope.categoryOptions = SongsFactory.getCategories();

    $scope.submitRounds = function() {
        $rootScope.maxRounds = $scope.rounds.number;
        $rootScope.haveRounds = true;
    }

    function getNextSong() {

        var num = Math.floor(Math.random() * ($scope.songList.length - 1));
        while ($scope.songList && $scope.songList[num].played) {
            num = Math.floor(Math.random() * ($scope.songList.length - 1));
        }
        return num;
    }

    $scope.buzzIn = function() {
        $scope.songs[$scope.currentSong].pause();

        // SHUFFLE
        $scope.songList.forEach(function(song) {
            song.guessChoices = shuffleArray(song.guessChoices);
        })

        $scope.guessing = true;
    }

    $scope.timesUp = function() {
        if ($rootScope.round < $rootScope.maxRounds) {
            $scope.gameOverMessage = "You're out of time!";
        } else {
            if ($scope.wins === $rootScope.maxRounds) {
                $scope.winner = true;
                $scope.gameOverMessage = "Congratulations superstar! You won all " + $scope.maxRounds + " rounds!";
            } else {
                $scope.gameOverMessage = "Game over!";
            }

        }
        $scope.songs[$scope.currentSong].pause();
        $rootScope.gameOver = true;

        $timeout(function() {
            $scope.songList = [];
            $scope.songs = [];
            $rootScope.round = 0;
            $rootScope.gameOver = false;
            $scope.start = true;
            $rootScope.ready = false;
            $scope.$broadcast('timer-reset');
            $rootScope.haveRounds = false;
        }, 3000)



    }

    $scope.addSongs = function() {
        var type = $scope.category.type;
        $scope.start = false;
        $rootScope.score = 0;
        $rootScope.round++;
        $scope.wins = 0;


        SongsFactory.getSongList(type)
            .then(function(songs) {

                songs.items.forEach(function(song) {
                    if (song) {
                        if (song.track.preview_url != null && song.track.artists[0].name != "Various Artists") {
                            $scope.songList.push({
                                name: song.track.name,
                                artist: mergeArtists(song.track.artists),
                                combinedSongInfo: song.track.name + " by " + mergeArtists(song.track.artists),
                                artist_id: song.track.artists[0].uri.split(":")[2],
                                played: false
                            });
                            $scope.songs.push(ngAudio.load(song.track.preview_url));
                        }
                    }
                })

                $rootScope.gameOver = false;
                $scope.guessing = false;
                $scope.currentSong = getNextSong();
                $scope.loadGuessOptions();
            })

    };

    var mergeArtists = function(arrOfArtists) {
        if (arrOfArtists.length === 1)
            return arrOfArtists[0].name
        else {
            var result = [];
            arrOfArtists.forEach(function(artist) {
                result.push(artist.name);
            })
            return result.join(", ");
        }
    }

    $scope.loadGuessOptions = function() {
        var count = $scope.songList.length;
        $scope.songList.forEach(function(song) {
            song.guessChoices = [{
                artist: song.artist,
                song: song.name,
                combinedSongInfo: song.name + " by " + song.artist
            }];
            SongsFactory.getRelatedArtists(song.artist_id)
                .then(function(_artists) {
                    if (_artists.length < 3) {
                        song.played = true;
                    }
                    _artists.forEach(function(artist) {
                        SongsFactory.getRelatedSongs(artist.uri.split(":")[2])
                            .then(function(relatedSong) {
                                song.guessChoices.push({
                                    artist: artist.name,
                                    song: relatedSong,
                                    combinedSongInfo: relatedSong + " by " + artist.name
                                })

                            })
                    })
                })
            if (count > 1) {
                count--;
            } else {
                $timeout(function() {
                    $rootScope.ready = true;
                    $scope.winner = false;

                }, 1000);

            }
        })
    }


    var shuffleArray = function(array) {
        var m = array.length,
            t, i;

        // While there remain elements to shuffle
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];

            array[i] = t;
        }

        return array;
    }

    $scope.startTimer = function() {
        $scope.correct = true;
        $scope.$broadcast('timer-reset');
        $scope.haveResult = false;
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;

    }

    $scope.stopTimer = function() {
        $scope.$broadcast('timer-stop');
        $scope.$broadcast('timer-reset');
        $scope.timerRunning = false;
    }

    $scope.submitGuess = function() {

        $scope.$broadcast('timer-reset');
        $scope.haveResult = false;
        $scope.result = "";
        var songToGuess = $scope.songList[$scope.currentSong].combinedSongInfo;
        $scope.songList[$scope.currentSong].played = true;
        $scope.haveResult = true;

        if (songToGuess === $scope.myGuess.guess) {

            $scope.correct = true;
            $scope.wins++;
            $scope.result = "Woo! You are correct!";
            $scope.answer = "The answer is: " + songToGuess;
            $rootScope.score = Math.floor($rootScope.score + 1 + $scope.songs[$scope.currentSong].remaining);
            //Math.floor($scope.songs[$scope.currentSong].currentTime)

        } else {
            $scope.correct = false;
            $scope.result = "Doh! That's wrong.";
            $scope.answer = "The correct answer is: " + songToGuess;
        }

        if ($rootScope.round < $rootScope.maxRounds) {
            $scope.guessing = false;
            $rootScope.round++;
            $rootScope.ready = false;

            $timeout(function() {

                $rootScope.ready = true;
                $scope.currentSong = getNextSong();

            }, 2000);

        } else {
            $scope.songs[$scope.currentSong].pause();
            $rootScope.ready = false;
            $scope.guessing = false;

            $timeout(function() {

                $scope.timesUp();
                $scope.haveResult = false;
                $scope.result = "";

            }, 2000);

        }
        $scope.guess = null;
    }

    $scope.haveSongs = function() {
        return $scope.songList.length > 0;
    }

});