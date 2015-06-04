#!/usr/bin/python3

import json
from db import dbms

def process( request, response ):
	result = dbms.execute( dbms.SELECT_ICON_INFO )	
	response.write( json.dumps( result ) )