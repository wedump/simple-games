#!/Library/Frameworks/Python.framework/Versions/3.4/bin/python3

from http.server import HTTPServer, CGIHTTPRequestHandler

class ServerHandler( CGIHTTPRequestHandler ):

	def do_GET( self ):
		CGIHTTPRequestHandler.do_GET( self )

	def do_POST( self ):
		CGIHTTPRequestHandler.do_GET( self )

port = 8080
httpd = HTTPServer( ( '', port ), ServerHandler )

print( 'Starting simple_httpd on port : ' + str( httpd.server_port ) )

httpd.serve_forever()