( function() {
	'use strict';
	
	var simpleGames = function() {
		var container  = $layer( 'container' ),
			mainLayer  = $layer(),
			menuLayer  = $layer(),
			innerLayer = $layer().start( 0, 2 ).scale( 10, 8 );

		function resizeContainer() {
			var clientWidth  = document.documentElement.clientWidth,
				clientHeight = document.documentElement.clientHeight;

			if ( clientWidth > clientHeight ) {
				mainLayer.start( 0, 0 ).scale( 9, 10 );
				menuLayer.start( 9, 0 ).scale( 1, 10 );
			} else {
				mainLayer.start( 0, 0 ).scale( 10, 9 );
				menuLayer.start( 0, 9 ).scale( 10, 1 );
			}

			container.style( {
				'border' : '5px solid red',
				'width'  : document.documentElement.clientWidth  - 10 + 'px',
				'height' : document.documentElement.clientHeight - 10 + 'px'
			} );

			deployIcon();
		}

		function deployIcon() {
			var data = [
				'01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28',
				'29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53'
			];

			var iconSize = 50, iconBorder = 10, iconMargin = 13, labelSize = 14, h_correct_margin = -10,
				iconBlockSize   = iconSize + iconBorder + iconMargin,
				mainLayerWidth  = $util.number( mainLayer.style().width ),
				mainLayerHeight = $util.number( mainLayer.style().height ),
				wIconCount = parseInt( mainLayerWidth / iconBlockSize ),
				hIconCount = parseInt( mainLayerHeight / ( iconBlockSize + h_correct_margin + labelSize ) ),
				iconCountPerPage = wIconCount * hIconCount,
				totalPage = Math.ceil( data.length / iconCountPerPage ),
				wIconBlank = ( mainLayerWidth - ( iconBlockSize * wIconCount - iconMargin ) ) / 2,
				hIconBlank = ( mainLayerHeight - ( ( iconBlockSize + h_correct_margin + labelSize ) * hIconCount - ( iconMargin + h_correct_margin ) ) ) / 2;
				
			for ( var i = mainLayer.element.children.length - 1; i >= 2; i-- )
				mainLayer.element.removeChild(  mainLayer.element.children[ i ] );

			mainLayer.children.splice( 1 );
			mainLayer.interval( mainLayerWidth, mainLayerHeight );

			roof:
			for ( var page = 0; page < totalPage; page++ )
				for ( var h = 0; h < hIconCount; h++ )
					for ( var w = 0; w < wIconCount; w++ ) {
						if ( !data[ page * iconCountPerPage + h * wIconCount + w ] )
							break roof;

						mainLayer.in( $layer().start( page * mainLayerWidth + w * iconBlockSize + wIconBlank, h * ( iconBlockSize + h_correct_margin + labelSize ) + hIconBlank )
											  .shape( 'rounded' )
											  .style( { 'border' : iconBorder / 2 + 'px solid gray', 'width' : iconSize + 'px', 'height' : iconSize + 'px' } )
											  .label( 'game' + data[ page * iconCountPerPage + h * wIconCount + w ], labelSize + 'px' ) );

						if ( page === totalPage - 1 && w === wIconCount - 1 )
							$util.style( mainLayer.children[ mainLayer.children.length - 1 ].element.querySelector( 'label' ), { 'width' : iconSize + wIconBlank + iconBorder / 2 + 'px', 'text-align' : 'left' } );
					}
		}

		mainLayer.style( { 'border' : '5px solid blue', 'overflow-x' : 'auto' } );
		menuLayer.style( { 'border' : '5px solid green' } );
		innerLayer.style( { 'border' : '5px solid brown' } );

		container.in( mainLayer.in( innerLayer.hide() ) ).in( menuLayer );
		window.addEventListener( 'resize', function() { resizeContainer(); }, false );
		resizeContainer();

		// $util.ajax( 'test', 'POST', { 'a' : 1, 'b' : 2, 'c' : 3 }, function( $result ) { alert( $result.message + '[' + $result.code + ']' ); console.log( $result ); } );
	};

	var completedDOM = function() {
		document.removeEventListener( 'DOMContentLoaded', completedDOM, false );
		simpleGames();
	};

	document.addEventListener( 'DOMContentLoaded', completedDOM, false );
} )();