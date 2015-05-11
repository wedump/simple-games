( function() {
	'use strict';
	
	/**
		1. 아이콘 사이즈 관리(글로벌)
		2. 유틸함수 $util로 이주
		3. onClickIcon에 인자로 layer를 받아 다른 타입 아이콘별로 다른 화면 출력할 수 있도록 수정
		4. 입력 팝업 만들고, 서버 저장 개발
	**/

	var simpleGames = function() {
		var currentHash,
			container  = $layer( 'container' ),
			mainLayer  = $layer(),
			menuLayer  = $layer(),
			innerLayer = $layer();

		function resizeContainer() {
			var clientWidth  = document.documentElement.clientWidth,
				clientHeight = document.documentElement.clientHeight;

			if ( clientWidth > clientHeight ) {
				if ( innerLayer.visible() )
					mainLayer.start( 0, 0 ).scale( 4, 10 );
				else
					mainLayer.start( 0, 0 ).scale( 9, 10 );

				innerLayer.start( 4, 0 ).scale( 5, 10 );
				menuLayer.start( 9, 0 ).scale( 1, 10 );				
			} else {
				if ( innerLayer.visible() )
					mainLayer.start( 0, 0 ).scale( 10, 4 );
				else
					mainLayer.start( 0, 0 ).scale( 10, 9 );

				innerLayer.start( 0, 4 ).scale( 10, 5 );
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

						var icon = $layer().start( page * mainLayerWidth + w * iconBlockSize + wIconBlank, h * ( iconBlockSize + h_correct_margin + labelSize ) + hIconBlank )
										   .shape( 'rounded' )
										   .style( { 'border' : iconBorder / 2 + 'px solid gray', 'width' : iconSize + 'px', 'height' : iconSize + 'px' } )
										   .label( 'game' + data[ page * iconCountPerPage + h * wIconCount + w ], labelSize + 'px' )
										   .event( 'click', onClickIcon );

						icon.element.id = icon._label.childNodes[ 0 ].nodeValue;

						mainLayer.in( icon );

						if ( page === totalPage - 1 && w === wIconCount - 1 )
							$util.style( mainLayer.children[ mainLayer.children.length - 1 ].element.querySelector( 'label' ), { 'width' : iconSize + wIconBlank + iconBorder / 2 + 'px', 'text-align' : 'left' } );
					}
		}

		function onClickIcon( $event ) {
			var isVisible = innerLayer.visible(),
				scrollLeft = mainLayer.element.scrollLeft;

			innerLayer.show();
			resizeContainer();

			currentHash = '#' + $event.target.id;

			if ( isVisible ) {
				mainLayer.element.scrollLeft = scrollLeft;
			} else {
				location.hash = currentHash;
				location.hash = '';
				mainLayer.element.scrollLeft += $util.number( mainLayer.style().width ) / 2 - 30;
			}
		}

		mainLayer.style( { 'border' : '5px solid blue', 'overflow-x' : 'auto' } );
		menuLayer.style( { 'border' : '5px solid green' } );
		innerLayer.style( { 'border' : '5px solid brown' } );
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

			if ( currentHash ) {
				location.hash = currentHash; location.hash = '';
				mainLayer.element.scrollLeft += $util.number( mainLayer.style().width ) / 2 - 30;
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