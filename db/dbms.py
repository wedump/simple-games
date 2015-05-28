#!/usr/bin/python3

import sqlite3, sys

def execute( query, parameters = None ):
	connection = sqlite3.connect( 'db/simpledb.sqlite' )
	cursor = connection.cursor()

	if parameters is None:
		result = cursor.execute( query )
	else:
		for key in parameters.keys():
			value = parameters[ key ]

			if type( value ) == str:
				value = "'" + value + "'"

			query = query.replace( '${' + str( key ) + '}', str( value ) )

		cursor.execute( query, parameters )
	
	result = cursor.fetchall()
	connection.commit()
	connection.close()

	return result

CREATE_TABLE_GAME = """
	CREATE TABLE game (
		id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
		name TEXT NOT NULL,
		link TEXT NOT NULL,
		introText TEXT NOT NULL,
		iconImage TEXT NOT NULL,		
		regDateTime DATETIME NOT NULL
	)
"""

CREATE_TABLE_INTROIMAGE = """
	CREATE TABLE introImage (
		gameId INTEGER NOT NULL,
		image TEXT NOT NULL,
		orderSeq INTEGER NOT NULL
	)
"""

SELECT_MAX_GAME_ID = """
	SELECT MAX( id ) FROM game
"""

INSERT_GAME = """
	INSERT INTO game ( name, link, introText, iconImage, regDateTime ) VALUES ( ${name}, ${link}, ${introText}, ${iconImage}, datetime() )	
"""

INSERT_INTROIMAGE = """
	INSERT INTO introImage ( gameId, image, orderSeq ) VALUES ( ${gameId}, ${image}, ${orderSeq} )
"""