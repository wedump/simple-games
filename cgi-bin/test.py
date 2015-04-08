#!/usr/bin/python3

import json

def process( request, response ):
	result = { 'code' : 0, 'message' : 'success' }
	response.write( json.dumps( result ) )