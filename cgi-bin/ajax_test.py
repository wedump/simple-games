#!/usr/bin/python3

import cgi, json, sys, os, urllib.parse, time

method = os.environ.get( 'REQUEST_METHOD' )

if ( method == 'GET' ):
	parameters = json.loads( cgi.FieldStorage().getvalue( 'parameters' ) )
elif ( method == 'POST' ):
	parameters = json.loads( urllib.parse.unquote( sys.stdin.read( int( os.environ.get( 'CONTENT_LENGTH', 0 ) ) ) ) )

time.sleep( 3 )

print( 'Request Parameters : ' + str( parameters ), file = sys.stderr )
print( 'Content-Type: application/json\n\n' )
print( json.dumps( { 'code' : 0, 'message' : 'success' } ) )