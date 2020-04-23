function main(){
    hideHeader();
}

function hideHeader(){
    $(".page-header").remove();
    return 0;
}

$(document).ready(main);