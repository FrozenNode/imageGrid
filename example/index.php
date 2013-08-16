<!DOCTYPE html>
<html>
<head>
	<style>
		*{
			margin: 0;
			padding: 0;
		}
		.clearfix:before,
		.clearfix:after {
			content: " ";
			display: table;
		}

		.clearfix:after {
			clear: both;
		}

		#container{
			min-height: 600px;
		}

		#container >ul >li{
			position: relative;
			float: left;
			padding: 0px;
			margin: 3px;
		}

		#container >ul >li >div{
			overflow: hidden;
		}

		#container .full_width {
			margin: 0;
			text-align: center;
			background: #333;
			padding: 20px 0;
		}
	</style>
</head>
<body>
	<div id="container" class="clearfix" data-bind="template: 'image_grid', style: { minHeight: images.containerMinHeight }  "></div>

	<script id="image_grid" type="text/html">
		<ul class="image_grid clearfix" data-bind="foreach: images">
			<li data-bind="template: 'image_block' "></li>
			<!-- ko if: rowEnd() -->
			<li data-bind="template: 'image_full_row'"></li>
			<!-- /ko -->
		</ul>
	</script>

	<script id="image_block" type="text/html">
		<div data-bind="visible: vwidth() > 0, style: { width: vwidth() + 'px', height: height() + 'px' }">
			<a data-bind="attr: { href: '#' }, click: function(){ $parent.images.activateImage($index()) }">
				<img data-bind="attr: { src: src }, style: { width: width() + 'px', height: height() + 'px', marginLeft: margin() + 'px' }" />
			</a>
		</div>
	</script>

	<script id="image_full_row" type="text/html">
		<div class="full_width" data-bind="style: { width:  $parent.images.containerWidth() + 'px' }">
			<img data-bind="attr: { src: $parent.images()[$parent.images.activeImage()].src }" />
		</div>
	</script>

	<script type="text/javascript" src="js/jquery.js" ></script>
	<script type="text/javascript" src="js/ko.js" ></script>
	<script type="text/javascript" src="js/ko.mapping.js" ></script>
	<script type="text/javascript" src="js/ko.imageGrid.js" ></script>
	<script>
		var vm = {
		'images': ko.observableArray().extend({
				imageGrid: {
					container: $('#container'), /* container around the grid */
					margins: 6, /* sum of horizontal margins for an image */
					imagePath : '/images.php', /* if using infinite scroll, this is the path to go to retrieve data */
					ajaxMethod: 'GET',
					infiniteScroll: true,
					limit : 50, /* optional image limit defaults to 50 */
					offset: 0, /* optional page offset */
				}
			})
		};

		ko.applyBindings(vm, $('#container')[0]);
	</script>
</body>