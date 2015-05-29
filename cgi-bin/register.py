#!/usr/bin/python3

import json
from db import dbms

def process( request, response ):
	parameters = {}
	parameters[ 'name' ] = request[ 'name' ]
	parameters[ 'link' ] = request[ 'link' ]
	parameters[ 'introText' ] = request[ 'introText' ]
	parameters[ 'iconImage' ] = request[ 'iconImage' ]

	dbms.execute( dbms.INSERT_GAME, parameters )
	id = dbms.execute( dbms.SELECT_MAX_GAME_ID )[ 0 ][ 0 ]

	introImages = request[ 'introImages' ]

	for i in range( len( introImages ) ):
		parameters = { 'gameId' : id, 'image' : introImages[ i ], 'orderSeq' : i }
		dbms.execute( dbms.INSERT_INTROIMAGE, parameters )

	result = { 'code' : 0, 'message' : 'success' }
	response.write( json.dumps( result ) )