function updateUp() {
    document.onkeypress = function(evt) {
        evt = evt || window.event;
        var charCode = evt.keyCode || evt.which;
        var charStr = String.fromCharCode(charCode);
        alert(charStr);
    };
}
function updateDown() {
    $(document).keypress(function(event){
        return String.fromCharCode(event.which);

    });
}
function updateLeft() {
    $(document).keypress(function(event){
        return String.fromCharCode(event.which);
    });
}
function updateRight() {
    $(document).keypress(function(event){
        return String.fromCharCode(event.which);
    });
}