
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

class AlertRenderer{
    static render(code, body, type){
        var div = $("<div class='result_alert'></div>");

        var alert;
        switch (code) {
            case 200:
                alert = $(`<div class="alert alert-success myAlert" role="alert"></div>`);
                break;
            case 400:
                alert = $(`<div class="alert alert-danger myAlert" role="alert"></div>`);
                break;
            default:
                return;
        }

        var closeButton = $(`<a id="MyAlert-close" href="#" class="close"></a>`);
        closeButton.append("&times;");
    
        var head = $(`<h2 class="alert-heading"></h2>`);
        
        var body = $(`<p></p>`).append(body);
        
        var foot = $(`<p class="mb-0"></p>`);
        switch (type+"-"+code) {
            case "order-200":
                foot.append(`Accedi a "I Miei Ordini" per monitorare lo stato del tuo ordine.`);
                head.append( $(`<strong></strong>`).append("Ordine Registrato") );
                break;
            case "order-400":
                foot.append(`Qualcosa deve essere andato storto !.`);
                head.append( $(`<strong></strong>`).append("Ordine Non Registrato") );
                break;
            default:
                break;
        }

        alert.append(closeButton);
        alert.append(head);
        alert.append(body);
        alert.append(foot);

        div.append(alert);
        $("footer").before(div)

        $("#MyAlert-close").click(function(){
            $(".myAlert").fadeOut( "slow", function() {
                $(this).remove();
              });
        });
    }
}