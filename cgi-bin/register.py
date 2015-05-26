#!/usr/bin/python3

import json, time
from db import dbms

def process( request, response ):
	dbms.execute( dbms.INSERT_GAME )
	dbms.execute( dbms.INSERT_INTROIMAGE )
	result = { 'code' : 0, 'message' : 'success' }
	response.write( json.dumps( result ) )