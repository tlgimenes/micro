/** 
 * @description
 * Retrieves original URL from request. 
 * 
 * Platforms like Vercel and AWS masks original URLs, so new URL(request.url) 
 * would throw. This fuction solves all those border conditions and make
 * micro work on all platforms.
 * 
 * Tested platforms: 
 *  - Vercel
 *  - local deno task run
 * */
export const urlFromRequest = (request: Request): URL => {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedOrigin = forwardedHost && forwardedProto &&
    `${forwardedProto}://${forwardedHost}`;

  const base = origin ?? forwardedOrigin ?? undefined;

  return new URL(request.url, base);
};
