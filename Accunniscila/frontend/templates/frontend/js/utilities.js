
function getCSRFTokenValue(){
    return $('input[name="csrfmiddlewaretoken"]').val();
}

function APIrequest(url,{data={}, onsuccess= ()=>{}, onfailure=()=>{}, statusCode= {}, method="POST", dataType="json"}={}){

    return $.ajax({
        url: url,
        type: method,
        dataType: dataType,
        data: JSON.stringify(data),
        statusCode: statusCode,
        success : onsuccess,
        error : onfailure,
        headers: { 'X-CSRFToken': getCSRFTokenValue()}
    });
}
