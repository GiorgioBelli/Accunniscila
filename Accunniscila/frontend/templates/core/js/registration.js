var blocked = true;

function main() {
    let btn_register = $(".btn-register");

    btn_register.click((e)=>console.log("click"));

    // $(".registration-form .username").focusout((e)=>{
    //     console.log("username out");
    //     validationFeedback($(e.target).val(),validateUsername);
    // });

    //format validation
    $(".registration-form .password").focusout((e)=>{
        console.log("password out");
        validationFeedback($(e.target),$(e.target).val(),validatePassword);
    });

    $(".registration-form .email").focusout((e)=>{
        console.log("email out");
        validationFeedback($(e.target),$(e.target).val(),validateEmail);
  
    });

    $(".registration-form .first_name").focusout((e)=>{
        console.log("first_name out");
        validationFeedback($(e.target),$(e.target).val(),validateNoSpace);

    });

    $(".registration-form .last_name").focusout((e)=>{
        console.log("last_name out");
        validationFeedback($(e.target),$(e.target).val(),validateNoSpace);

    });

    //confirm password validation
    $(".registration-form .password_confirm").focusout((e)=>{
        let p1 = $(e.target).val();
        let p2 = $(".registration-form .password").val();
        validationFeedback($(e.target),$(e.target).val(),()=> p1==p2 ));
    });

}

function submitRegistration(e) {

    username = $(".registration-form .username").val();
    first_name = $(".registration-form .first_name").val();
    last_name = $(".registration-form .last_name").val();
    email = $(".registration-form .email").val();
    password = $(".registration-form .password").val();

    APIrequest(
        "/user/api/registration",
        {
            data: { username: username, password: password },
            statusCode: {
                200: function (responseObject, textStatus, jqXHR) {
                    window.location.href = "http://217.61.121.77:8000";
                },
                400: function (responseObject, textStatus, errorThrown) {
                    console.log(responseObject);
                }
            }
        }
    );

}

// function validateUsername(username){
//     return true;
//     let reg = RegExp("^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$");
//     return reg.test(username);
// } 

function validatePassword(password){
    return true;
    let reg = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$");
    return reg.test(password);
} 

function validateConfirmPassword(pw1,pwd2){
    return pw1 == pw1;
} 


function validateEmail(email){
    let reg = RegExp("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");
    return reg.test(email);
}

function validateNoSpace(string){
    let reg = RegExp("^[^ ]*{2,50}");
    return reg.test(email);
}

function validationFeedback(target,value,validationFunction){
    let is_valid = validationFunction(value);
    if(is_valid) {
        target.addClass("correct");
        target.removeClass("incorrect");
    }else{
        target.addClass("correct");
        target.removeClass("incorrect");
    }
}

$(document).ready(main);