'use strict';

angular.module('ntsApp').factory('SongsFactory', function ($http){
	var SongsFactory = {};

	// $http.defaults.headers.common['Authorization'] = 'Bearer BQAKZ_BPTtzT2f3gs1Pa47R1NdPjKVDg0ebNPcY63aarTqIkQ7EnDbPFKIkoFU0D1WQ7XpdgiR1yhXrK6ELvsNwm_Gya3pGa8Gs4WmzfFoofIy40QIVn_c4FqRMrEvyKG6n6pQA';


	$http.defaults.headers.common.Authorization = 'Bearer BQCJavCGIuPYs5Pp5H00_SjEzdMLNme-IYv_ddZnstnRUUHekq6pWhyopmHe1B1jibWo74j3K3l2fFEvq0eeUaejjrXwToNWCbvvXxLFnD51r4dygaeYGWZp3Qr8_OUnTE166B0';

	var playlistOptions = {
		"Current Top 40": {user: 'spotify', kind: 'playlist', id: '5FJXhjdILmRA2z5bvz4nzf'},
		"2015-2015 - Decade of Hits": {user: 'spotify', kind: 'playlist', id: '6nkmrRQv3EV5uRIbswshSm'},
		"Hip Hop Throwbacks": {user: 'spotify', kind: 'playlist', id: '4jONxQje1Fmw9AFHT7bCp8'},
		"Motown Hits":  {user: 'classicmotownrecords', kind: 'playlist', id: '1VfFbVXZ9kq7yl7wPkgnp2'},
		"Rock Solid Hits": {user: 'spotify', kind: 'playlist', id: '0JHYU9yefyVvlYAi2WTdKc'},
	    "90s R&B": {user: 'spotify', kind: 'playlist', id: '7t5PfPV1MdYnpmGPxwv5Ef'},
	    "Blues": {user: 'sonymusicthelegacy', kind: 'playlist', id: '57zcG5rzNtI8DYrUz0nVsP'},
	    "Hits - 00's": {user: 'spotify', kind: 'playlist', id: '3UybCDm2O3JPQChfCG02EG'},
	    "Hits - 90's": {user: 'spotify', kind: 'playlist', id: '2uAichKSjJSyrmal8Kb3W9'},
	    "Hits - 80's": {user: 'spotify', kind: 'playlist', id: '5wDvHZhgPBlWyDEZ3jSMF4'},
	    "Hits - 70's": {user: 'spotify', kind: 'playlist', id: '00K2xasnm9pDQk53SzNCht'}
	    //"Queen - Greatest Hits": {user: '1132164762', kind: 'playlist', id: '1YWmhCHN4jthKuvXS23AMe'}
	    // "Beatles": {user: 'spotify', kind: 'artist', id: '3WrFJ7ztbogyGnTHbHJFl2'}
	};

	SongsFactory.getCategories = function (){
		return Object.keys(playlistOptions);
	}

	SongsFactory.getSongList = function (type){
		// console.log('in get song list');
		var url;
		// if (playlistOptions[type].kind === "playlist"){
			 url = 'https://api.spotify.com/v1/users/' + playlistOptions[type].user + '/playlists/' + playlistOptions[type].id + '/tracks?market=US&limit=30'
		// } else {
		// 	url = 'https://api.spotify.com/v1/artists/' + playlistOptions[type].id +  '/top-tracks?country=US';

		// }

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
			if (response.data.tracks.length === 0)
				return "";
			return response.data.tracks[0].name;
		}, function (error){
			return "Error getting related song";
		})
	}


	return SongsFactory;

});
