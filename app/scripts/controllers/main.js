'use strict';

/**
 * @ngdoc function
 * @name ntsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ntsApp
 */
angular.module('ntsApp').controller('MainCtrl', function ($scope, $rootScope, SongsFactory, Spotify, ngAudio, $state, $firebaseObject, $firebaseArray, $timeout, $firebaseUtils) {


	// var ref = new Firebase("https://incandescent-fire-7627.firebaseio.com");
	// // download the data from ref onto a local object. this is an async request
	// var syncObject = $firebaseObject(ref);
	// // synchronize the object with a three-way data binding. As we update the data object, it syncs it across
	// syncObject.$bindTo($scope, "data");

	var refSongs = new Firebase("https://incandescent-fire-7627.firebaseio.com/songs");
	$scope.songList = $firebaseArray(refSongs);

	// var refGameObj = new Firebase("https://incandescent-fire-7627.firebaseio.com");
	// var gameData = $firebaseObject(refGameObj);
	
	// $firebaseUtils.updateRec(gameData, "START"); 
	// gameData.text = "TEST";
	// gameData.$save();
	// $scope.gameObj = gameData;

  //   $timeout(function() {
		// gameData.text = "123";
		// gameData.$save();;
  //   }, 2000);
	


	// gameData.$bindTo($scope, 'gameObj');
	// $scope.gameObj = {
	// 	text: "START"
	// }
	// gameData.$save();


	

  $scope.categoryOptions = SongsFactory.getCategories();
  // $scope.category = {
  // 	type: $scope.categoryOptions[0].type
  // }

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

		var num = Math.floor(Math.random() * ($scope.localTempSongList.length-1));
		console.log("is played?", $scope.localTempSongList[num])
		console.log("NUM", num);
		while ($scope.localTempSongList && $scope.localTempSongList[num].played){
			console.log("is played 2?", $scope.localTempSongList[num])
			num = Math.floor(Math.random() * ($scope.localTempSongList.length-1));
			console.log("NUM", num);
		}
		return num;
	}

	$scope.buzzIn = function (){
		console.log("in buzz in: ", $scope.songs);
     	console.log("in buzz in: ", $scope.songs.length);
     	console.log("in buzz in: ", $scope.currentSong);
		$scope.songs[$scope.currentSong].pause();

     	// SHUFFLE
     	

     	$scope.songList.forEach(function(song){
     		song.guessChoices=shuffleArray(song.guessChoices);
     	})

     	//$scope.myGuess = $scope.songList[$scope.currentSong].guessChoices[0].combinedSongInfo;

     	//$scope.myGuess = "Pull down to see options";
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
     	
     	console.log("checking songList", $scope.songList.length);

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
		var count = ($scope.localTempSongList.length)*3;
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
	            	console.log("have related artists", _artists);
	            	if (_artists.length<3){
	            		song.played = true;
	            	} 
	            	_artists.forEach(function(artist){
	            		SongsFactory.getRelatedSongs(artist.uri.split(":")[2])
	            		.then (function (relatedSong){
	            			console.log("one related song", relatedSong);
	            			song.guessChoices.push({
	            				artist: artist.name,
	            				song: relatedSong,
	            				combinedSongInfo: relatedSong + " by " + artist.name
	            			});
	            			count--;
	            			if (count <=1){
					         	for (var i=0; i<$scope.localTempSongList.length; i++){
					         		$scope.songList.$add($scope.localTempSongList[i]);

					         	}
					         	$scope.songList.$watch(function(event){
							
								if ($scope.songList.length === 29){
					         		$rootScope.ready = true;
					         		$rootScope.gameOver = false;
									 $scope.guessing = false;
					         		
					    //      		gameData.text = "Boooooo";
									// gameData.$save();;


					         		 $scope.currentSong = getNextSong();
					         		}
					         	})
	         
	     						}


	            			//$scope.songList.$save(song)
	            			
	            		})
	            	})
	            })
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

		console.log("start timer", $scope.songs[$scope.currentSong]);

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
	$scope.myGuess = {};
	$scope.submitGuess = function (){
		//console.log("my guess: ", $scope.myGuess.guess);
		$scope.$broadcast('timer-reset');
		$scope.haveResult = false;
		$scope.result = "";
		var songToGuess = $scope.songList[$scope.currentSong].combinedSongInfo;
		$scope.songList[$scope.currentSong].played = true;
		$scope.haveResult = true;
		
		if (songToGuess === $scope.myGuess.guess){
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

			$scope.guessing = false;
			var removalCounter = $scope.songList.length;
            $timeout(function() {
    			
				$scope.songList.forEach(function (song){
					$scope.songList.$remove(song)
					.then (function (removed){
						console.log("REMOVED? ", removed);
						console.log("removal counter", removalCounter);
						if (removalCounter === 1)
						{
							$scope.timesUp();
										    $scope.haveResult = false;
											$scope.result = "";
						}	
						else {
							removalCounter--;
						}
				})
				})
            }, 2000);

		}
		$scope.guess = null;
	}

	$scope.haveSongs = function (){
		return $scope.songList.length > 0;
	}

  });

