curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"sacha", "password":"lahlou", "avatar":"slahlou.JPG"}'

curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"gus", "password":"alorain", "avatar":"alorain.jpeg"}'

curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"amir", "password":"mahla", "avatar":"amahla.JPG"}'


curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"random", "password":"user"}'