flags=--allow-all --import-map importmap.json --config ../../tsconfig.json

dev:
	mode=dev deno run ${flags} --no-check --unstable --watch server.ts

start:
	mode=prod deno run ${flags} --unstable server.ts

cache:
	deno cache --import-map=importmap.json --reload --no-check server.ts