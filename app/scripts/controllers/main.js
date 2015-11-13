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


    	var todosInStore = localStorageService.get('todos');

     $scope.todos = todosInStore || [];
     $scope.sound;

     $scope.songList = [];
     $scope.songs = [];
     $scope.maxRounds = 1;
     $scope.round = 0;
     $scope.gameOver = false;


     // as this scope item changes, update what we've stored locally
     $scope.$watch('todos', function (){
     	localStorageService.set('todos', $scope.todos);
     }, true);



     $scope.addSong = function (type) {
     	console.log('in add to do');
  //    	Spotify.getAlbum('1cCAb1vN8uUsdfEylVmTLs').then(function (data) {
		//   console.log(data);
		// });
		SongsFactory.getSongList(type)
		.then (function (songs){
			songs.items.forEach(function (song){
				$scope.songList.push({
					name: song.track.name,
					artist: song.track.artists
				});
				$scope.songs.push(ngAudio.load(song.track.preview_url));
			})
			console.log('back from songlist in songs factory', $scope.songList);
			 //$scope.sound = ngAudio.load($scope.songList[0]); // returns NgAudioObject
			 $scope.gameOver = false;
			 console.log("scope sound", $scope.sound);

		})
       
	  // $scope.todos.push($scope.todo);
	  // $scope.todo = '';
	};

	$scope.submitGuess = function (){
		var songToGuess = $scope.songList[$scope.round];
		console.log("song to guess ", songToGuess.name);
		console.log("artist to guess ", songToGuess.artist.name);
		console.log("vars artist", $scope.guess.artist);
		console.log("vars name", $scope.guess.songName);

		if (songToGuess.name == $scope.guess.songName)
			console.log("correct song name");

		songToGuess.artist.forEach(function(artist){
			if ($scope.guess.artist == artist.name)
				console.log("correct artist");
		})

		if ($scope.round<$scope.maxRounds)
			$scope.round++;
		else {
			$scope.gameOver = true;
			$scope.songList = [];
		    $scope.songs = [];
		    $scope.round = 0;
		}
		$scope.guess = null;
	}

	$scope.haveSongs = function (){
		return $scope.songList.length > 0;
	}

  });


/*curl -X GET "https://api.spotify.com/v1/tracks?ids=7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B&market=US" -H "Accept: application/json" -H "Authorization: Bearer BQAKZ_BPTtzT2f3gs1Pa47R1NdPjKVDg0ebNPcY63aarTqIkQ7EnDbPFKIkoFU0D1WQ7XpdgiR1yhXrK6ELvsNwm_Gya3pGa8Gs4WmzfFoofIy40QIVn_c4FqRMrEvyKG6n6pQA"*/

