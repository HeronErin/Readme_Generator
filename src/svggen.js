const { sortByDuplicates,
  issueAndPr,
  events,
  allCommits,
  basicInfo,
  repoInfo} = require("./api_utils.js");
const boxy = require("./boxysvg.js");


async function main(){
	let x = await basicInfo("DEBUG", []);
	let url = new URL("http://example.com/github/DEBUG")
	boxy(url, {basic: x})


	
}
main().then()