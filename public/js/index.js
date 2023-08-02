const checkbox = document.getElementById("toggle")
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  $(".previousPost,.NextPost").toggleClass("darkTitle")
  $(".card").toggleClass("darkBox");
  $(".posts a").toggleClass("dark");
  $(".brandTitle a").toggleClass("darkTitle")
  $(".btn").toggleClass("darkButton");
  $(".addOrEdit").toggleClass("darkLink");
  $(".form-group input , .form-group textarea").toggleClass("darkInput");
});
// post postLinks
const previousTitle = $('.PreviousPostTitle').html()
if(previousTitle == 'NotPresent'){$('.previousPost').css("visibility","hidden")}
const nextTitle = $('.nextPostTitle').html()
if(nextTitle == 'NotPresent'){$('.NextPost').css("visibility","hidden")}
//password show hide
$('.showIcon').on("click",function(){
  if($("#password").attr('type')=="password"){
    $('.showIcon').addClass("fa-eye-slash");
    $('.showIcon').removeClass("fa-eye");
    $("#password").attr('type','text');
  }else{
    $('.showIcon').removeClass("fa-eye-slash");
    $('.showIcon').addClass("fa-eye");
    $("#password").attr('type','password');
  }
})

// title input
function check(){
  var numbers = /[0-9]/g;
  const titleinput =$('#postTitle').val();
  const post = $('#Content').val()
  const password = $('#password').val();
  // title input
  if(titleinput){
    $('.icon1').removeClass("fa-circle-xmark")
    $('.icon1').addClass("fa-circle-check")
    $('.icon1').addClass("valid")
  }else{
    $('.icon1').addClass("fa-circle-xmark")
    $('.icon1').removeClass("fa-circle-check")
    $('.icon1').removeClass("valid")
  }
  //post minlength
  if(post.length>=50){
    $('.icon2').removeClass("fa-circle-xmark")
    $('.icon2').addClass("fa-circle-check")
    $('.icon2').addClass("valid")
  }else{
    $('.icon2').addClass("fa-circle-xmark")
    $('.icon2').removeClass("fa-circle-check")
    $('.icon2').removeClass("valid")
  }
  //password length
  if(password.length>=8){
    $('.icon3').removeClass("fa-circle-xmark")
    $('.icon3').addClass("fa-circle-check")
    $('.icon3').addClass("valid")
  }else{
    $('.icon3').addClass("fa-circle-xmark")
    $('.icon3').removeClass("fa-circle-check")
    $('.icon3').removeClass("valid")
  }
}
