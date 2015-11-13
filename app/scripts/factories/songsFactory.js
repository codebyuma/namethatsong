'use strict';

angular.module('ntsApp').factory('SongsFactory', function ($http){
	var SongsFactory = {};

	// $http.defaults.headers.common['Authorization'] = 'Bearer BQAKZ_BPTtzT2f3gs1Pa47R1NdPjKVDg0ebNPcY63aarTqIkQ7EnDbPFKIkoFU0D1WQ7XpdgiR1yhXrK6ELvsNwm_Gya3pGa8Gs4WmzfFoofIy40QIVn_c4FqRMrEvyKG6n6pQA';


	$http.defaults.headers.common.Authorization = 'Bearer BQBEO5zrqr4gAYUf59Jl2bLEe4uMHJyDjuD3kIxfNsYWnrJiZ57LxBQCKFT5knjkizm95qSSBB5gb2duBFgjs0zZEAxIj7sXyusA4-rc0tT5qIGfERJdz4dg0mXz_VSt16IPPZY';

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
		// console.log('in get song list');

		var url = 'https://api.spotify.com/v1/users/' + playlistOptions[type].user + '/playlists/' + playlistOptions[type].id + '/tracks?market=US&limit=9'

		return $http.get(url)
		.then (function(response){
			console.log('response: ', response.data);
			return response.data;
		}, function (error){
			console.log('failed to get songlist', error.data.error.message);
			return error;
		});
	};



	SongsFactory.getRelatedArtists = function (artistId){
		var relatedArtistsUrl = 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists/';
		return $http.get(relatedArtistsUrl)
		.then (function (response){
			var relatedArtists = response.data.artists.slice(0,3);
			return relatedArtists;
		}, function (error){
			return "Error getting related artists";
		})
	}

	SongsFactory.getRelatedSongs = function(artistId){
		var relatedSongsUrl = 'https://api.spotify.com/v1/artists/' + artistId +  '/top-tracks?country=US';

		return $http.get(relatedSongsUrl)
		.then (function (response){
			return response.data.tracks[0].name;
		}, function (error){
			return "Error getting related song";
		})
	}


	return SongsFactory;

});
