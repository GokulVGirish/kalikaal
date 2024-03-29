const emailid = document.getElementById("typeEmailX")
const passid = document.getElementById("typePasswordX");
const error1 = document.getElementById("error1passlogin");
const regform = document.getElementById("logform");
function emailvalidate(e) {
  const emailval = emailid.value;
  const emailpattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z.-]+).([a-zA-z]{2,4})$/;

  if (!emailpattern.test(emailval)) {
    error2.style.display = "block";
    error2.innerHTML = "Invalid email";
    error2.style.color = red;
  } else {
    error2.style.display = "none";
    error2.innerHTML = "";
  }
}
function passvalidate(e) {
  const passval = passid.value;
  const alpha = /[a-zA-Z]/;
  const digit = /\d/;

  if (passval.length < 8) {
    error1.style.display = "block";
    error1.innerHTML = "Must have atleat 8 characters";
  } else if (!alpha.test(passval) || !digit.test(passval)) {
    error1.innerHTML = "Should contain Numbers and Alphabets!!";
    error1.style.display = "block";
  } else {
    error1.style.display = "none";
    error1.innerHTML = "";
  }
}
emailid.addEventListener("blur", emailvalidate);
passid.addEventListener("blur",passvalidate)
regform.addEventListener("submit", function (e) {
  console.log("Form submitted");

  emailvalidate();
 
  passvalidate();

  console.log("After validation");

  if (
    error1.innerHTML||
    error2.innerHTML 
  ) {
    console.log("Validation failed");
    e.preventDefault();
  } else {
    console.log("Validation passed");
  }
});
