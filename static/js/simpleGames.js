( function() {
	'use strict';
	
	var simpleGames = function() {
		var currentIcon,
			
			iconSize   = 50,
			iconBorder = 10,
			iconMargin = 13,
			labelSize  = 14,
			hCorrectMargin = -10,

			popupElMargin = 10,
			popupElBorder = 6,

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
			innerLayer = $layer().hide(),
			plusButton = $layer(),
			infoView   = $layer( 'infoView' ).start( 0, 0 ).scale( 10, 10 ).hide(),
			plusView   = $layer( 'plusView' ).start( 0, 0 ).scale( 10, 10 ).hide();

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
				plusButton.start( 0, 0 );
			} else {
				if ( innerLayer.visible() )
					mainLayer.start( mainLayerStart.h, mainLayerStart.w ).scale( mainLayerSmallScale.h, mainLayerSmallScale.w );
				else
					mainLayer.start( mainLayerStart.h, mainLayerStart.w ).scale( mainLayerBigScale.h, mainLayerBigScale.w );

				innerLayer.start( innerLayerStart.h, innerLayerStart.w ).scale( innerLayerScale.h, innerLayerScale.w );
				menuLayer.start( menuLayerStart.h, menuLayerStart.w ).scale( menuLayerScale.h, menuLayerScale.w );
				plusButton.start( 8.5, 0 );
			}

			container.style( {				
				'width'  : clientWidth  - 10 + 'px',
				'height' : clientHeight - 10 + 'px'
			} );

			plusButton.shape( 'circle' );

			deployIcon();
		}

		function deployIcon() {
			// test data
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
			
			mainLayer.out( mainLayer.children ).interval( mainLayerWidth, mainLayerHeight );

			roof:
			for ( var page = 0; page < totalPage; page++ )
				for ( var h = 0; h < hIconCount; h++ )
					for ( var w = 0; w < wIconCount; w++ ) {
						if ( !data[ page * iconCountPerPage + h * wIconCount + w ] )
							break roof;

						mainLayer.in( $layer().start( page * mainLayerWidth + w * iconBlockSize + wIconBlank, h * ( iconBlockSize + hCorrectMargin + labelSize ) + hIconBlank )
											  .shape( 'rounded' )
											  .style( { 'border' : iconBorder / 2 + 'px solid gray', 'width' : iconSize + 'px', 'height' : iconSize + 'px' } )
											  .label( 'game' + data[ page * iconCountPerPage + h * wIconCount + w ], labelSize + 'px' )
											  .event( 'click', $util.fn( onClickIcon, null, [ infoView ] ) )
											  .attr( 'id','game' + data[ page * iconCountPerPage + h * wIconCount + w ] ) );

						if ( page === totalPage - 1 && w === wIconCount - 1 )
							$util.style( mainLayer.children[ mainLayer.children.length - 1 ].element.querySelector( 'label' ), { 'width' : iconSize + wIconBlank + iconBorder / 2 + 'px', 'text-align' : 'left' } );
					}
		}

		function onClickIcon( $contents, $event ) {
			var isVisible  = innerLayer.visible(),
				oldScrollLeft = mainLayer.element.scrollLeft;

			if ( isVisible && currentIcon === $event.target.id )
				innerLayer.out( innerLayer.children ).hide();
			else
				innerLayer.out( innerLayer.children ).in( $contents.show( 'table-cell' ) ).show();
			
			resizeContainer();
			currentIcon = $event.target.id;

			if ( isVisible || currentIcon.indexOf( 'Button' ) > -1 )
				mainLayer.element.scrollLeft = oldScrollLeft;
			else
				retainIconPosition();

			deployPopupElHeight( $contents );
		}

		function retainIconPosition() {
			$util.hash( currentIcon );

			if ( mainLayer.element.scrollLeft != 0 )
				mainLayer.element.scrollLeft += $util.number( mainLayer.style().width ) / 2 - ( iconSize + iconBorder ) / 2;
		}

		function deployPopupElHeight( $layer ) {
			var form     = $layer.element.children[ 0 ],
				elCount  = form.children.length,
				elWidth  = $util.number( $layer.style().width ) - ( popupElMargin + popupElBorder ) * 2,
				elHeight = ( $util.number( $layer.style().height ) - ( elCount - 1 + 2 ) * ( popupElMargin + popupElBorder ) ) / elCount;

			for ( var i = 0; i < form.children.length; i++ )
				$util.style( form.children.item( i ), { 'width' : elWidth + 'px', 'height' : elHeight + 'px' } );
		}

		window.addEventListener( 'resize', function() {
			resizeContainer();
			if ( currentIcon ) retainIconPosition()
		}, false );

		plusButton.event( 'click',  $util.fn( onClickIcon, null, [ plusView ] ) ).attr( 'id', 'plusButton' );

		container.style( { 'border' : '5px solid red' } );
		mainLayer.style( { 'border' : '5px solid blue', 'overflow-x' : 'auto' } );
		menuLayer.style( { 'border' : '5px solid green' } );
		innerLayer.style( { 'border' : '5px solid brown' } );
		plusButton.style( { 'border' : '5px solid green', 'width' : '40px', 'height' : '40px' } );
		infoView.style( { 'border': '5px solid yellow' } );
		plusView.style( { 'border': '5px solid hotpink', 'position' : '' } );

		container.in( mainLayer ).in( innerLayer ).in( menuLayer.in( plusButton ) );
		
		resizeContainer();

		document.getElementById( 'registerBtn' ).addEventListener( 'click', function( $event ) {
			$util.ajax( '/test', 'POST', document.getElementsByName('iconImage')[0].files[0], function( $result ) { alert( 'success' ); } );
		}, false );
	};

	var completedDOM = function() {
		document.removeEventListener( 'DOMContentLoaded', completedDOM, false );
		simpleGames();
	};

	document.addEventListener( 'DOMContentLoaded', completedDOM, false );
} )();