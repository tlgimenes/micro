export function Head() {
  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <title>Not Found</title>
    </>
  );
}

export function Main() {
  return (
    <div className="flex items-center justify-center text-2xl font-thin min-h-screen divide-x">
      <span className="px-2">404</span>
      <span className="px-2">Not Found</span>
    </div>
  );
}
