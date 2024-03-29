const emailid = document.getElementById("email");
const mobileid = document.getElementById("typeMobileX");
const passid = document.getElementById("typePasswordX");
const passidConf = document.getElementById("typePasswordXC");
const nameid = document.getElementById("typeNamex");
const referal = document.getElementById("referalX");
const error1 = document.getElementById("error1");
const error2 = document.getElementById("error2");
const error3 = document.getElementById("error3");
const error4 = document.getElementById("error4");
const error5 = document.getElementById("error5");
const error6 = document.getElementById("error6");
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
function referalValidate() {
  const inputValue = referal.value.trim()
  

  if (inputValue === "") {
   error6.style.display = "none";
   error6.innerHTML = "";
  } else if (!/^[A-Z]+$/.test(inputValue)||inputValue.length!=8) {
    error6.style.display = "block";
    error6.innerHTML = "Invalid referalCode";
    error6.style.color = red;
  } else {
       error6.style.display = "none";
       error6.innerHTML = "";
  }
}

function mobvalidate() {
  
  const mobval = mobileid.value;
  const startsWithGreater = /^[7-9]/;
  const notAllSameDigits = /^(?!(\d)\1{9})/;
  const digit = /^\+?\d{8,15}$/;
  if (mobval.trim() === "") {
    error3.style.display = "block";
    error3.innerHTML = "Please Enter a valid Mobile Number.";
  } else if (mobval.length !== 10) {
    error3.style.display = "block";
    error3.innerHTML = "Please Enter atleast 10 digits.";
  } else if (!digit.test(mobval)) {
    error3.style.display = "block";
    error3.innerHTML = "Please Enter digits only.";
  } else if (!startsWithGreater.test(mobval)) {
    error3.style.display = "block";
    error3.innerHTML = "Mobile number must start with a digit greater than 6.";
  } else if (!notAllSameDigits.test(mobval)) {
    error3.style.display = "block";
    error3.innerHTML =
      "Mobile number cannot consist of the same digit repeated 10 times.";
  } else {
    error3.style.display = "none";
    error3.innerHTML = "";
  }
}
function validatePasswords() {


  if (passid.value !== passidConf.value) {
     error5.style.display = "block";
     error5.innerHTML = "New and confirm password dosent match";
  } else {
    error5.style.display = "none";
    error5.innerHTML = "";
  }
}

function passvalidate(e) {
  const passval = passid.value;
  const alpha = /[a-zA-Z]/;
  const digit = /\d/;

  if (passval.length < 8) {
    error4.style.display = "block";
    error4.innerHTML = "Must have atleat 8 characters";
  } else if (!alpha.test(passval) || !digit.test(passval)) {
    error4.innerHTML = "Should contain Numbers and Alphabets!!";
    error4.style.display = "block";
  } else {
    error4.style.display = "none";
    error4.innerHTML = "";
  }
}

function namevalidate() {
  const nameval = nameid.value;
  const validChars = /^[a-zA-Z\s]+$/;

  if (!nameval.match(validChars)) {
    error1.style.display = "block";
    error1.innerHTML = "Please enter a valid name without numbers or symbols.";
  } else if (nameval.trim() === "") {
    error1.style.display = "block";
    error1.innerHTML = "Please enter a valid name.";
  } else {
    error1.style.display = "none";
    error1.innerHTML = "";
  }
}

nameid.addEventListener("blur",namevalidate)
emailid.addEventListener("blur", emailvalidate);
passid.addEventListener("blur", passvalidate);
mobileid.addEventListener("blur", mobvalidate);
passidConf.addEventListener("blur", validatePasswords);
referal.addEventListener("blur",referalValidate)

regform.addEventListener("submit", function (e) {
  console.log("Form submitted");

  emailvalidate();
  mobvalidate();
  passvalidate();
  namevalidate()
  validatePasswords();
  referalValidate()

  console.log("After validation");

  if (
    error1.innerHTML ||
    error2.innerHTML ||
    error3.innerHTML ||
    error4.innerHTML||
    error5.innerHTML||
    error6.innerHTML
  ) {
    console.log("Validation failed");
    e.preventDefault();
  } else {
    console.log("Validation passed");
  }
});
