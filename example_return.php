<?php

/**
 * This function will return a multidimensional array
 * each array should have the src (string), width (int),
 * & height (int) of the image defined.
 */
function kittens(){
	$kittens = [];
	for($i = 0; $i < 100; $i++){
		$dim = rand(100, 300);
		$kittens[] = [
   			'src'=> 'http://placekitten.com/'.$dim.'/200',
			'width'=> $dim,
    		'height'=> 200,
    	];
	}
	echo json_encode($kittens);
}