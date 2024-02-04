export default async (request, context) => {
  context.log("Calling hello.js edge function");

  return new Response("Hello, World from the edge!<br>"+Date.now(), {
    headers: { "content-type": "text/html" },
  });
};
