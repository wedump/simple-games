#!/usr/bin/python3

import json, time, sys

def process( request, response ):
	print( request, file = sys.stderr )
	result = { 'code' : 0, 'message' : 'success' }
	response.write( json.dumps( result ) )