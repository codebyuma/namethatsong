'use strict';

angular.module('ntsApp').factory('SongsFactory', function ($http){
	var SongsFactory = {};

	// $http.defaults.headers.common['Authorization'] = 'Bearer BQAKZ_BPTtzT2f3gs1Pa47R1NdPjKVDg0ebNPcY63aarTqIkQ7EnDbPFKIkoFU0D1WQ7XpdgiR1yhXrK6ELvsNwm_Gya3pGa8Gs4WmzfFoofIy40QIVn_c4FqRMrEvyKG6n6pQA';


	$http.defaults.headers.common.Authorization = 'Bearer BQCcgCR8Zc0igabY-bVPkpzeGZP7PZD7n5zyVxkVrBtlL7muwbIONhLXpiT6UPq_mxD9mnuog4VhfydDfQ0uoGSKlHjG6PM3EVbuawXhZgnObOB16-F21kPv4Oyh6WA4LlTjmhE';

	var playlistOptions = {
		"Current Top 40": {user: 'spotify', kind: 'playlist', id: '5FJXhjdILmRA2z5bvz4nzf'},
		"Hip Hop Throwbacks": {user: 'spotify', kind: 'playlist', id: '4jONxQje1Fmw9AFHT7bCp8'},
		"Pop": {user: 'hyperswift', type: 'pop', id: '4kOhdyUN3MzFlPkREE9mm7'},
		"Rock Solid Hits": {user: 'spotify', kind: 'playlist', id: '0JHYU9yefyVvlYAi2WTdKc'},
	    "90s R&B": {user: 'spotify', kind: 'playlist', id: '7t5PfPV1MdYnpmGPxwv5Ef'},
	    "Blues": {user: 'sonymusicthelegacy', kind: 'playlist', id: '57zcG5rzNtI8DYrUz0nVsP'},
	    "Hits - 00's": {user: 'spotify', kind: 'playlist', id: '3UybCDm2O3JPQChfCG02EG'},
	    "Hits - 90's": {user: 'spotify', kind: 'playlist', id: '2uAichKSjJSyrmal8Kb3W9'},
	    "Hits - 80's": {user: 'spotify', kind: 'playlist', id: '5wDvHZhgPBlWyDEZ3jSMF4'},
	    "Hits - 70's": {user: 'spotify', kind: 'playlist', id: '00K2xasnm9pDQk53SzNCht'}
	    // "Beatles": {user: 'spotify', kind: 'artist', id: '3WrFJ7ztbogyGnTHbHJFl2'}
	};

	SongsFactory.getCategories = function (){
		return Object.keys(playlistOptions);
	}

	SongsFactory.getSongList = function (type){
		// console.log('in get song list');
		var url;
		if (playlistOptions[type].kind === "playlist"){
			 url = 'https://api.spotify.com/v1/users/' + playlistOptions[type].user + '/playlists/' + playlistOptions[type].id + '/tracks?market=US&limit=20'
		} else {
			url = 'https://api.spotify.com/v1/artists/' + playlistOptions[type].id +  '/top-tracks?country=US';

		}

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
