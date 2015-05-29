#!/usr/bin/python3

import json, sys
from db import dbms

def process( request, response ):	
	parameters = { 'id' : request[ 'id' ] }
	
	result = dbms.execute( dbms.SELECT_GAME_INFO, parameters )[ 0 ]
	result[ 'introImages' ] = dbms.execute( dbms.SELECT_INTRO_IMAGE, parameters )
	
	response.write( json.dumps( result ) )