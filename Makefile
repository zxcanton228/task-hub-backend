build:
	docker-compose up backend -d --build

db:
	docker-compose up database -d --build 
seed:
	docker-compose exec backend bun seed:prod
db-init: 
	docker-compose exec backend bun run db:push
	make seed


back:
	docker-compose up backend database -d --build 
front:
	docker-compose up frontend nginx -d --build 

up:
	docker-compose up -d
stop:
	docker-compose stop
down:
	docker-compose down -v