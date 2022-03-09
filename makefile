example=examples/ecommerce
c_flags=--allow-all --import-map importmap.json --config tsconfig.json

dev:
	mode=dev deno run ${c_flags} --no-check --unstable --watch ${example}/server.ts

start:
	mode=prod deno run ${c_flags} --unstable ${example}/server.ts

cache:
	deno cache --import-map=importmap.json --reload --no-check ${example}/server.ts