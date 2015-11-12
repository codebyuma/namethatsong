'use strict';

angular.module('ntsApp').factory('SongsFactory', function ($http){
	var SongsFactory = {};

	// $http.defaults.headers.common['Authorization'] = 'Bearer BQAKZ_BPTtzT2f3gs1Pa47R1NdPjKVDg0ebNPcY63aarTqIkQ7EnDbPFKIkoFU0D1WQ7XpdgiR1yhXrK6ELvsNwm_Gya3pGa8Gs4WmzfFoofIy40QIVn_c4FqRMrEvyKG6n6pQA';


	$http.defaults.headers.common.Authorization = 'Bearer BQB_66d_jYQS7XRG_1v8g78h7_3cXNP5tuduFQL35EkFDCCVVBiuVfp9_TYQLqKzRHVCdvWNCPFQ8AGZw47oQmjtHEfHaPeJ1AtogzWG2Y4Woc4C2D_-Bkh5iAGF33kmMRVmB98';

	SongsFactory.getSongList = function (){
		console.log('in get song list');
		return $http.get('https://api.spotify.com/v1/users/spotify/playlists/4ORiMCgOe6UxBDqW8SF1Lm/tracks?market=US&limit=10')
		.then (function(response){
			console.log('response: ', response.data);
			return response.data;
		}, function (error){
			console.log('failed to get songlist', error.message);
			return error;
		});
	};


	return SongsFactory;

});

