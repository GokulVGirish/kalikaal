console.log("ondeeee")
const securityForm = document.getElementById("accountSecurityForm");
const accountpass1=document.getElementById("accounSecurityPassword")
const accountpass2 = document.getElementById("accounSecurityNewPassword");
const accountpass3 = document.getElementById("accounSecurityCPassword");
const securityErrro1=document.getElementById("securityError1")
const securityErrro2=document.getElementById("securityError2")
const securityErrro3 = document.getElementById("securityError3");
console.log(accountpass1)
console.log(accountpass2)
console.log(accountpass3)
function passvalidateSecurity1(e) {
  const passval = accountpass1.value;
  const alpha = /[a-zA-Z]/;
  const digit = /\d/;

  if (passval.length < 8) {
    securityErrro1.style.display = "block";
   securityErrro1.innerHTML = "Must have atleat 8 characters";
  } else if (!alpha.test(passval) || !digit.test(passval)) {
   securityErrro1.innerHTML = "Should contain Numbers and Alphabets!!";
   securityErrro1.style.display = "block";
  } else {
   securityErrro1.style.display = "none";
   securityErrro1.innerHTML = "";
  }
}
function passvalidateSecurity2(e) {
  const passval = accountpass2.value;
  const alpha = /[a-zA-Z]/;
  const digit = /\d/;

  if (passval.length < 8) {
    securityErrro2.style.display = "block";
    securityErrro2.innerHTML = "Must have atleat 8 characters";
  } else if (!alpha.test(passval) || !digit.test(passval)) {
    securityErrro2.innerHTML = "Should contain Numbers and Alphabets!!";
   securityErrro2.style.display = "block";
  } else {
   securityErrro2.style.display = "none";
   securityErrro2.innerHTML = "";
  }
}
function passvalidateSecurity3(e) {
  const passval = accountpass3.value;
  const alpha = /[a-zA-Z]/;
  const digit = /\d/;

  if (passval.length < 8) {
    securityErrro3.style.display = "block";
    securityErrro3.innerHTML = "Must have atleat 8 characters";
  } else if (!alpha.test(passval) || !digit.test(passval)) {
   securityErrro3.innerHTML = "Should contain Numbers and Alphabets!!";
  securityErrro3.style.display = "block";
  } else {
   securityErrro3.style.display = "none";
    securityErrro3.innerHTML = "";
  }
}
accountpass1.addEventListener("blur",passvalidateSecurity1)
accountpass2.addEventListener("blur",passvalidateSecurity2)
accountpass3.addEventListener("blur",passvalidateSecurity3)


securityForm.addEventListener("submit",(e)=>{
     console.log("Form submitted");

     passvalidateSecurity1();
     passvalidateSecurity2();
     passvalidateSecurity3();

     console.log("After validation");

     if (
       securityErrro3.innerHTML ||
       securityErrro2.innerHTML ||
       securityErrro1.innerHTML
     ) {
       console.log("Validation failed");
       e.preventDefault();
     } else {
       console.log("Validation passed");
     }

})
