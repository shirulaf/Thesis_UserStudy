# Thesis_UserStudy

###  About the app  ###
I wrote this app in order to conduct a user study for my thesis work. 
The app persent to the participants 3 questionnires, pre and post user study, and the user study itself.
For each participant a different gourps of movies is presentes, after randomly generated from the server.
All user actions ( click, check ) are recorded and sednded to the server. Eventually for each participnat a report with his  answers and action
is saved. Also a local copy of the results is being saved to a file in order to back up the results.

###  running the app  ###
In order to run the app:
- Allow cross origin ( I used the chrome extension: https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)
- run the server :  listens on local host, port 8080. ( You may run with "node .../Thesis_UserStudy/server server")
- run the client:  listens on local host, port 3002. ( You may run with "node .../Thesis_UserStudy/client server")

All the relevant files and data for the user study are attached to the repository
