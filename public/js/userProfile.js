const namedom = document.getElementById("userInfoName");
const mobiledom = document.getElementById("userInfoPhone");
const passdom = document.getElementById("userInfoPass");
const form=document.getElementById("userInfoForm")
const error1 = document.getElementById("userInfoError1");
const error2 = document.getElementById("userInfoError2");
const error3 = document.getElementById("userInfoError3");
console.log(namedom.value)


function mobvalidateProfile() {
  const mobval = mobiledom.value;
  const startsWithGreater = /^[7-9]/;
  const notAllSameDigits = /^(?!(\d)\1{9})/;
  const digit = /^\+?\d{8,15}$/;
  if (mobval.trim() === "") {
    error2.style.display = "block";
    error2.innerHTML = "Please Enter a valid Mobile Number.";
  } else if (mobval.length !== 10) {
    error2.style.display = "block";
    error2.innerHTML = "Please Enter atleast 10 digits.";
  } else if (!digit.test(mobval)) {
    error2.style.display = "block";
    error2.innerHTML = "Please Enter digits only.";
  } else if (!startsWithGreater.test(mobval)) {
    error2.style.display = "block";
    error2.innerHTML = "Mobile number must start with a digit greater than 6.";
  } else if (!notAllSameDigits.test(mobval)) {
    error2.style.display = "block";
    error2.innerHTML =
      "Mobile number cannot consist of the same digit repeated 10 times.";
  } else {
    error2.style.display = "none";
    error2.innerHTML = "";
  }
}
function passvalidateProfile(e) {
  const passval = passdom.value;
  const alpha = /[a-zA-Z]/;
  const digit = /\d/;

  if (passval.length < 8) {
    error3.style.display = "block";
    error3.innerHTML = "Must have atleat 8 characters";
  } else if (!alpha.test(passval) || !digit.test(passval)) {
    error3.innerHTML = "Should contain Numbers and Alphabets!!";
    error3.style.display = "block";
  } else {
    error3.style.display = "none";
    error3.innerHTML = "";
  }
}
function namevalidateProfile() {
  const nameval = namedom.value;
  const regex = /^[a-zA-Z\s]*$/; // Regular expression to match only letters and spaces

  if (nameval.trim() === "" ) {
    error1.style.display = "block";
    error1.innerHTML =
      "Enter name";
  }else if( !regex.test(nameval)){
    error1.style.display = "block";
    error1.innerHTML =
      "Please Enter a valid Name (only letters and spaces are allowed).";
  } else {
    error1.style.display = "none";
    error1.innerHTML = "";
  }
}

namedom.addEventListener("blur", namevalidateProfile);
passdom.addEventListener("blur", passvalidateProfile);
mobiledom.addEventListener("blur", mobvalidateProfile);
form.addEventListener("submit", function (e) {
  console.log("Form submitted");

 mobvalidateProfile()
 namevalidateProfile()
 passvalidateProfile()

  console.log("After validation");

  if (
    error1.innerHTML ||
    error2.innerHTML ||
    error3.innerHTML 
   
  ) {
    console.log("Validation failed");
    e.preventDefault();
  } else {
    console.log("Validation passed");
  }
});
