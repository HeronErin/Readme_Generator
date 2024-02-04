import { sortByDuplicates,
  issueAndPr,
  events,
  allCommits,
  basicInfo,
  repoInfo,} from "../../src/api_utils.js"

export default async (request, context) => { 
	const VALID_FEATURES = {issueAndPr: issueAndPr, basic: basicInfo, repos: repoInfo, events: events, allCommits: allCommits};

	const url = new URL(request.url)
	const name = url.pathname.slice(8); // Cut out "/github/"

	// return new Response(name, {
	// 		    headers: { "content-type": "text/html" },
	// 		    status: 406
	// 		  });

	// console.log(url.searchParams)
	let requested_features, ignored;
	try{
		requested_features = JSON.parse(url.searchParams.get("features") || "[]");
		ignored = JSON.parse(url.searchParams.get("ignored") || "[]");
	}catch(e){
			return new Response("<h2>Json parse error</h2>", {
			    headers: { "content-type": "text/html" },
			    status: 406
			  });
	}

	for (let feature of requested_features)
		if (VALID_FEATURES[feature] == undefined)
			return new Response("<h2>Unknown feature</h2>", {
			    headers: { "content-type": "text/html" },
			    status: 406
			  });
	
	let info = {};
	let feature_queue = requested_features.map((feature) => VALID_FEATURES[feature](name, ignored));
	for (let future of feature_queue)
		info = {...info, ...(await future)};
	return new Response(JSON.stringify(info), {
	    headers: { "content-type": "text/html" }
	  });


	// fetch("https://api.github.com/search/issues?q=author:HeronErin").then(r=>r.json().then(jso=>{
	// 	for (let event of jso.items){
	// 		if (event.pull_request == undefined)
	// 			console.log(event)
	// 	}
	// }))

	// console.log("asd")
}
