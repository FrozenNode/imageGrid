# Multup

A responsive image grid inspired by http://www.techbits.de/2011/10/25/building-a-google-plus-inspired-image-gallery/
Rebuilt with Knockout.js

- **Author:** Nick Kelly
- **Website:** [http://frozennode.com](http://frozennode.com)
- **Version:** 0.9.0

## Installation

After adding Knockout.js & jQuery to your page, add ko.imageGrid.js, or ko.imageGrid.min.js

## Usage

In your knockout view model, use the imageGrid as a typical extension

	'images': ko.observableArray().extend({
			imageGrid: {
				container: $('#conatiner'), /* container around the grid */
				margins: 6, /* sum of horizontal margins for an image */
				imagePath : '/images/get', /* if using infinite scroll, this is the path to go to retrieve data */
				ajaxMethod: 'GET',
				infiniteScroll: true,
				limit : 50, /* optional image limit defaults to 50 */
				offset: 0, /* optional page offset */
			}
	}),


## Copyright and License
written by Nick Kelly
imageGrid is released under the MIT License

## Changelog

### version 0.9.0