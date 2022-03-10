example=./examples/ecommerce
bin=./packages/micro/cli.ts
c_flags=--import-map=./importmap.json --config=./tsconfig.json --unstable

dev:
	mode=dev deno run --allow-all ${c_flags} --no-check --watch ${bin} dev --root=${example}

build:
	mode=prod deno run --allow-all ${c_flags} --no-check=remote ${bin} build --root=${example}

serve:
	mode=prod deno run --allow-read --allow-net ${c_flags} --no-check=remote ${bin} serve --root=${example}

cache:
	deno cache ${c_flags} --reload --no-check=remote  ${bin} --root=${example}
