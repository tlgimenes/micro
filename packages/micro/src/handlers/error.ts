import { headers } from "../constants.ts";

export const handler = (err: Error) => {
  console.error(err)

  return new Response('Internal Server Error', {
    status: 500,
    headers: {
      ...headers,
      'cache-control': 'public, max-age=0, must-revalidate'
    }
  })
}