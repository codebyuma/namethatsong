'use strict';

angular.module('ntsApp').factory('SongsFactory', function ($http){
	var SongsFactory = {};

	// $http.defaults.headers.common['Authorization'] = 'Bearer BQAKZ_BPTtzT2f3gs1Pa47R1NdPjKVDg0ebNPcY63aarTqIkQ7EnDbPFKIkoFU0D1WQ7XpdgiR1yhXrK6ELvsNwm_Gya3pGa8Gs4WmzfFoofIy40QIVn_c4FqRMrEvyKG6n6pQA';


	$http.defaults.headers.common.Authorization = 'Bearer BQAhKxBaOXN_0hMVZI2x55gOGfP7bpMacORK2kjjp06i47oGS7H73OY1EyF4_Q4XskHv9i917rmvPSFha5CIwAsZfcSSLyUz5fuufgr6QbUNe2w8-dOgjJ82--NtHXPC_WUXQrM';

	var playlistOptions = {
		"Current Top 40": {user: 'spotify', type: 'top hits', id: '5FJXhjdILmRA2z5bvz4nzf'},
		//"Hip Hop": {user: 'spotify', type: 'hip hop', id: '4BQ8KZLz0J08lgXXO74Uy3'}, // this one doesn't work
		"Pop": {user: 'hyperswift', type: 'pop', id: '4kOhdyUN3MzFlPkREE9mm7'},
	    "Classic Rock": {user: 'sonymusicfinland', name: 'classic rock', id: '5BygwTQ3OrbiwVsQhXFHMz'} // only has 9 songs
	};

	SongsFactory.getCategories = function (){
		return Object.keys(playlistOptions);
	}

	SongsFactory.getSongList = function (type){
		console.log('in get song list');

		var url = 'https://api.spotify.com/v1/users/' + playlistOptions[type].user + '/playlists/' + playlistOptions[type].id + '/tracks?market=US&limit=9'
		console.log("url", url);

		// return $http.get('https://api.spotify.com/v1/users/spotify/playlists/5FJXhjdILmRA2z5bvz4nzf/tracks?market=US&limit=10')
		return $http.get(url)
		.then (function(response){
			console.log('response: ', response.data);
			return response.data;
		}, function (error){
			console.log('failed to get songlist', error.data.error.message);
			return error;
		});
	};


	return SongsFactory;

});
