#!/usr/bin/python3

import os
from io import StringIO
from importlib import import_module

base_package = 'cgi-bin'

class Response:
	def __init__( self, stdout ):
		self.stdout = stdout

	def write( self, contents ):
		print( contents, file = self.stdout )

def route( environ, start_response ):
	stdout = StringIO()
	path = environ.get( 'PATH_INFO' )	
	
	if is_static( path ):
		return do_static( path, environ, start_response, stdout )

	return do_dynamic( path, environ, start_response, stdout )
	

def is_static( path ):
	if path[ path.rfind( '.' ) + 1: ] in [ 'html', 'js', 'css', 'jpg', 'png', 'gif', 'mp4', 'avi', 'ico' ]:
		return True

	return False

def get_ctype( path ):
	return 'text/html'

def do_static( path, environ, start_response, stdout ):
	try:
		f = open( path[1:], 'rb' )
	except OSError:
		start_response( '404 File not found', [] )
		return [ path.encode( 'utf-8' ) ]

	try:		
		fs = os.fstat( f.fileno() )
		start_response( '200 OK', [ ( 'Content-Type', get_ctype( path ) ), ( 'Content-Length', str( fs[ 6 ]) ) ] )				
		return f.readlines()
	except:
		f.close()
		raise

def do_dynamic( path, environ, start_response, stdout ):
	import_module( base_package + '.' + ( path[ 1: ].replace( '/', '.' ) or 'index' ) ).process( environ.get( 'REQUEST_PAYLOAD' ), Response( stdout ) )
	start_response( '200 OK', [ ( 'Content-Type', 'text/json; charset=utf-8' ) ] )

	return [ stdout.getvalue().encode( 'utf-8' ) ]