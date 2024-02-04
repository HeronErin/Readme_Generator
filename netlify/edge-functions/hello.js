export default async (request, context) => {
  context.log("Calling hello.js edge function");
  const response = await fetch("https://api.github.com/users/HeronErin");
	const jresult = await response.text();

  return new Response("Hello, World from the edge!<br>"+Date.now()+"<br>"+jresult, {
    headers: { "content-type": "text/html" },
  });
};
