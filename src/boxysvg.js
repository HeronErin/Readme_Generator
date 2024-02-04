// The more basic method for generating svgs
const svgs = require("./svgs.js");

const styles = {
    lightning_blue: require("./lightning_blue.css")
};


const modes = {
    single: 1,
    double: 2,
    triple: 3,
    quadruple: 4,
    quintuple: 5,
    sextuple: 6,
    septuple: 7,
    octuple: 8,
    nonuple: 9,
    decuple: 10,
    undecuple: 11,
    duodecuple: 12,
    tredecuple: 13,
    quattuordecuple: 14,
    quindecuple: 15,
    sexdecuple: 16,
    septendecuple: 17,
    octodecuple: 18,
    novendecuple: 19,
    vigintuple: 20
}

const template = `<svg xmlns="http://www.w3.org/2000/svg" width="$WIDTH" height="$HEIGHT">
    <defs>
        <style>

        </style>
    </defs>
    <style>
        $STYLE
    </style>
    <foreignObject x="0" y="0" width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" class="items-wrapper" width="100%">

<!-- Begin Generated Code -->
$CONTENT
<!-- End of Generated Code -->

        </div>
    </foreignObject>
</svg>`

function StartTable(){
    return `<div class="primaryFlex">\n`;
}
function EndTable(body){
    return body+ ( `</div>\n` );
}
function defaultGenName(){
    return `<span class="username">${state.name}!!</span>\n`; 
}

function EnterBlock(body){
    return body+`<div class="block">\n`;
}
function LeaveBlock(body){
    return body+"</div>\n";
}
function EnterList(body, id){
    state.count = 0;
    return body+`<ul id="${id}">\n`;
}
function LeaveList(body){
    return body+"</ul>\n";
}
function AddListItem(body, text) {
    if (text == null) return body;
    return body+"<li>"+text+"</li>\n"
}

function DefaultProfilePic(){
    return `<img class="profilePic" src="${state.data.basic.avatar_url}"/>\n`
}

const overides = {
    "basic/joined": function(t){
        let obj = new Date(t*1000);
        return (state.url.searchParams.get("joinedText")||"Joined Github on ")+(obj.toLocaleDateString()) + " at " +obj.toLocaleTimeString(); },
    "basic/site_admin": (x)=>x?"Is a Github admin!":"Is not a Github admin!",
    "basic/public_repos": (x)=>`Has ${x} Repositories`,
    "basic/public_gists": (x)=>`Has ${x} Gists`,
    "basic/followers": (x)=>`Has ${x} followers`,
    // "basic/following": (x)=>`Following ${x} people`,
}
function ListPointHandle(feature, specifier){
    if (state.data[feature] == undefined) return null;
    if (state.data[feature][specifier] == undefined) return null;
    let text = state.data[feature][specifier];
    if (overides[feature+"/"+specifier]) text = overides[feature+"/"+specifier](text);
    else{text=specifier+"\t"+text;}
    return text;
}
function SubHeader(text){
    return `<span id="subHeader">${text}</span>\n`
}

function defaultHeaderGen(body){
    if (state.headerMode !== "none"){
        body=EnterBlock(body);
        let groupPic = state.url.searchParams.get("groupPicInUserInfo") !== null;
        let doPic = state.data.basic!=undefined && state.data.basic.avatar_url!=undefined;
        if (!groupPic && doPic)
            body+=DefaultProfilePic();
        
        body=EnterList(body, "userInfo");
        if (groupPic && doPic)
            body+=DefaultProfilePic();

        if (!state.headerMode.toLowerCase().includes("nameless")) body+=defaultGenName();
        if (state.data.basic!=undefined){
            console.error(state.url.searchParams.get("basicInfoSeperated"))
            if (state.url.searchParams.get("basicInfoSeperated") !== null){
                body=LeaveList(body);
                body=LeaveBlock(body);
                body=EnterBlock(body);
                body=EnterList(body, "userInfo");
            }

            let order = JSON.parse(state.url.searchParams.get("basicOrder") || `["site_admin","joined","public_repos","public_gists","followers","following"]`);
            for (let o of order)
                body=AddListItem(body, ListPointHandle("basic", o));
        }

        body=LeaveList(body);
        body=LeaveBlock(body);
    }
    return body;
}

// As not to need to pass everything into every function.
// I like me some global state
var state;
function gen(url, data){
    state={url, data, table:true};

	state.width          =( url.searchParams.get("width")      || 800 )*1;
	state.height         =( url.searchParams.get("height")     || 1000 )*1;
	state.layoutMode     =  url.searchParams.get("layoutMode") || "single"
    state.layoutMod      =  modes[state.layoutMode];
    state.count          =  0;
    state.headerMode     =  url.searchParams.get("headerMode") || "default"
    state.doIcons        =  url.searchParams.get("doIcons")    != "false"

    let body = StartTable();

    state.name = url.pathname.slice(8);

    if (state.headerMode == "default")
        body = defaultHeaderGen(body);
    delete state.data.basic;
    for (let key of Object.keys(state.data)){

        body=EnterBlock(body);

        body+=SubHeader(key)

        body=EnterList(body, key);
        
        let order = JSON.parse(state.url.searchParams.get(key+"Order") || JSON.stringify(Object.keys(state.data[key])));
        for (let o of order)
            body=AddListItem(body, ListPointHandle(key, o));
        
        body=LeaveList(body);

        body=LeaveBlock(body);
    }


    body = EndTable(body);

	console.log(template.replace("$STYLE", styles.lightning_blue).replace("$WIDTH", state.width).replace("$HEIGHT", state.height).replace("$CONTENT", body))
}


module.exports = gen;
