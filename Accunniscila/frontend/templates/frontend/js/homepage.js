function main(){
    handleContent();    
}

function handleContent(){
    $(".content-item:odd").each(function( index ) {
        $( this ).children(".content-img").addClass( "order-sm-1" );
    });
    return 0;
}

$(document).ready(main);