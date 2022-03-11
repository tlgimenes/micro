import Greeting from "./Greeting.client.tsx";

export function Head() {
  return (
    <>
      <meta name="robots" content="index,follow" />
      <title>Home</title>
    </>
  );
}

export function Main() {
  return (
    <>
      <Greeting />

      <div>Hello Wolrd</div>
    </>
  );
}
