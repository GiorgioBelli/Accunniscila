
function main(){

    $(".page-header .auth_dropdown .login").click(handleLogout  );

}

function handleLogout(e){
    APIrequest(
        "/user/api/logout",
        {
            statusCode: {
                200: function(responseObject, textStatus, jqXHR) {
                    window.location.href = "/login/";
                },
                400: function(responseObject, textStatus, errorThrown) {
                    console.log(responseObject);
                }
            }
        }
    );
}


$(document).ready(main);