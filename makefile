example=examples/ecommerce
c_flags=--import-map importmap.json --config tsconfig.json --unstable

dev:
	mode=dev deno run --allow-all ${c_flags} --no-check --watch ${example}/server.ts

start:
	mode=prod deno run --allow-all ${c_flags} --no-check=remote ${example}/server.ts

cache:
	deno cache ${c_flags} --reload --no-check=remote  ${example}/server.ts