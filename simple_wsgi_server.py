import json
import urllib.parse
from io import StringIO
from wsgiref.simple_server import make_server, WSGIServer, WSGIRequestHandler

class SimpleServerHandler(WSGIRequestHandler):

	def get_environ(self):
		env = self.server.base_environ.copy()
		env['SERVER_PROTOCOL'] = self.request_version
		env['SERVER_SOFTWARE'] = self.server_version
		env['REQUEST_METHOD'] = self.command
		if '?' in self.path:
			path,query = self.path.split('?',1)
		else:
			path,query = self.path,''

		env['PATH_INFO'] = urllib.parse.unquote_to_bytes(path).decode('iso-8859-1')
		env['QUERY_STRING'] = query

		host = self.address_string()
		if host != self.client_address[0]:
			env['REMOTE_HOST'] = host
		env['REMOTE_ADDR'] = self.client_address[0]

		if self.headers.get('content-type') is None:
			env['CONTENT_TYPE'] = self.headers.get_content_type()
		else:
			env['CONTENT_TYPE'] = self.headers['content-type']

		length = self.headers.get('content-length')
		if length:
			env['CONTENT_LENGTH'] = length

		for k, v in self.headers.items():
			k=k.replace('-','_').upper(); v=v.strip()
			if k in env:
				continue					# skip content length, type,etc.
			if 'HTTP_'+k in env:
				env['HTTP_'+k] += ','+v	 # comma-separate multiple headers
			else:
				env['HTTP_'+k] = v

		request_payload = {}

		if self.command == 'GET':
			for item in query.split( '&' ):
				request_payload[ item.split( '=' )[0] ] = item.split( '=' )[1]			
		elif self.command == 'POST':
			request_payload = json.loads( self.rfile.read( int( length ) ).decode( 'ascii' ) )

		env[ 'REQUEST_PAYLOAD' ] = request_payload

		return env

def simple_router( environ, start_response ):	
	stdout = StringIO()
	request_payload = environ[ 'REQUEST_PAYLOAD' ]
	
	print( str( request_payload ), file = stdout )
	start_response("200 OK", [('Content-Type','text/json; charset=utf-8')])
	return [stdout.getvalue().encode("utf-8")]

try:	
	httpd = make_server( '', 8000, simple_router, WSGIServer, SimpleServerHandler )
	print( 'Starting simple_httpd on port ' + str( httpd.server_port ) )
	httpd.serve_forever()
except KeyboardInterrupt:
	print( 'Shutting down simple_httpd' )
	httpd.socket.close()