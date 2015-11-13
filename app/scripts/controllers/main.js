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
     $scope.maxRounds = 2;
     $scope.round = 0;
     $scope.gameOver = false;
     $scope.score = 0;
     $scope.guessing = false;
     $scope.ready = false;

     
     // as this scope item changes, update what we've stored locally
     $scope.$watch('todos', function (){
     	localStorageService.set('todos', $scope.todos);
     }, true);


     function getNextSong() {
		var num = Math.floor((Math.random() * 9));
		// console.log("checking songList" , $scope.songList!=null)
		// console.log("checking played", $scope.songList[num].played)
		console.log("num", num);
		console.log("scope songlist length", $scope.songList.length);
		while ($scope.songList && $scope.songList[num].played)
			num = Math.floor((Math.random() * 10));
		return num;
	}

	$scope.buzzIn = function (){
		$scope.songs[$scope.currentSong].pause();
		$scope.guessing = true;
	}

     $scope.addSongs = function () {
     	var type = $scope.category.type;
     	$scope.start = false;
     	$scope.score = 0;
     	
  //    	Spotify.getAlbum('1cCAb1vN8uUsdfEylVmTLs').then(function (data) {
		//   console.log(data);
		// });
		SongsFactory.getSongList(type)
		.then (function (songs){

			songs.items.forEach(function (song){
				if (song){
					console.log(song);
					$scope.songList.push({
						name: song.track.name,
						artist: song.track.artists,
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
	    		song: song.name
	    	}];
	        SongsFactory.getRelatedArtists(song.artist_id)
	            .then(function(_artists) {
	            	_artists.forEach(function(artist){
	            		SongsFactory.getRelatedSongs(artist.uri.split(":")[2])
	            		.then (function (relatedSong){
	            			song.guessChoices.push({
	            				artist: artist.name,
	            				song: relatedSong
	            			})
	            			
	            		})
	            	})
	            })
	         if (count > 1){
	         	console.log("nope");
	         	count--;
	         } else {
	         	console.log("WORKING??", $scope.songList);
	         	$scope.ready = true;
	         }
	    })
	}
	$scope.submitGuess = function (){
		var songToGuess = $scope.songList[$scope.currentSong];
		console.log("song to guess ", songToGuess.name);
		console.log("artist to guess ", songToGuess.artist[0].name);

		console.log("the guesssed guess", $scope.guess.guess);
		// console.log("vars name", $scope.guess.songName);

		if (songToGuess.name == $scope.guess.songName){
			console.log("correct song name");
			$scope.score++;
		}

		songToGuess.artist.forEach(function(artist){
			if ($scope.guess.artist == artist.name){
				console.log("correct artist");
				$scope.score++;
			}
		})

		if ($scope.round<$scope.maxRounds){
			$scope.round++;
			$scope.songList[$scope.currentSong].played = true;
			$scope.guessing = false;

			// console.log("end of round, current song", $scope.currentSong);
			// console.log("end of round, current song played", $scope.songList[$scope.currentSong].played);
			$scope.currentSong = getNextSong();
			// console.log("end of round, UPDATED current song? ", $scope.currentSong);
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


/*curl -X GET "https://api.spotify.com/v1/tracks?ids=7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B&market=US" -H "Accept: application/json" -H "Authorization: Bearer BQAKZ_BPTtzT2f3gs1Pa47R1NdPjKVDg0ebNPcY63aarTqIkQ7EnDbPFKIkoFU0D1WQ7XpdgiR1yhXrK6ELvsNwm_Gya3pGa8Gs4WmzfFoofIy40QIVn_c4FqRMrEvyKG6n6pQA"*/

