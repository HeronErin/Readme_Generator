// This file is part of github.com/HeronErin/Readme_Generator
// Copyright (C) 2024  HeronErin
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.



const { sortByDuplicates,
  issueAndPr,
  events,
  allCommits,
  basicInfo,
  repoInfo} = require("./api_utils.js");
const boxy = require("./boxysvg.js");



async function main(){
	let bi = basicInfo("HeronErin", []);
	let iapr = issueAndPr("HeronErin", []);
	// {repos: repoInfo, events: events, allCommits: allCommits}
	let url = new URL("http://example.com/github/HeronErin?groupPicInUserInfo")

	// console.log(await getImageBase64Url())
	boxy(url, {basic: await bi, issueAndPr:await iapr})


	
}
main().then()
