#!/usr/bin/python3

import json, simple_router
from wsgiref.simple_server import make_server, WSGIServer, WSGIRequestHandler

class SimpleRequestHandler( WSGIRequestHandler ):
	def get_environ( self ):
		environ = super( SimpleRequestHandler, self ).get_environ()
		request_payload = {}

		if self.command == 'GET':
			for item in environ.get( 'QUERY_STRING' ).split( '&' ):
				if item: request_payload[ item.split( '=' )[ 0 ] ] = item.split( '=' )[ 1 ]
		elif self.command == 'POST':
			length = int( self.headers.get( 'content-length' ) )
			if length > 0: request_payload = json.loads( self.rfile.read( length ).decode( 'utf-8' ) )

		environ[ 'REQUEST_PAYLOAD' ] = request_payload

		return environ

try:
	httpd = make_server( '', 8000, simple_router.route, WSGIServer, SimpleRequestHandler )
	print( 'Starting simple_httpd on port ' + str( httpd.server_port ) )
	httpd.serve_forever()
except KeyboardInterrupt:
	print( 'Shutting down simple_httpd' )
	httpd.socket.close()