install:
	npm ci

start:
	npm start

build:
	npm run build

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

check-format:
	npx prettier --check 'src/**/*.{js,jsx,css,json}'

format:
	npx prettier --write 'src/**/*.{js,jsx,css,json}'

check-code: lint check-format
