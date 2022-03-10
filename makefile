example=./examples/ecommerce
bin=./packages/micro/cli.ts
c_flags=--import-map=./importmap.json --config=./tsconfig.json --unstable

dev:
	mode=dev deno run --allow-all ${c_flags} --no-check --watch ${bin} start --root=${example}

start:
	mode=prod deno run --allow-all ${c_flags} --no-check=remote ${bin} start --root=${example}

cache:
	deno cache ${c_flags} --reload --no-check=remote  ${bin} --root=${example}
