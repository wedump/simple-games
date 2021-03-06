( function() {
	'use strict';
	
	var simpleGames = function() {
		var currentIcon,
			
			iconSize   = 50,
			iconBorder = 4,
			iconMargin = 13,
			labelSize  = 12,
			hCorrectMargin = -10,

			popupElMargin = 10,
			popupElBorder = 4,

			mainLayerStart		= { 'w' : 0, 'h' : 0 },
			mainLayerSmallScale = { 'w' : 4, 'h' : 10 },
			mainLayerBigScale	= { 'w' : 8.5, 'h' : 10 },
			innerLayerStart		= { 'w' : 4, 'h' : 0 },
			innerLayerScale		= { 'w' : 4.5, 'h' : 10 },
			menuLayerStart		= { 'w' : 8.5, 'h' : 0 },
			menuLayerScale		= { 'w' : 1.5, 'h' : 10 },

			container  = $layer( 'container' ),
			mainLayer  = $layer(),
			menuLayer  = $layer(),
			innerLayer = $layer().hide(),
			plusButton = $layer(),
			infoView   = $layer( 'infoView' ).start( 0, 0 ).scale( 10, 10 ).data( 'orderType', 'h' ).shape( 'rounded' ).hide(),
			plusView   = $layer( 'plusView' ).start( 0, 0 ).scale( 10, 10 ).data( 'orderType', 'h' ).shape( 'rounded' ).hide();

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
				plusButton.start( 1, 1 );
			} else {
				if ( innerLayer.visible() )
					mainLayer.start( mainLayerStart.h, mainLayerStart.w ).scale( mainLayerSmallScale.h, mainLayerSmallScale.w );
				else
					mainLayer.start( mainLayerStart.h, mainLayerStart.w ).scale( mainLayerBigScale.h, mainLayerBigScale.w );

				innerLayer.start( innerLayerStart.h, innerLayerStart.w ).scale( innerLayerScale.h, innerLayerScale.w );
				menuLayer.start( menuLayerStart.h, menuLayerStart.w ).scale( menuLayerScale.h, menuLayerScale.w );
				plusButton.start( 8, 1 );
			}

			container.style( {				
				'width'  : clientWidth  + 'px',
				'height' : clientHeight + 'px'
			} );

			plusButton.shape( 'circle' ).button( 'plus' );			

			deployIcon();
		}

		function deployIcon() {
			$util.ajax( '/icon', 'GET', null, function( $result ) {
				var data = $result,
					iconBlockSize   = iconSize + iconBorder + iconMargin,
					mainLayerWidth  = $util.number( mainLayer.style().width ),
					mainLayerHeight = $util.number( mainLayer.style().height ),
					wIconCount = parseInt( mainLayerWidth / iconBlockSize ),
					hIconCount = parseInt( mainLayerHeight / ( iconBlockSize + hCorrectMargin + labelSize ) ),
					iconCountPerPage = wIconCount * hIconCount,
					totalPage  = Math.ceil( data.length / iconCountPerPage ),
					wIconBlank = ( mainLayerWidth - ( iconBlockSize * wIconCount - iconMargin ) ) / 2,
					hIconBlank = ( mainLayerHeight - ( ( iconBlockSize + hCorrectMargin + labelSize ) * hIconCount - ( iconMargin + hCorrectMargin ) ) ) / 2;
				
				mainLayer.out( mainLayer.children ).interval( mainLayerWidth, mainLayerHeight );

				roof:
				for ( var page = 0; page < totalPage; page++ )
					for ( var h = 0; h < hIconCount; h++ )
						for ( var w = 0; w < wIconCount; w++ ) {
							var icon = data[ page * iconCountPerPage + h * wIconCount + w ];
							
							if ( !icon ) break roof;

							mainLayer.in( $layer().start( page * mainLayerWidth + w * iconBlockSize + wIconBlank, h * ( iconBlockSize + hCorrectMargin + labelSize ) + hIconBlank )
												  .shape( 'rounded' )
												  .style( { 'border' : iconBorder / 2 + 'px', 'width' : iconSize + 'px', 'height' : iconSize + 'px' } )
												  .label( icon.name, labelSize + 'px' )
												  .event( 'click', $util.fn( onClickIcon, null, [ infoView ] ) )
												  .attr( 'id', icon.id )
												  .image( icon.iconImage ) );

							if ( page === totalPage - 1 && w === wIconCount - 1 )
								$util.style( mainLayer.children[ mainLayer.children.length - 1 ].element.querySelector( 'label' ), { 'width' : iconSize + wIconBlank + iconBorder / 2 + 'px', 'text-align' : 'left' } );
						}
			} );
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
			
			if ( !isVisible && $contents === infoView )
				setInfoView();
		}

		function retainIconPosition() {
			$util.hash( currentIcon );

			if ( mainLayer.element.scrollLeft != 0 )
				mainLayer.element.scrollLeft += $util.number( mainLayer.style().width ) / 2 - ( iconSize + iconBorder ) / 2;
		}

		function deployPopupElHeight( $layer ) {
			var form       = $layer.element.children[ 0 ],
				orderWidth = $layer.data( 'orderType' ) === 'w',
				elCount    = form.children.length,
				elWidth    = $util.number( $layer.style().width ) - ( popupElMargin + popupElBorder ) * 2,
				elHeight   = orderWidth
					? ( $util.number( $layer.style().height ) - ( elCount - 1 + 2 ) * ( popupElMargin + popupElBorder ) ) / elCount
					: $util.number( $layer.style().height ) - ( popupElMargin + popupElBorder ) * 2;					

			for ( var i = 0; i < form.children.length; i++ ) {
				var item = form.children.item( i );
				$util.style( item, { 'width' : elWidth + 'px', 'height' : elHeight + 'px' } );

				if ( !orderWidth )
					$util.style( item, { 'display' : 'inline-block', 'float' : 'left', 'margin-left' : popupElMargin + 'px', 'margin-top' : popupElMargin + 'px' } );
			}

			if ( !orderWidth )
				$util.style( $layer.element.querySelector( 'form' ), { 'width' : elWidth * elCount + ( popupElMargin + popupElBorder ) * ( 2 + elCount - 1 ) + 'px' } );
		}

		function setInfoView() {
			$util.ajax( '/detail', 'GET', { 'id' : currentIcon }, function( $result ) {
				document.getElementById( 'downloadBtn' ).onclick = function( $event ) {
					window.open( $result.link );
				};
				
				infoView.element.querySelector( '[name="introText"]' ).textContent = $result.introText;

				var introImages = document.getElementById( 'introImages' );
				$util.style( introImages, { 'overflow-x' : 'auto', 'white-space' : 'nowrap' } );
				introImages.innerHTML = '';

				for ( var i in $result.introImages ) {
					var div = document.createElement( 'DIV' );
					
					$util.style( div, {
						'width' : $util.style( introImages ).width,
						'height' : $util.style( introImages ).height,
						'background-image' : 'url("' + $result.introImages[ i ].image + '")',
						'background-size' : '100% 100%',
						'background-repeat' : 'no-repeat',
						'display' : 'inline-block',
						'margin' : '0'
					} );

					introImages.appendChild( div );
				}
			} );
		}

		window.addEventListener( 'resize', function() {
			resizeContainer();
			if ( currentIcon ) retainIconPosition()
		}, false );

		plusButton.event( 'click', $util.fn( onClickIcon, null, [ plusView ] ) ).attr( 'id', 'plusButton' );

		document.getElementById( 'registerBtn' ).addEventListener( 'click', function( $event ) {
			var i = 0,
				form = plusView.element.querySelector( 'form' ),
				fileReader = new FileReader,
				iconImageFiles = form.querySelector( '[name="iconImage"]' ).files,
				introImageFiles = form.querySelector( '[name="introImages"]' ).files,
				parameters = {
					'name' : form.querySelector( '[name="name"]' ).value,
					'link' : form.querySelector( '[name="link"]' ).value,
					'introText' : form.querySelector( '[name="introText"]' ).value,
					'introImages' : []
				};

			function onloadIconFileReader() {				
				parameters.iconImage = fileReader.result;
				readIntroFile();
			}

			function onloadIntroFileReader() {				
				parameters.introImages[ parameters.introImages.length ] = fileReader.result;
				readIntroFile();
			}

			function readIntroFile() {
				if ( i < introImageFiles.length ) {					
					fileReader = new FileReader;					
					fileReader.addEventListener( 'loadend', onloadIntroFileReader, false );					
					fileReader.readAsDataURL( introImageFiles[ i++ ] );
				} else {
					$util.ajax( '/register', 'POST', parameters, callbackByRegister );
				}
			}

			function callbackByRegister( $result ) {
				if ( $result.code != 0 ) {
					alert( 'Failed register.' );
					return;
				}

				form.querySelector( '[name="name"]' ).value = '';
				form.querySelector( '[name="link"]' ).value = '';
				form.querySelector( '[name="introText"]' ).value = '';
				form.querySelector( '[name="iconImage"]' ).value = '';
				form.querySelector( '[name="introImages"]' ).value = '';

				plusButton.dispatchEvent( 'click' );
			}

			if ( !parameters.name ) {
				alert( 'Please input name.' );
				return;
			}

			if ( !parameters.link ) {
				alert( 'Please input link.' );
				return;
			}
			if ( !parameters.introText ) {
				alert( 'Please input introText.' );
				return;
			}
			if ( iconImageFiles.length < 1 ) {
				alert( 'Please input iconImage.' );
				return;
			}
			if ( introImageFiles.length < 1 ) {
				alert( 'Please input intorImages.' );
				return;
			}

			fileReader.addEventListener( 'loadend', onloadIconFileReader, false );
			fileReader.readAsDataURL( iconImageFiles[ 0 ] );
		}, false );
			
		mainLayer.style( { 'overflow-x' : 'auto' } );
		innerLayer.style( { 'overflow-y' : 'auto' } );		
		plusButton.style( { 'background-color' : '#0F9D58', 'width' : '50px', 'height' : '50px', 'box-shadow' : '2px 2px 2px silver' } );

		container.in( mainLayer ).in( innerLayer ).in( menuLayer.in( plusButton ) );
		
		resizeContainer();		
	};

	var completedDOM = function() {
		document.removeEventListener( 'DOMContentLoaded', completedDOM, false );
		simpleGames();
	};

	document.addEventListener( 'DOMContentLoaded', completedDOM, false );
} )();