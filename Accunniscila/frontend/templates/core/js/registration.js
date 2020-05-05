function main() {
    let btn_register = $(".btn-register");

    btn_register.click(submitRegistration);

    //format validation
    $(".registration-form .password").focusout((e)=>{
        console.log("password out");
        validationFeedback($(e.target),$(e.target).val(),validatePassword);
    });

    $(".registration-form .email").focusout((e)=>{
        validationFeedback($(e.target),$(e.target).val(),validateEmail);
    });

    $(".registration-form .first_name").focusout((e)=>{
        validationFeedback($(e.target),$(e.target).val(),validateNoSpace);
    });

    $(".registration-form .last_name").focusout((e)=>{
        validationFeedback($(e.target),$(e.target).val(),validateNoSpace);
    });

    $(".registration-form .phone_number").focusout((e)=>{
        validationFeedback($(e.target),$(e.target).val(),validateNumber);
    });

    //confirm password validation
    $(".registration-form .password_confirm").focusout((e)=>{
        var p1 = $(e.target).val();
        var p2 = $(".registration-form .password").val();
        validationFeedback($(e.target),null,()=> validateConfirmPassword(p1,p2) );
    });

}

function submitRegistration(e) {
    $(e.target).prop("disabled");
    
    if($(".registration-form .correct").length != 6 || $(".registration-form .incorrect").length!=0){
        alert("fields error");
        return;
    }

    first_name = $(".registration-form .first_name").val();
    last_name = $(".registration-form .last_name").val();
    email = $(".registration-form .email").val();
    password = $(".registration-form .password").val();
    phone_number = $(".registration-form .phone_number").val();

    APIrequest(
        "/user/api/register",
        {
            data: { first_name: first_name, last_name: last_name, email: email, password: password, phone_number: phone_number },
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


function validatePassword(password){
    let reg = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$");
    return reg.test(password);
} 

function validateConfirmPassword(pw1,pw2){
    return pw1 == pw2 && validatePassword(pw1);
} 


function validateEmail(email){
    let reg = RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    return reg.test(email);
}

function validateNumber(number){
    let reg = RegExp("^[0-9]{10}$");
    return reg.test(number);
}

function validateNoSpace(string){
    let reg = RegExp("^[^ ]{2,50}$");
    return reg.test(string);
}

function validationFeedback(target,value,validationFunction){
    let is_valid = validationFunction(value);
    if(is_valid) {
        target.addClass("correct");
        target.removeClass("incorrect");
    }else{
        target.addClass("incorrect");
        target.removeClass("correct");
    }
}

$(document).ready(main);