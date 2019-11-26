.PHONY: up down psql test

up:
	@docker-compose -f docker-compose.yml up

down:
	@docker-compose down

psql:
	@psql --host=localhost --port=5432 --user=postgres

start:
	@yarn start

test:
	@yarn test

db-init:
	@yarn db:init

db-migrate:
	@yarn db:migrate

db-seed:
	@yarn db:seed
