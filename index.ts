const canvas = document.getElementById('canvas');
function checkSupported() {
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        // Canvas is supported
    } else {
        // Canvas is not supported
        alert("We're sorry, but your browser does not support the canvas tag. Please use any web browser other than Internet Explorer.");
    }
}

ctx.fillStyle = "rgb(200,0,0)";