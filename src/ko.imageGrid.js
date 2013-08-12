/**
 * A responsive image grid for Knockout.js
 * This is largely based off of the work done here: http://www.techbits.de/2011/10/25/building-a-google-plus-inspired-image-gallery/
 * modified for use with Knockout.js
 * uses jQuery for window Resize events
 *
 * @author  Nick Kelly
 *
 *  MIT License
 *  http://www.opensource.org/licenses/mit-license
 */
ko.extenders.imageGrid = function(target, options){
	// target is the model item to apply the grid to. This should be an
	// observable array

	//This will keep track of when the grid dimensions are being calculated
	target.calculating = ko.observable(false);

	//keep track of how wide the container element around the images is
	target.containerWidth = ko.observable(0);

	//Index of the image that should be used for a full row display
	target.activeImage = ko.observable(-1);

	//On click, call this function and pass in the index of the
	//image that should be have a full width display
	//if it is equal to the previous active index then set equal
	//to -1 to close the large grid
	target.activateImage = function(i){
		target.activeImage(target.activeImage() === i ? -1 : i);
	};

	//make the grid again every time the image index changes
	target.activeImage.subscribe(function(v){
		target.makeGrid();
	});


	//This function determines the number of pixels that need to be trimmed from
	//each item in the image grid row
	target.calculateCutOff = function(len, delta, items){
	// resulting distribution
		var cutoff = [],
			cutSum = 0;

		// distribute the delta based on the proportion of
		// thumbnail size to length of all thumbnails.
		for(var i in items) {
			cutoff[i] = Math.floor((target()[items[i]].width() / len) * delta);
			cutSum += cutoff[i];
		}

		// The formula distributes the pixels evenly across the images
		var stillToCutOff = delta - cutSum;
		while(stillToCutOff > 0) {
			for(i in cutoff) {
				cutoff[i]++;
				stillToCutOff--;
				if (stillToCutOff == 0) break;
			}
		}
		return cutoff;
	};

	target.makeGrid = function(){
		if(!target.calculating()){
			target.calculating(true);
			//using jQuery to get the width of the container element
			target.containerWidth(options.container.innerWidth());

			var j = target().length, //how many images are there
				l = 0; //which image are we on

			while( j > 0){
				var row = [],
					len = 0, //length of the current image row in pixels
					end = false; //should the row have the full width image at the end of it

				// Build a row of images until longer than maxwidth
				while(j > 0 && len < target.containerWidth()) {
					//remove an image ... add it to the row calculations
					//margins is the sum of the horizontal margins for each image
					if(target.activeImage() === l){
						end = true;
					}
					target()[l].rowEnd(false);
					row.push(l);
					len += (target()[l].width() + options.margins);
					l++;
					j--;
				}

				if(end){
					target()[l-1].rowEnd(true);
				}

				end = false;

				// calculate by how many pixels too long?
				var delta = len - target.containerWidth(),
				// if the line is too long, make images smaller
					cut = row.length > 0 && delta > 0 ? true : false,
					cutoff = cut ? target.calculateCutOff(len, delta, row) : 0;


				for(var i in row) {
					var pixelsToRemove = cut ? cutoff[i] : 0;

					// move the left border inwards by half the pixels
					if(typeof target()[row[i]].margin !== "undefined"){
						target()[row[i]].margin(cut ? Math.floor(pixelsToRemove / 2) * -1 : 0);
						// shrink the width of the image by pixelsToRemove
						target()[row[i]].vwidth(cut ? target()[row[i]].width() - pixelsToRemove : target()[row[i]].width());
					}
				}
			}
			target.calculating(false);
		}
	}

	/*
		Make a grid when there is a change to the target
		Set a timer so you dont try to do too many calculations
	*/
	target.timer = null;
	target.subscribe(function(val){
		clearTimeout(target.timer);
		var v = val.length > 0 ? val[val.length - 1] : false;
		if(v && typeof v.vwidth === "undefined"){
			v.vwidth = ko.observable(0);
			v.margin = ko.observable(0);
		}

		target.timer = setTimeout(function(){
			target.makeGrid();
		}, 5);
	});

	//Listen for the window to get resized and recalculate the grid
	//done on a timer as chrome will fire a resize event for every pixel
	//change in the window
	$(window).resize(function() {
	    clearTimeout(target.timer);
		target.timer = setTimeout(function(){
			target.makeGrid();
		}, 50);
	});

	//If we want to have the images loaded automatically
 	if(typeof options.imagePath !== "undefined"){
		target.limit = options.limit ? options.limit : 50;
		target.offset = options.offset ? options.offset : 0;
	 	target.infinityReached = false;


		target.getImages = function(){
			target.calculating(true);
			$.ajax({
				'url': options.imagePath,
				'method': options.ajaxMethod ? options.ajaxMethod : 'GET',
				'data': {
					limit: target.limit,
					offset: target.offset,
				},
				'dataType': 'json',
				'success': function(images){
					if(images.length > 0){
						$.each(images, function(i,d){
							target.push(ko.mapping.fromJS(d));
						});
						target.calculating(false)
					}
					if(images.length == 0 || images.length < target.limit){
						target.infinityReached = true;
					}
				},
				'error': function(){
				}
			});
		}

		//if infinite scroll is enabled then listen for the scroll event
		if(options.infiniteScroll){
			$(window).scroll(function(e){
				if ($(window).scrollTop() >= $(document).height() - $(window).height() - 250)
				{
					if (!target.infinityReached && !target.calculating())
					{
						target.calculating(true);
						target.offset += 1;
						target.getImages();
					}
				}
			});
		}

		/* get the initial images */
		target.getImages();
 	}

	return target;
}