// The more basic method for generating svgs
const svgs = require("./svgs.js");

// Maybe add back classs?
const template = `<svg xmlns="http://www.w3.org/2000/svg" width="$WIDTH" height="$HEIGHT">
    <defs>
        <style></style>
    </defs>
    <style></style>
    <foreignObject x="0" y="0" width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" class="items-wrapper">

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


function defaultHeaderGen(body, data, url){

    return body;
}

// As not to need to pass everything into every function.
// I like me some global state
var state;
function gen(url, data){
    state={url, data};

	state.width          =( url.searchParams.get("width")      || 100 )*1;
	state.height         =( url.searchParams.get("height")     || 200 )*1;
	state.layoutMode     =  url.searchParams.get("layoutMode") || "single"
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
