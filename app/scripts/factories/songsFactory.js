'use strict';

angular.module('ntsApp').factory('SongsFactory', function ($http){
	var SongsFactory = {};

	// $http.defaults.headers.common['Authorization'] = 'Bearer BQAKZ_BPTtzT2f3gs1Pa47R1NdPjKVDg0ebNPcY63aarTqIkQ7EnDbPFKIkoFU0D1WQ7XpdgiR1yhXrK6ELvsNwm_Gya3pGa8Gs4WmzfFoofIy40QIVn_c4FqRMrEvyKG6n6pQA';


	$http.defaults.headers.common.Authorization = 'Bearer BQB9Wi8_uRPsR_qMwYjzpEgT3rpNiGkW06v4G9e-1P-G32TwCB1otWeh4fGAVapgfEWUhYtUHsQDeB0GDfUny5CoDiUIiOMfpCxRYSi3d6UUu_UsAiNCC-obY5GRtvwZAw09VEI';

	SongsFactory.getSongList = function (){
		console.log('in get song list');
		return $http.get('https://api.spotify.com/v1/users/spotify/playlists/5FJXhjdILmRA2z5bvz4nzf/tracks?market=US&limit=10')
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
