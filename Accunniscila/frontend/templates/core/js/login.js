function main(){
    $(".login-form .btn-login").click(submitLogin);
}

function submitLogin(e){
    
    username = $(".login-form .username").val();
    password = $(".login-form .password").val();

    APIrequest(
        "/user/api/login",
        {
            data: {username: username, password:password},
            statusCode: {
                200: function(responseObject, textStatus, jqXHR) {
                    window.location.href = "http://217.61.121.77:8000";

                },
                400: function(responseObject, textStatus, errorThrown) {
                    console.log(responseObject);
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