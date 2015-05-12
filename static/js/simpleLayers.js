var $layer = ( function() {
	'use strict';

	var Layer = function( $id ) {		
		this.element  = $id ? $util.element( $id ) : document.createElement( 'DIV' );
		this.parent   = null;
		this.children = [];

		// private
		this._s_position = {};
		this._g_position = {};
		this._data = {};
		this._intervalX = 10;
		this._intervalY = 10;
		this._label = null;

		this.style( { 'position' : 'absolute' } );

		return this;
	};

	Layer.prototype = {
		in : function( $layer ) {
			this.element.appendChild( $layer.element );
			this.children.push( $layer );
			$layer.parent = this;
			$layer.move();
			return this;
		},

		out : function( $target ) {
			var layers = [];

			if ( $target instanceof Array )
				layers = $target;
			else
				layers.push( $target );

			for ( var i = layers.length - 1; i >= 0; i-- ) {
				var layer = layers[ i ];
				
				this.element.removeChild( layer.element );
				this.children.splice( this.children.indexOf( layer ), 1 );
				layer.parent = null;
			}

			return this;
		},

		start : function( $x, $y ) {
			this._s_position.x = $x;
			this._s_position.y = $y;

			return this;
		},

		scale : function( $x, $y ) {
			this._g_position.x = $x;
			this._g_position.y = $y;

			return this;
		},

		move : function() {
			var cellWidth, cellHeight;

			if ( this.parent ) {
				cellWidth  = $util.number( this.parent.style().width )  / this.parent._intervalX;
				cellHeight = $util.number( this.parent.style().height ) / this.parent._intervalY;

				$util.style( this.element, {
					'left'	 : this._s_position.x * cellWidth  + 'px',
					'top'	 : this._s_position.y * cellHeight + 'px',
					'width'  : this._g_position.x * cellWidth  - $util.number( this.style().borderRightWidth  ) * 2 + 'px',
					'height' : this._g_position.y * cellHeight - $util.number( this.style().borderBottomWidth ) * 2 + 'px'
				} );
			}

			this.label();
			for ( var i in this.children ) this.children[ i ].move();

			return this;
		},

		style : function( $styles ) {
			if ( $styles ) { // setter
				$util.style( this.element, $styles );
				this.move();
				return this;
			}
			
			// getter
			return $util.style( this.element );			
		},

		data : function( $data ) {
			if ( $data ) { // setter
				this._data = $data;
				return this;
			}
			
			// getter
			return this._data;
		},

		image : function( $route ) {
			this.style( {
				'background-image'  : 'url("' + $route + '")',
				'background-size'   : '100% 100%',
				'background-repeat' : 'no-repeat'
			} );

			return this;
		},

		shape : function( $shape ) {
			var style  = {},
				width  = $util.number( this.style().width  ),
				height = $util.number( this.style().height );

			switch ( $shape ) {
				case 'rounded':
					style = {
						'border-redius' : '15px',
						'-webkit-border-radius' : '15px',
						'-moz-border-radius' : '15px'
					};
					break;
				case 'circle':
					style = {
						'border-redius' : height + 'px',
						'-webkit-border-radius' : height + 'px',
						'-moz-border-radius' : height + 'px'
					};
					break;
			}
			
			this.style( style );
			return this;
		},

		show : function( $display ) {
			this.style( { 'display' : $display || 'block' } );
			return this;
		},

		hide : function() {
			this.style( { 'display' : 'none' } );
			return this;
		},

		visible : function() {
			return this.style().display === 'none' ? false : true;
		},

		event : function( $type, $callback ) {
			if ( this.element.addEventListener )
				this.element.addEventListener( $type, $callback, false );
			else if ( this.element.attachEvent )
				this.element.attachEvent( 'on' + $type, $callback );

			return this;
		},

		label : function( $title, $size ) {
			if ( !this._label ) {
				this._label = document.createElement( 'LABEL' );
				$util.style( this._label, { 'position' : 'absolute', 'width' : '100%', 'text-align' : 'center' } );				
				this.element.appendChild( this._label );
			}

			if ( $title ) this._label.textContent = $title;
			if ( $size  ) $util.style( this._label, { 'font-size' : $size } );
			
			$util.style( this._label, { 'top' : $util.number( this.style().height ) + 'px' } );

			return this;
		},

		interval : function( $intervalX, $intervalY ) {
			this._intervalX = $intervalX;
			this._intervalY = $intervalY;

			return this;
		}
	};

	return function( $options ) { return new Layer( $options ); };
} )();