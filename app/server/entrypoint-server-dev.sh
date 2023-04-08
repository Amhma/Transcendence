#!/bin/sh

if [ ! -d "/app/prisma/migrations" ]
then
	npx prisma migrate dev --name init
	npx prisma generate
	#(sleep 5 && ./fill_db_user_script.sh && npx prisma studio) &
	#(sleep 5 && npx prisma studio) &
	(sleep 15 && ./fill_db_user_script.sh && ./fill_db_game_script.sh && ./fill_db_UserInGame_script.sh && ./fill_db_one_to_one_script.sh && npx prisma studio) &
	npm run start:dev
else
	(sleep 5 && npx prisma studio) &
	npm run start:dev
fi