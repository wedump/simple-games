#!/usr/bin/python3

import json, time

def process( request, response ):	
	time.sleep( 3 )
	result = { 'code' : 0, 'message' : 'success' }
	response.write( json.dumps( result ) )