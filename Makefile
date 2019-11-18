.PHONY: up down psql test

up:
	@docker-compose -f docker-compose.yml up

down:
	@docker-compose down

psql:
	@psql --host=localhost --port=5432 --user=postgres

test:
	@yarn test
