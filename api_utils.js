const isInCurrentDay = timestamp => new Date(timestamp).toDateString() === new Date().toDateString();
const isInCurrentWeek = timestamp => {
  const date = new Date(timestamp), today = new Date(), start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()), end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
  return date >= start && date <= end;
};
const isInCurrentMonth = timestamp => new Date(timestamp).getMonth() === new Date().getMonth() && new Date(timestamp).getFullYear() === new Date().getFullYear();
const isInCurrentYear = timestamp => new Date(timestamp).getFullYear() === new Date().getFullYear();

const isInLastDays = (timestamp, days) => {
  const currentDate = new Date();
  const targetDate = new Date(timestamp);
  const differenceInMilliseconds = currentDate - targetDate;
  const differenceInDays = differenceInMilliseconds / (24 * 60 * 60 * 1000);
  return differenceInDays <= days;
};

const isInLastWeek = timestamp => isInLastDays(timestamp, 7);
const isInLastMonth = timestamp => isInLastDays(timestamp, 30);
const isInLastYear = timestamp => isInLastDays(timestamp, 365);

function sortByDuplicates(inputList) {
	inputList=inputList.map(JSON.stringify)
	const countMap = inputList.reduce((acc, str) => {
		acc[str] = (acc[str] || 0) + 1;
		return acc;
	}, {});

	const sortedUniqueStrings = Object.keys(countMap)
		.sort((a, b) => countMap[b] - countMap[a])
		.map(str => str);

	return sortedUniqueStrings.map(JSON.parse);
}

async function issueAndPr(user, ignored){
	let count = {closed_issues: 0, issues: 0, prs: 0, merged_prs: 0, open_prs: 0, closed_prs: 0};
	if (user == "DEBUG") return count;

	const response = await fetch("https://api.github.com/search/issues?q=author:"+user);
	const result = await response.json();
	if (result.message == "Validation Failed"){ return {"ERROR": "Can't find user"} }
	
	
	
	for (let issue of result.items){
		if (issue.pull_request != undefined){
			count.prs++;
			if (issue.pull_request.merged_at !== null) count.merged_prs++;
			else if (issue.state != "closed") count.open_prs++;
			else count.closed_prs++;
		}else{
			count.issues++;
			if (issue.state == "closed") count.closed_issues++
		}
	}
	for (let to_ignore of ignored)
		if (count[to_ignore] !== undefined) delete count[to_ignore];
	
	return count;
}
async function events(user, ignored){
	var count = {commits_pushed_this_year: 0, branches_created_this_year: 0, tags_created_this_year: 0, repos_created_this_year: 0, releases_created_this_year: 0}
	if (user == "DEBUG") return count;

	const response = await fetch("https://api.github.com/users/"+user+"/events");
	const jresult = await response.json();

	
	for (let event of jresult){
		let timeElapsed = Date.now()-Date.parse(event.created_at);
		let yearsElapsed = timeElapsed / 1000 / 60 / 60 / 24 / 365
		if (event.type == "PushEvent"){
			if (yearsElapsed <= 1) count.commits_pushed_this_year+=event.payload.size;
		}
		else if (event.type == "CreateEvent"){
			if (event.payload.ref_type == "tag"        && yearsElapsed <= 1) count.tags_created_this_year     ++;
			if (event.payload.ref_type == "branch"     && yearsElapsed <= 1) count.branches_created_this_year ++;
			if (event.payload.ref_type == "repository" && yearsElapsed <= 1) count.repos_created_this_year    ++;
		}
		else if(event.type == "ReleaseEvent"){
			if (yearsElapsed <= 1) count.releases_created_this_year++;
		}
	}
	for (let to_ignore of ignored)
		if (count[to_ignore] !== undefined) delete count[to_ignore];
	return count;
}
async function allCommits(user, ignored){
	let count = {
		total_commits: 0,
		commits_today: 0,
		commits_this_week: 0,
		commits_this_mounth:0,
		commits_this_year: 0,
		commits_from_last_week: 0,
		commits_from_last_month: 0,
		commits_from_last_year: 0,
	};
	if (user == "DEBUG") return count;

	const response = await fetch("https://api.github.com/search/commits?q=author:"+user+"&sort=committer-date&per_page=100");
	const jresult = await response.json();

	count.total_commits=jresult.total_count;

	for (let commit of jresult.items){
		let date = Date.parse(commit.commit.committer.date);

		if (isInCurrentDay(date)) count.commits_today++;
		if (isInCurrentWeek(date)) count.commits_this_week++;
		if (isInCurrentMonth(date)) count.commits_this_mounth++;
		if (isInCurrentYear(date)) count.commits_this_year++;

		if (isInLastWeek(date)) count.commits_from_last_week++;
		if (isInLastMonth(date)) count.commits_from_last_month++;
		if (isInLastYear(date)) count.commits_from_last_year++;
	}
	for (let to_ignore of ignored)
		if (count[to_ignore] !== undefined) delete count[to_ignore];
	return count;
}
async function basicInfo(user, ignored){
	if (user == "DEBUG") return {site_admin:0, public_repos:0,public_gists:0,followers:0,following:0,joined:0};


	const response = await fetch("https://api.github.com/users/"+user);
	const jresult = await response.json();
	let count = {
		site_admin: jresult.site_admin || false,
		public_repos: jresult.public_repos || 0,
		public_gists: jresult.public_gists || 0,
		followers: jresult.followers || 0,
		following: jresult.following || 0,
		joined: Date.parse(jresult.created_at)/1000,
	};
	for (let to_ignore of ignored)
		if (count[to_ignore] !== undefined) delete count[to_ignore];
	return count;
}
async function repoInfo(user, ignored){
	if (user == "DEBUG") return {mostCommonLanguages:[], mostCommonLicenses:[],mostForked:[],mostStarred:[],mostWatched:[],largestSize:[], forkedRepos:0, reposWithGithubPages:0, nonForkedRepos:0};

	const response = await fetch("https://api.github.com/users/"+user+"/repos");
	const jresult = await response.json();
	// console.log(jresult)
	let count = {
		mostCommonLanguages: sortByDuplicates(jresult.map((repo)=>repo.language||"None")),
		mostCommonLicenses:  sortByDuplicates(jresult.filter((repo)=>!!repo.license).map((repo)=>repo.license)),
		mostForked: jresult.map((repo)=>[repo.forks_count, repo.full_name]).filter((repo)=>repo[0]).sort((a, b)=>b[0]-a[0]),
		mostStarred: jresult.map((repo)=>[repo.stargazers_count, repo.full_name]).filter((repo)=>repo[0]).sort((a, b)=>b[0]-a[0]),
		mostWatched: jresult.map((repo)=>[repo.watchers_count, repo.full_name]).filter((repo)=>repo[0]).sort((a, b)=>b[0]-a[0]),
		largestSize: jresult.map((repo)=>[repo.size, repo.full_name]).filter((repo)=>repo[0]).sort((a, b)=>b[0]-a[0]),
		forkedRepos: jresult.filter(repo=>repo.fork).length,
		reposWithGithubPages: jresult.filter(repo=>repo.has_pages).length,
	};
	count["nonForkedRepos"] = jresult.length-count.forkedRepos
	
	return count;
}
export {
  isInCurrentDay,
  isInCurrentWeek,
  isInCurrentMonth,
  isInCurrentYear,
  isInLastDays,
  isInLastWeek,
  isInLastMonth,
  isInLastYear,
  sortByDuplicates,
  issueAndPr,
  events,
  allCommits,
  basicInfo,
  repoInfo,
};