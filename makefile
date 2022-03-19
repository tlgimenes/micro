example=./examples/website
bin=./packages/micro/cli.ts
c_flags=--config=./deno.json --unstable

dev: 
	make -j2 tailwind_dev micro_dev

start:
	make -j1 tailwind micro

cache:
	deno cache ${c_flags} --reload --no-check=remote  ${bin}

tailwind:
	npx tailwindcss -c ${example}/tailwind.config.js -i ${example}/App.css -o ${example}/public/styles.css

tailwind_dev:
	npx tailwindcss -c ${example}/tailwind.config.js -i ${example}/App.css -o ${example}/public/styles.css -w

micro:
	mode=prod deno run --allow-all ${c_flags} --no-check ${bin} start --root=${example}

micro_dev:
	mode=dev deno run --allow-all ${c_flags} --no-check --watch ${bin} start --root=${example}
