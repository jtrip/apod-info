# apod-info
A quick demo of Nasa's Astronomy Picture of the Day api combined with a Wikipedia reference link.  
Currently running at:  
http://www.caledoniacomics.com/

# API
Uses Flask. Has a db with a user: `Test`/`Test` for ... testing. Includes Alembic for migrations.

# Frontend
Uses React and axios. 

# Todo
This implements a very, sometimes humorously, naive Entity Extraction algorithm. Need to implement an api that actually accomplishes this.  
like: https://semantria.readme.io/docs

Frontend state should be refactored.  

Frontend also should have some user feedback for button press, so they know to wait for all the network calls.  

