#!/usr/bin/python3

import json, time
from db import dbms

def process( request, response ):
	id = dbms.execute( dbms.INSERT_GAME, request )[ 0 ][ 0 ]

	introImages = request[ 'introImages' ]

	for i in range( len( introImage ) ):
		parameters = { 'gameId' : id, 'image' : introImages[ i ], 'order' : i }
		dbms.execute( dbms.INSERT_INTROIMAGE, parameters )

	result = { 'code' : 0, 'message' : 'success' }
	response.write( json.dumps( result ) )