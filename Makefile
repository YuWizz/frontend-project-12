install:
	cd frontend && yarn install --ignore-engines

build:
	cd frontend && yarn build

start:
	./frontend/node_modules/.bin/start-server -s ./frontend/dist