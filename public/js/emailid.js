const emailid = document.getElementById("newEmail");
const passid = document.getElementById("password");
const otpid=document.getElementById("otp")
const errorprofile1 = document.getElementById("mailerror1");
const errorprofile2 = document.getElementById("mailerror2");
const errorprofile3 = document.getElementById("mailerror3");
const editform = document.getElementById("editform");

function emailvalidate(e) {
  const emailval = emailid.value;
  const emailpattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z.-]+).([a-zA-z]{2,4})$/;

  if (!emailpattern.test(emailval)) {
    errorprofile1.style.display = "block";
    errorprofile1.innerHTML = "Invalid email";
    errorprofile1.style.color = red;
  } else {
    errorprofile1.style.display = "none";
    errorprofile1.innerHTML = "";
  }
}
function otpValidate(e){
    const otpval=otpid.value
    if(otpval==""){
        errorprofile1.style.display = "block";
    errorprofile2.innerHTML = "enter otp";
    errorprofile2.style.color = red;

    }else{
        errorprofile2.style.display = "none";
    errorprofile2.innerHTML = "";

    }
}


function passvalidate(e) {
  const passval = passid.value;
  const alpha = /[a-zA-Z]/;
  const digit = /\d/;

  if (passval.length < 8) {
    errorprofile3.style.display = "block";
    errorprofile3.innerHTML = "Must have atleat 8 characters";
  } else if (!alpha.test(passval) || !digit.test(passval)) {
    errorprofile3.innerHTML = "Should contain Numbers and Alphabets!!";
    errorprofile3.style.display = "block";
  } else {
    errorprofile3.style.display = "none";
    errorprofile3.innerHTML = "";
  }
}


emailid.addEventListener("blur", emailvalidate);
passid.addEventListener("blur", passvalidate);
otpid.addEventListener("blur",otpValidate)


editform.addEventListener("submit", function (e) {
  console.log("Form submitted");

  emailvalidate();
 
  passvalidate();

  console.log("After validation");

  if (
    errorprofile1.innerHTML ||
    errorprofile2.innerHTML ||
    errorprofile3.innerHTML 
   
  ) {
    console.log("Validation failed");
    e.preventDefault();
  } else {
    console.log("Validation passed");
  }
});
