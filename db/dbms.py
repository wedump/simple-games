import sqlite3

def execute( query, parameters ):
	connection = sqlite3.connect( 'simpledb.sqlite' )
	cursor = connection.cursor()

	result = cursor.execute( query )
	result = cursor.execute( query, parameters )

	connection.commit()
	connection.close()

	return result

CREATE_TABLE_GAME = """
	CREATE TABLE game (
		id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
		name TEXT NOT NULL,
		link TEXT NOT NULL,
		introtext TEXT NOT NULL,
		iconimage TEXT NOT NULL,		
		regdate DATE NOT NULL
	)
"""

CREATE_TABLE_INTROIMAGE = """
	CREATE TABLE introimage (
		gameid INTEGER NOT NULL,
		image TEXT NOT NULL,
		order INTEGER NOT NULL
	)
"""

INSERT_GAME = """
	INSERT INTO game ( name, link, introtext, iconimage, regdate ) VALUES ( ?, ?, ?, ?, ? )
"""

INSERT_INTROIMAGE = """
	INSERT INTO introimage ( gameid, image, order ) VALUES ( ?, ?, ? )
"""