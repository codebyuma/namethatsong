'use strict';

/**
 * @ngdoc function
 * @name ntsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ntsApp
 */
angular.module('ntsApp').controller('MainCtrl', function ($scope, SongsFactory, Spotify, ngAudio, $state, $firebaseObject, $firebaseArray, $timeout) {


	// var ref = new Firebase("https://incandescent-fire-7627.firebaseio.com");
	// // download the data from ref onto a local object. this is an async request
	// var syncObject = $firebaseObject(ref);
	// // synchronize the object with a three-way data binding. As we update the data object, it syncs it across
	// syncObject.$bindTo($scope, "data");

	// var refTest = new Firebase("https://incandescent-fire-7627.firebaseio.com/tests");
	// $scope.testArray = $firebaseArray(refTest);



  $scope.categoryOptions = SongsFactory.getCategories();


     $scope.sound;

     $scope.start = true;
     $scope.songList = [];
     $scope.songs = [];
     $scope.maxRounds = 4;
     $scope.round = 0;
     $scope.gameOver = false;

     $scope.guessing = false;
     $scope.ready = false;
     $scope.haveResult = false;




     function getNextSong() {

		var num = Math.floor((Math.random() * $scope.songList.length-1));
		console.log("is played?", $scope.songList[num].played)
		while ($scope.songList && $scope.songList[num].played){
			console.log("is played?", $scope.songList[num].played)
			num = Math.floor((Math.random() * $scope.songList.length-1));
		}
		return num;
	}

	$scope.buzzIn = function (){
		$scope.songs[$scope.currentSong].pause();
     	// SHUFFLE
     	$scope.songList.forEach(function(song){
     		song.guessChoices=shuffleArray(song.guessChoices);
     	})
		$scope.guessing = true;
	}

	$scope.timesUp = function (){
		$scope.gameOver = true;
			$scope.songList = [];
		    $scope.songs = [];
		    $scope.round = 0;
		    $scope.start = true;
		    $scope.ready = false;


	}

     $scope.addSongs = function () {
     	var type = $scope.category.type;
     	$scope.start = false;
     	$scope.score = 0;
     	

		SongsFactory.getSongList(type)
		.then (function (songs){

			songs.items.forEach(function (song){
				if (song){
					if (song.track.preview_url != null){
						$scope.songList.push({
							name: song.track.name,
							artist: mergeArtists(song.track.artists),
							combinedSongInfo: song.track.name + " by " + mergeArtists(song.track.artists),
							artist_id: song.track.artists[0].uri.split(":")[2],
							played: false
						});
						console.log("song.track.name", song.track.name);
						console.log("url", song.track.preview_url);
						$scope.songs.push(ngAudio.load(song.track.preview_url));
					}
				}
			})

			 $scope.gameOver = false;
			 $scope.guessing = false;
			 $scope.currentSong = getNextSong();
			 $scope.loadGuessOptions();
			 //$scope.testArray.$add({text: "woooo"});

		})
       
	  // $scope.todos.push($scope.todo);
	  // $scope.todo = '';
	};

	var mergeArtists = function (arrOfArtists){
		if (arrOfArtists.length===1)
			return arrOfArtists[0].name
		else {
			var result = [];
			arrOfArtists.forEach(function (artist){
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
	            	if (_artists.length<3){
	            		song.played = true;
	            	} 
	            	_artists.forEach(function(artist){
	            		SongsFactory.getRelatedSongs(artist.uri.split(":")[2])
	            		.then (function (relatedSong){
	            			song.guessChoices.push({
	            				artist: artist.name,
	            				song: relatedSong,
	            				combinedSongInfo: relatedSong + " by " + artist.name
	            			})
	            			
	            		})
	            	})
	            })
	         if (count > 1){
	         	count--;
	         } else {

	         	$scope.ready = true;
	         }
	    })
	}


	var shuffleArray = function(array) {
		  var m = array.length, t, i;
		  
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

	$scope.startTimer = function () {
		
		                $scope.$broadcast('timer-start');
                $scope.timerRunning = true;
  		//document.getElementsByTagName('timer')[0].start();
	}

	$scope.stopTimer = function () {
		$scope.$broadcast('timer-stop');

                $scope.timerRunning = false;
	//  document.getElementsByTagName('timer')[0].stop();
	  //console.log( document.getElementsByTagName('timer')[0]);
	  // console.log($scope.songs[$scope.currentSong].currentTime);
	  // console.log(Math.floor($scope.songs[$scope.currentSong].currentTime));
	  // console.log($scope.songs[$scope.currentSong].remaining);
	}

	$scope.submitGuess = function (){
		$scope.$broadcast('timer-reset');
		$scope.haveResult = false;
		$scope.result = "";
		var songToGuess = $scope.songList[$scope.currentSong].combinedSongInfo;
		$scope.songList[$scope.currentSong].played = true;
		$scope.haveResult = true;
		
		if (songToGuess === $scope.myGuess){
			$scope.result = "You are correct!";
			$scope.score=Math.floor($scope.score + 1 + $scope.songs[$scope.currentSong].remaining);
			//Math.floor($scope.songs[$scope.currentSong].currentTime)
			
		} else {
			$scope.result = "You are wrong! The correct answer is: " + songToGuess;
		}

		if ($scope.round<$scope.maxRounds){
			$scope.round++;
			$scope.guessing = false;
			$scope.currentSong = getNextSong();
		}
		else {
			$scope.guessing = false;

            $timeout(function() {
    			$scope.timesUp();
			    $scope.haveResult = false;
				$scope.result = "";
            }, 2000);

		}
		$scope.guess = null;
	}

	$scope.haveSongs = function (){
		return $scope.songList.length > 0;
	}

  });

