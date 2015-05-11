( function() {
	'use strict';
	
	/**	
	 	1. 팝업 닫기
		2. 플러스 버튼 만들고, 입력 팝업 만들고, 서버 저장 개발
	**/

	var simpleGames = function() {
		var currentIcon,
			
			iconSize   = 50,
			iconBorder = 10,
			iconMargin = 13,
			labelSize  = 14,
			hCorrectMargin = -10,

			mainLayerStart		= { 'w' : 0, 'h' : 0 },
			mainLayerSmallScale = { 'w' : 4, 'h' : 10 },
			mainLayerBigScale	= { 'w' : 9, 'h' : 10 },
			innerLayerStart		= { 'w' : 4, 'h' : 0 },
			innerLayerScale		= { 'w' : 5, 'h' : 10 },
			menuLayerStart		= { 'w' : 9, 'h' : 0 },
			menuLayerScale		= { 'w' : 1, 'h' : 10 },

			container  = $layer( 'container' ),
			mainLayer  = $layer(),
			menuLayer  = $layer(),
			innerLayer = $layer(),
			view	   = $layer( 'view' ).start( 0, 0 ).scale( 10, 10 ).hide(),
			add 	   = $layer( 'add' ).start( 0, 0 ).scale( 10, 10 ).hide();

		function resizeContainer() {
			var clientWidth  = $util.clientSize().width,
				clientHeight = $util.clientSize().height;

			if ( clientWidth > clientHeight ) {
				if ( innerLayer.visible() )
					mainLayer.start( mainLayerStart.w, mainLayerStart.h ).scale( mainLayerSmallScale.w, mainLayerSmallScale.h );
				else
					mainLayer.start( mainLayerStart.w, mainLayerStart.h ).scale( mainLayerBigScale.w, mainLayerBigScale.h );

				innerLayer.start( innerLayerStart.w, innerLayerStart.h ).scale( innerLayerScale.w, innerLayerScale.h );
				menuLayer.start( menuLayerStart.w, menuLayerStart.h ).scale( menuLayerScale.w, menuLayerScale.h );
			} else {
				if ( innerLayer.visible() )
					mainLayer.start( mainLayerStart.h, mainLayerStart.w ).scale( mainLayerSmallScale.h, mainLayerSmallScale.w );
				else
					mainLayer.start( mainLayerStart.h, mainLayerStart.w ).scale( mainLayerBigScale.h, mainLayerBigScale.w );

				innerLayer.start( innerLayerStart.h, innerLayerStart.w ).scale( innerLayerScale.h, innerLayerScale.w );
				menuLayer.start( menuLayerStart.h, menuLayerStart.w ).scale( menuLayerScale.h, menuLayerScale.w );
			}

			container.style( {
				'border' : '5px solid red',
				'width'  : clientWidth  - 10 + 'px',
				'height' : clientHeight - 10 + 'px'
			} );

			deployIcon();
		}

		function deployIcon() {
			var data = [
				'01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28',
				'29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53'
			];

			var iconBlockSize   = iconSize + iconBorder + iconMargin,
				mainLayerWidth  = $util.number( mainLayer.style().width ),
				mainLayerHeight = $util.number( mainLayer.style().height ),
				wIconCount = parseInt( mainLayerWidth / iconBlockSize ),
				hIconCount = parseInt( mainLayerHeight / ( iconBlockSize + hCorrectMargin + labelSize ) ),
				iconCountPerPage = wIconCount * hIconCount,
				totalPage = Math.ceil( data.length / iconCountPerPage ),
				wIconBlank = ( mainLayerWidth - ( iconBlockSize * wIconCount - iconMargin ) ) / 2,
				hIconBlank = ( mainLayerHeight - ( ( iconBlockSize + hCorrectMargin + labelSize ) * hIconCount - ( iconMargin + hCorrectMargin ) ) ) / 2;
				
			for ( var i = mainLayer.element.children.length - 1; i >= 1; i-- )
				mainLayer.element.removeChild(  mainLayer.element.children[ i ] );

			mainLayer.children.splice( 1 );
			mainLayer.interval( mainLayerWidth, mainLayerHeight );

			roof:
			for ( var page = 0; page < totalPage; page++ )
				for ( var h = 0; h < hIconCount; h++ )
					for ( var w = 0; w < wIconCount; w++ ) {
						if ( !data[ page * iconCountPerPage + h * wIconCount + w ] )
							break roof;

						var icon = $layer().start( page * mainLayerWidth + w * iconBlockSize + wIconBlank, h * ( iconBlockSize + hCorrectMargin + labelSize ) + hIconBlank )
										   .shape( 'rounded' )
										   .style( { 'border' : iconBorder / 2 + 'px solid gray', 'width' : iconSize + 'px', 'height' : iconSize + 'px' } )
										   .label( 'game' + data[ page * iconCountPerPage + h * wIconCount + w ], labelSize + 'px' )
										   .event( 'click', $util.fn( onClickIcon, null, [ view ] ) );

						icon.element.id = icon._label.childNodes[ 0 ].nodeValue;

						mainLayer.in( icon );

						if ( page === totalPage - 1 && w === wIconCount - 1 )
							$util.style( mainLayer.children[ mainLayer.children.length - 1 ].element.querySelector( 'label' ), { 'width' : iconSize + wIconBlank + iconBorder / 2 + 'px', 'text-align' : 'left' } );
					}
		}

		function onClickIcon( $contents, $event ) {
			var isVisible = innerLayer.visible(),
				scrollLeft = mainLayer.element.scrollLeft;

			innerLayer.in( $contents.show() );
			innerLayer.show();
			resizeContainer();

			if ( isVisible ) {
				mainLayer.element.scrollLeft = scrollLeft;
			} else {
				$util.hash( currentIcon = $event.target.id );
				mainLayer.element.scrollLeft += $util.number( mainLayer.style().width ) / 2 - ( iconSize + iconBorder ) / 2;
			}
		}

		mainLayer.style( { 'border' : '5px solid blue', 'overflow-x' : 'auto' } );
		menuLayer.style( { 'border' : '5px solid green' } );
		innerLayer.style( { 'border' : '5px solid brown' } );
		view.style( { 'border': '5px solid yellow' } );
		add.style( { 'border': '5px solid hotpink' } );

/*
		var s_time;
		var s_position;

		mainLayer.event( 'touchstart', function( $event ) {
			s_time = $event.timeStamp;
			s_position = $event.touches[ 0 ].pageX;
		} );

		mainLayer.event( 'touchend', function( $event ) {
			var mainLayerWidth = $util.number( mainLayer.style().width );
			
			if ( s_time && $event.timeStamp - s_time <= 500 )
				mainLayer.element.scrollLeft = Math.ceil( mainLayer.element.scrollLeft / mainLayerWidth ) * mainLayerWidth;
			else
				mainLayer.element.scrollLeft = Math.round( mainLayer.element.scrollLeft / mainLayerWidth ) * mainLayerWidth;
		} );

		mainLayer.event( 'touchmove', function( $event ) {
			$event.preventDefault();			
			mainLayer.element.scrollLeft = mainLayer.element.scrollLeft + ( s_position - $event.touches[ 0 ].pageX) / 8;
		} );
*/
		container.in( mainLayer ).in( innerLayer.hide() ).in( menuLayer );

		window.addEventListener( 'resize', function() {
			resizeContainer();

			if ( currentIcon ) {
				$util.hash( currentIcon );
				mainLayer.element.scrollLeft += $util.number( mainLayer.style().width ) / 2 - ( iconSize + iconBorder ) / 2;
			}
		}, false );

		resizeContainer();

		// $util.ajax( 'test', 'POST', { 'a' : 1, 'b' : 2, 'c' : 3 }, function( $result ) { alert( $result.message + '[' + $result.code + ']' ); console.log( $result ); } );
	};

	var completedDOM = function() {
		document.removeEventListener( 'DOMContentLoaded', completedDOM, false );
		simpleGames();
	};

	document.addEventListener( 'DOMContentLoaded', completedDOM, false );
} )();