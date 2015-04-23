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
			var iconSize = 50, iconBorder = 10, iconMargin = 13, labelSize = 14, h_correct_margin = -10,
				iconBlockSize   = iconSize + iconBorder + iconMargin,
				mainLayerWidth  = $util.number( mainLayer.style().width ),
				mainLayerHeight = $util.number( mainLayer.style().height ),
				wIocnCount = Math.trunc( mainLayerWidth / iconBlockSize ),
				hIconCount = Math.trunc( mainLayerHeight / ( iconBlockSize + h_correct_margin + labelSize ) ),
				wIconBlank = ( mainLayerWidth - ( ( iconSize + iconBorder + iconMargin ) * wIocnCount - iconMargin ) ) / 2,
				hIconBlank = ( mainLayerHeight - ( ( iconBlockSize + h_correct_margin + labelSize ) * hIconCount - ( iconMargin + h_correct_margin ) ) ) / 2;
				
			for ( var i = mainLayer.element.children.length - 1; i >= 2; i-- )
				mainLayer.element.removeChild(  mainLayer.element.children[ i ] );

			mainLayer.children.splice( 1 );
			mainLayer.interval( mainLayerWidth, mainLayerHeight );

			for ( var i = 0; i < hIconCount; i++ )
				for ( var j = 0; j < wIocnCount; j++ )
					mainLayer.in( $layer().start( j * iconBlockSize + wIconBlank, i * ( iconBlockSize + h_correct_margin + labelSize ) + hIconBlank )
										  .shape( 'rounded' )
										  .style( { 'border' : iconBorder / 2 + 'px solid gray', 'width' : iconSize + 'px', 'height' : iconSize + 'px' } )
										  .label( 'game' + i + j, labelSize + 'px' ) );
		}
		
		mainLayer.style( { 'border' : '5px solid blue' } );
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