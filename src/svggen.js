const { sortByDuplicates,
  issueAndPr,
  events,
  allCommits,
  basicInfo,
  repoInfo} = require("./api_utils.js");
const boxy = require("./boxysvg.js");



async function main(){
	let x = await basicInfo("HeronErin", []);
	let x2 = await issueAndPr("HeronErin", []);
	let url = new URL("http://example.com/github/HeronErin?groupPicInUserInfo")

	// console.log(await getImageBase64Url())
	boxy(url, {basic: x, issueAndPr:x2})


	
}
main().then()