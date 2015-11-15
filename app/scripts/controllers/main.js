'use strict';

/**
 * @ngdoc function
 * @name ntsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ntsApp
 */
angular.module('ntsApp').controller('MainCtrl', function ($scope, $rootScope, SongsFactory, Spotify, ngAudio, $state, $firebaseObject, $firebaseArray, $timeout) {


	// var ref = new Firebase("https://incandescent-fire-7627.firebaseio.com");
	// // download the data from ref onto a local object. this is an async request
	// var syncObject = $firebaseObject(ref);
	// // synchronize the object with a three-way data binding. As we update the data object, it syncs it across
	// syncObject.$bindTo($scope, "data");

	var refSongs = new Firebase("https://incandescent-fire-7627.firebaseio.com/songs");
	$scope.songList = $firebaseArray(refSongs);

	var refGameObj = new Firebase("https://incandescent-fire-7627.firebaseio.com");
	var gameData = $firebaseObject(refGameObj);
	gameData.$bindTo($scope, 'gameObj');
	
	

  $scope.categoryOptions = SongsFactory.getCategories();


     $scope.sound;

     $scope.start = true;
     //$scope.songList = [];
     $scope.songs = [];
     $rootScope.maxRounds = 4;
     $rootScope.round = 0;
     $rootScope.score = 0;
     $rootScope.gameOver = false;

     $scope.guessing = false;
     $rootScope.ready = false;
     $scope.haveResult = false;

     $scope.localTempSongList = [];




     function getNextSong() {

		var num = Math.floor(Math.random() * ($scope.songList.length-1));
		console.log("is played?", $scope.songList[num])
		console.log("NUM", num);
		while ($scope.songList && $scope.songList[num].played){
			console.log("is played 2?", $scope.songList[num])
			num = Math.floor(Math.random() * ($scope.songList.length-1));
			console.log("NUM", num);
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
		if ($rootScope.round < $rootScope.maxRounds){
			$scope.gameOverMessage = "You're out of time!";
		}
		else {
			$scope.gameOverMessage = "Game over!";
		}
		$scope.songs[$scope.currentSong].pause();
		$rootScope.gameOver = true;
			$scope.songList = [];
		    $scope.songs = [];
		    $rootScope.round = 0;
		    $scope.start = true;
		    $rootScope.ready = false;


	}

     $scope.addSongs = function () {
     	var type = $scope.category.type;
     	$scope.start = false;
     	$rootScope.score = 0;
     	$rootScope.round++;
     	

		SongsFactory.getSongList(type)
		.then (function (songs){

			songs.items.forEach(function (song){
				if (song){
					if (song.track.preview_url != null && song.track.artists[0].name!="Various Artists"){ // don't add songs without a preview file or if the artist name is 'various artists'
						$scope.localTempSongList.push({
							name: song.track.name,
							artist: mergeArtists(song.track.artists),
							combinedSongInfo: song.track.name + " by " + mergeArtists(song.track.artists),
							artist_id: song.track.artists[0].uri.split(":")[2],
							played: false
						})
							$scope.songs.push(ngAudio.load(song.track.preview_url));
							
						// console.log("song.track.name", song.track.name);
						// console.log("url", song.track.preview_url);
						
					}
				}
			})
			// $scope.songList.$watch(function(event){
			// 	console.log("event!", event);
			// 	console.log("scope length", $scope.songList.length);
			// 	if ($scope.songList.length === 29){
					$rootScope.gameOver = false;
					 $scope.guessing = false;
					 $scope.loadGuessOptions();
					
			// 	}
			// })
			 
			 
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
		console.log("THIS?");
	    $scope.localTempSongList.forEach(function(song) {
	    	var id = song.key;
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
	            			//$scope.songList.$save(song)
	            			
	            		})
	            	})
	            })
	         if (count > 1){
	         	count--;
	         } else {
	         	for (var i=0; i<$scope.localTempSongList.length; i++){
	         		$scope.songList.$add($scope.localTempSongList[i]);

	         	}
	         	$scope.songList.$watch(function(event){
			
				if ($scope.songList.length === 29){
	         		$rootScope.ready = true;
	         		$scope.gameObj.text="BOOOO"
	         		 $scope.currentSong = getNextSong();
	         		}
	         	})
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
		$scope.haveResult = false;
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
		console.log("my guess: ", $scope.myGuess);
		$scope.$broadcast('timer-reset');
		$scope.haveResult = false;
		$scope.result = "";
		var songToGuess = $scope.songList[$scope.currentSong].combinedSongInfo;
		$scope.songList[$scope.currentSong].played = true;
		$scope.haveResult = true;
		
		if (songToGuess === $scope.myGuess){
			$scope.result = "You are correct!";
			$scope.answer = "The answer is: " + songToGuess;
			$rootScope.score=Math.floor($rootScope.score + 1 + $scope.songs[$scope.currentSong].remaining);
			//Math.floor($scope.songs[$scope.currentSong].currentTime)
			
		} else {
			$scope.result = "You are wrong!";
			$scope.answer = "The correct answer is: " + songToGuess;
		}

		if ($rootScope.round<$rootScope.maxRounds){
			$rootScope.round++;
			$scope.guessing = false;
			$scope.currentSong = getNextSong();
		}
		else {
			
			
			$scope.songs[$scope.currentSong].pause();
		// $rootScope.gameOver = true;
		// 	$scope.songList = [];
		//     $scope.songs = [];
		//     $rootScope.round = 0;
		//     $scope.start = true;
		//     $rootScope.ready = false;*/


            $timeout(function() {
    			$scope.timesUp();
			    $scope.haveResult = false;
				$scope.result = "";
				$scope.guessing = false;
            }, 2000);

		}
		$scope.guess = null;
	}

	$scope.haveSongs = function (){
		return $scope.songList.length > 0;
	}

  });

