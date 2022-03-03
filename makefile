project=examples/ecommerce

dev:
	mode=dev deno run --allow-all --import-map importmap.json --no-check --unstable --watch ${project}/server.ts

start:
	deno run deno run --allow-all --import-map importmap.json --unstable ${project}/server.ts

cache:
	deno cache --import-map=importmap.json --reload --no-check ${project}/server.ts