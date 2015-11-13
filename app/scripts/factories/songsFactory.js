'use strict';

angular.module('ntsApp').factory('SongsFactory', function ($http){
	var SongsFactory = {};

	// $http.defaults.headers.common['Authorization'] = 'Bearer BQAKZ_BPTtzT2f3gs1Pa47R1NdPjKVDg0ebNPcY63aarTqIkQ7EnDbPFKIkoFU0D1WQ7XpdgiR1yhXrK6ELvsNwm_Gya3pGa8Gs4WmzfFoofIy40QIVn_c4FqRMrEvyKG6n6pQA';


	$http.defaults.headers.common.Authorization = 'Bearer BQClzcZHbGpxTxvoVUmVJ6TlG5vg7vIVbS_F3FQ3ynp0U92iE58zlQV3VVFi-l8mbaiY539yBbKs0R64r9d4zxmvW983jsd1AU7cPGfT1ATTpM-pAsBQrHwLUp4VimykKgJoDmY';

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

	// SongsFactory.getRelated = function (song){
	// 	var artistId = song.track.artists[0].uri.split(":")[2];
	// 	var guessChoices = [];
	// 	// var relatedArtists;
	// 	// var relatedSongs = [];
	// 	// var guessChoices = [];

	// 	// var relatedArtistsUrl = 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists/';
	// 	// var relatedSongsUrl;

	// 	// return $http.get(relatedArtistsUrl)
	// 	// .then (function (response){
	// 	// 	relatedArtists = response.data.artists.slice(0,3);

	// 	// 	relatedArtists.forEach(function (_artist){
	// 	// 		relatedSongsUrl = 'https://api.spotify.com/v1/artists/' + _artist.uri.split(":")[2] +  '/top-tracks?country=US';
	// 	// 		return $http.get(relatedSongsUrl)
	// 	// 		.then (function (response){
	// 	// 			guessChoices.push({
	// 	// 				artist: _artist.name,
	// 	// 				song: response.data.tracks[0].name
	// 	// 			})
	// 	// 			if (guessChoices.length === 3)
	// 	// 				return guessChoices;
	// 	// 		})
	// 	// 	})

	// 	// })

	// 	getRelatedArtists(artistId)
	// 	.then (function (relatedArts){
	// 		var relatedArtists = relatedArts;
	// 		console.log("back in related artists", relatedArtists);


	// 		relatedArtists.forEach(function (_artist){
	// 			getRelatedSongs(_artist.uri.split(":")[2])
	// 			.then (function (relatedSong){
	// 				//console.log("back in related artists with songs", relatedSong);
	// 				guessChoices.push({
	// 					artist: _artist.name,
	// 					song: relatedSong
	// 				})
	// 				if (guessChoices.length === 3)
	// 					return guessChoices;

	// 			})
	// 		})

	// 	})
	// }

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
			// guessChoices.push({
			// 	artist: _artist.name,
			// 	song: response.data.tracks[0].name
			// })
			// if (guessChoices.length === 3)
			// 	return guessChoices;
		}, function (error){
			return "Error getting related song";
		})
	}


	return SongsFactory;

});
