function main(){
    $(".login-form .btn-login").click(submitLogin);
}

function submitLogin(e){

    let target = $(e.target);
    target.prop("disabled");
    
    email = $(".login-form .email").val();
    password = $(".login-form .password").val();
    remember_me = $(".login-form .form-check input.remember_me").prop("checked");

    APIrequest(
        "/user/api/login",
        {
            data: {email: email, password:password, remember_me: remember_me},
            statusCode: {
                200: function(responseObject, textStatus, jqXHR) {
                    window.location.href = target.attr("data-page-target");

                },
                400: function(responseObject, textStatus, errorThrown) {
                    $("label[for=error_message]").text("*"+responseObject.responseJSON.result_msg);
                }           
            }
        }
    );

}

function submitLogout(e){
    APIrequest("/user/api/logout");

}

function check(e){
    APIrequest("/user/api/check");

}

$(document).ready(main);