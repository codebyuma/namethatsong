'use strict';

/**
 * @ngdoc function
 * @name ntsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ntsApp
 */
angular.module('ntsApp').controller('MainCtrl', function($scope, $rootScope, SongsFactory, Spotify, ngAudio, $state, $timeout) {


    $scope.categoryOptions = SongsFactory.getCategories();


    $scope.sound;

    $scope.start = true;
    $scope.songList = [];
    $scope.songs = [];
    $rootScope.maxRounds = 4;
    $rootScope.round = 0;
    $rootScope.score = 0;
    $rootScope.gameOver = false;

    $scope.guessing = false;
    $rootScope.ready = false;
    $scope.haveResult = false;

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
            $scope.gameOverMessage = "Game over!";
        }
        $scope.songs[$scope.currentSong].pause();
        $rootScope.gameOver = true;

        $timeout(function (){
        	$scope.songList = [];
       		 $scope.songs = [];
        	$rootScope.round = 0;
        	$scope.gameOver = false;
        	$scope.start = true;
	        $rootScope.ready = false;

        }, 2000)
        


    }

    $scope.addSongs = function() {
        var type = $scope.category.type;
        $scope.start = false;
        $rootScope.score = 0;
        $rootScope.round++;


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
        console.log("here then", $scope.songs[$scope.currentSong]);
        $scope.haveResult = false;
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;

    }

    $scope.stopTimer = function() {
        $scope.$broadcast('timer-stop');

        $scope.timerRunning = false;
    }
    $scope.myGuess = {};
    $scope.submitGuess = function() {

        $scope.$broadcast('timer-reset');
        $scope.haveResult = false;
        $scope.result = "";
        var songToGuess = $scope.songList[$scope.currentSong].combinedSongInfo;
        $scope.songList[$scope.currentSong].played = true;
        $scope.haveResult = true;

        if (songToGuess === $scope.myGuess.guess) {
            $scope.result = "You are correct!";
            $scope.answer = "The answer is: " + songToGuess;
            $rootScope.score = Math.floor($rootScope.score + 1 + $scope.songs[$scope.currentSong].remaining);
            //Math.floor($scope.songs[$scope.currentSong].currentTime)

        } else {
            $scope.result = "You are wrong!";
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