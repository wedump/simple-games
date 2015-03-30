( function() {
	'use strict';
	
	var simpleGames = function() {
		/* === TO DO LIST ===
			$util.ajax
				- 진짜 json으로 주고받을 수 있게 변경(문자열 파싱방법)
			scrolling
		*/

		var container  = $layer( 'container' ),
			mainLayer  = $layer().start( 0, 0 ).goal( 10, 9 ).interval( 21, 16 ),
			menuLayer  = $layer().start( 0, 9 ).goal( 10, 1 ),
			innerLayer = $layer().start( 0, 2 ).goal( 10, 8 );

		container.style( {
			'border' : '5px solid red',
			'width'  : document.documentElement.clientWidth  - 10 + 'px',
			'height' : document.documentElement.clientHeight - 10 + 'px'
		} );
		
		mainLayer.style( { 'border' : '5px solid blue' } );
		menuLayer.style( { 'border' : '5px solid green' } );
		innerLayer.style( { 'border' : '5px solid brown' } );
		
		// layout init
		container.in( mainLayer.in( innerLayer.hide() ) ).in( menuLayer );

		for ( var i = 0; i < 5; i++ )
			for ( var j = 0; j < 4; j++ )
				mainLayer.in( $layer().start( j + 1 + 4 * j, i + 1 + 2 * i).goal( 4, 2 ).shape( 'rounded' ).style( { 'border' : '5px solid gray' } ).label( 'game' + i + j, '14px' ) );

		$util.ajax( 'cgi-bin/ajax_test.py', 'POST', { 'a' : 1, 'b' : 2, 'c' : 3 }, function( $result ) { alert( $result.message + '[' + $result.code + ']' ); console.log( $result ); } );
	};

	var completedDOM = function( $event ) {
		if ( document.addEventListener ) {
			document.removeEventListener( 'DOMContentLoaded', completedDOM, false );
			simpleGames();
		} else { // IE
			if ( document.readyState === 'complete' ) {
				document.detachEvent( 'onreadystatechange', completedDOM );
				simpleGames();
			}
		}
	};
	
	if ( document.addEventListener )
		document.addEventListener( 'DOMContentLoaded', completedDOM, false );
	else
		document.attachEvent( 'onreadystatechange', completedDOM );	
} )();