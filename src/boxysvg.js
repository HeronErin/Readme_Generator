// The more basic method for generating svgs
const svgs = require("./svgs.js");
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
        td -> *{
            float: left;
        }
        td{
            width: auto;
        }
        .username{
            display: block;
            width: fit-content;
        }
        table{
            width: 100%;
        }   
        .profilePic{
            width: 64px;
        }
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
    return `<table class="primaryTable">\n`
}
function EndTable(body){
    return body+`</table>`
}
function defaultGenName(body){
    return body + `<span class="username">${state.name}!!</span>\n`; 
}

function EnterBlock(body){
    if (state.count % state.layoutMod == 0) body+="<tr>";
    body+="<td>";
    return body;
}
function LeaveBlock(body){
    body+="</td>";
    if (state.count % state.layoutMod == 0) body+="</tr>";
    state.count++;
    return body;
}

function defaultHeaderGen(body){
    if (state.headerMode !== "none"){
        body=EnterBlock(body);
        if (state.data.basic!=undefined && state.data.basic.avatar_url!=undefined){
            body+=`<span><img class="profilePic" src="${state.data.basic.avatar_url}"/></span>\n`
            // if (!state.headerMode.toLowerCase().includes("profilepicsameline")) body+="<br/>";
        }
        if (!state.headerMode.toLowerCase().includes("nameless")) body=defaultGenName(body);
        if (!state.headerMode.toLowerCase().includes("nobar"))    body+="<hr/>";
        if (state.data.basic!=undefined){

        }
    }
    return LeaveBlock(body);
}

// As not to need to pass everything into every function.
// I like me some global state
var state;
function gen(url, data){
    state={url, data};

	state.width          =( url.searchParams.get("width")      || 500 )*1;
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


    body = EndTable(body);

	console.log(template.replace("$WIDTH", state.width).replace("$HEIGHT", state.height).replace("$CONTENT", body))
}


module.exports = gen;
