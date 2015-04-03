import json
import urllib.parse
from io import StringIO
from wsgiref.simple_server import make_server, WSGIServer, WSGIRequestHandler

class SimpleRequestHandler(WSGIRequestHandler):
	def get_environ(self):
		environ = super( SimpleRequestHandler, self ).get_environ()
		request_payload = {}

		if self.command == 'GET':
			for item in environ.get( 'QUERY_STRING' ).split( '&' ):
				if item: request_payload[ item.split( '=' )[0] ] = item.split( '=' )[1]						
		elif self.command == 'POST':
			length = int( self.headers.get( 'content-length' ) )
			if length > 0: request_payload = json.loads( self.rfile.read( length ).decode( 'ascii' ) )

		environ[ 'REQUEST_PAYLOAD' ] = request_payload

		return environ

def simple_router( environ, start_response ):
	stdout = StringIO()
	request_payload = environ.get( 'REQUEST_PAYLOAD' )
	path = environ.get( 'PATH_INFO' )
	
	print( str( request_payload ), file = stdout )
	start_response("200 OK", [('Content-Type','text/json; charset=utf-8')])
	return [stdout.getvalue().encode("utf-8")]

try:	
	httpd = make_server( '', 8000, simple_router, WSGIServer, SimpleRequestHandler )
	print( 'Starting simple_httpd on port ' + str( httpd.server_port ) )
	httpd.serve_forever()
except KeyboardInterrupt:
	print( 'Shutting down simple_httpd' )
	httpd.socket.close()