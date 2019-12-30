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

deploy-circleci-ecr:
	@aws cloudformation create-stack \
	--stack-name circleciecr \
	--template-body file://cloudformation/circleci_ecr.yaml \
	--capabilities CAPABILITY_NAMED_IAM

destroy-circleci-ecr:
	@aws cloudformation delete-stack \
	--stack-name circleciecr

deploy-notes-backend:
	@aws cloudformation create-stack \
	--stack-name notesbackend \
	--template-body file://cloudformation/notes_backend.yaml \
	--capabilities CAPABILITY_NAMED_IAM

destroy-notes-backend:
	@aws cloudformation delete-stack \
	--stack-name notesbackend
