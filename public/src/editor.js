// Prevent user from accidentally saving 
$("input").on("keydown", function(event){
    var x = event.which;
    if (x === 13) {
        event.preventDefault();
    }
});

// Enable navigation prompt
window.onbeforeunload = function() {
    return true;
};

// Remove navigation prompt for Save
$(".save").on("click", function(event){
    window.onbeforeunload = null;
});

// Hide annotation demo
let action = "Hide"
$(".demo-heading").on("click", function(event){
    if (action === "Hide"){
        $(".demo-body").hide();
        $("#eye-icon").attr("src","/images/eye.svg");
        action = "Show";
    } else if (action === "Show"){
        $(".demo-body").show();
        $("#eye-icon").attr("src","/images/eye-crossed.svg");
        action = "Hide";
    }
});