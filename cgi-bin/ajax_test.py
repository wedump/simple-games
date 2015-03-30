#!/Library/Frameworks/Python.framework/Versions/3.4/bin/python3

import cgi
import json
import sys
import os
import urllib.parse

method = os.environ.get( 'REQUEST_METHOD' )

if ( method == 'GET' ):
	parameters = json.loads( cgi.FieldStorage().getvalue( 'parameters' ) )
elif ( method == 'POST' ):
	parameters = json.loads( urllib.parse.unquote( sys.stdin.read( int( os.environ.get( 'CONTENT_LENGTH', 0 ) ) ) ) )

print( 'Request Parameters : ' + str( parameters ), file = sys.stderr )
print( 'Content-Type: application/json\n\n' )
print( json.dumps( { 'code' : 0, 'message' : 'success' } ) )