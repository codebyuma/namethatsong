'use strict';

/**
 * @ngdoc function
 * @name ntsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ntsApp
 */
angular.module('ntsApp').controller('MainCtrl', function ($scope, localStorageService, SongsFactory, Spotify, ngAudio, $state) {


   

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  localStorageService.clearAll();
  $scope.categoryOptions = SongsFactory.getCategories();

    	var todosInStore = localStorageService.get('todos');

     $scope.todos = todosInStore || [];
     $scope.sound;

     $scope.start = true;
     $scope.songList = [];
     $scope.songs = [];
     $scope.maxRounds = 4;
     $scope.round = 0;
     $scope.gameOver = false;

     $scope.guessing = false;
     $scope.ready = false;

     
     // as this scope item changes, update what we've stored locally
     $scope.$watch('todos', function (){
     	localStorageService.set('todos', $scope.todos);
     }, true);


     function getNextSong() {
		var num = Math.floor((Math.random() * 9));

		while ($scope.songList && $scope.songList[num].played)
			num = Math.floor((Math.random() * 10));
		return num;
	}

	$scope.buzzIn = function (){
		$scope.songs[$scope.currentSong].pause();
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
					
					$scope.songList.push({
						name: song.track.name,
						artist: song.track.artists,
						combinedSongInfo: song.track.name + " by " + song.track.artists[0].name,
						artist_id: song.track.artists[0].uri.split(":")[2],
						played: false
					});
					$scope.songs.push(ngAudio.load(song.track.preview_url));
				}
			})

			 $scope.gameOver = false;
			 $scope.currentSong = getNextSong();
			 $scope.loadGuessOptions();
			 

		})
       
	  // $scope.todos.push($scope.todo);
	  // $scope.todo = '';
	};

	$scope.loadGuessOptions = function() {
		var count = $scope.songList.length;
	    $scope.songList.forEach(function(song) {
	    	song.guessChoices = [{
	    		artist: song.artist[0].name,
	    		song: song.name,
	    		combinedSongInfo: song.name + " by " + song.artist[0].name
	    	}];
	        SongsFactory.getRelatedArtists(song.artist_id)
	            .then(function(_artists) {
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
	         	// $scope.songList.forEach(function(song){
	         	// 	console.log("pre shuffle", song.guessChoices);
	         	// 	_.shuffle(song.guessChoices);
	         	// 	console.log("post shuffle", song.guessChoices);
	         	// })
	         	$scope.ready = true;
	         }
	    })
	}


	$scope.startTimer = function () {
  		document.getElementsByTagName('timer')[0].start();
	}

	$scope.stopTimer = function () {
	  document.getElementsByTagName('timer')[0].stop();
	  console.log($scope.songs[$scope.currentSong].currentTime);
	}

	$scope.submitGuess = function (){
		var songToGuess = $scope.songList[$scope.currentSong].combinedSongInfo;

		if (songToGuess === $scope.myGuess){
			console.log("CORRECCCCTTTT");
			$scope.score++;
			
		}

		if ($scope.round<$scope.maxRounds){
			$scope.round++;
			$scope.songList[$scope.currentSong].played = true;
			$scope.guessing = false;
			$scope.currentSong = getNextSong();
		}
		else {
			$scope.gameOver = true;
			$scope.songList = [];
		    $scope.songs = [];
		    $scope.round = 0;
		    $scope.start = true;
		    $scope.ready = false;

		}
		$scope.guess = null;
	}

	$scope.haveSongs = function (){
		return $scope.songList.length > 0;
	}

  });

