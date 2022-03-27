// Expanding annotations
$(".annotation-link").on("click", function() {
    console.log($(this).prop("id"));
    let identifier = $(this).prop("id");
    $(this).toggleClass("engaged-link");
    $("#annotation" + identifier).toggleClass("active");
})

// Assigning annotation colors
const annotationColors = ["green", "blue", "purple", "red", "gold", "green-lt", "brown"];
let color = "";
let colorPicker = 0;
function pickColor(){
    if (colorPicker < annotationColors.length) {
        color = annotationColors[colorPicker];
    } else {
        colorPicker = 0;
        color = annotationColors[colorPicker];
    }   
};

$(".annotation-link").each(function(){
    let identifier = $(this).prop("id");
    pickColor();
    $(this).addClass(color);
    $("#annotation" + identifier).addClass(color);
    colorPicker++
})

// Scroll to top
$(document).ready(function() {
    $(window).scroll(function() {
        if ($(document).scrollTop() > 50) {
            $("#toTop").css("display", "flex");
        } else {
            $("#toTop").css("display", "none");
        }
    });
});

$("#toTop").on("click", function(){
    $("html, body").animate({ scrollTop: "0" });
});

// Signature date
let d = new Date();
let sigDate = d.getDate() + " . " + (d.getMonth() + 1) + " . " + d.getFullYear();
$(".signature-date").val(sigDate);