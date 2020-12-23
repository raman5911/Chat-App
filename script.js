$(document).ready(function () {

    //Function to scroll down when any new mwssage is sent or received.
    
    function scrollDown() {
        $('.chat-container').scrollTop($('.chat-container').height());
    }

    function sendMessage() {
        var input = $('#message-content'); //Input Container

        //This will create a new div which will contain message typed by the user.

        var yourName = `<p class = "my-name"> You </p>`

        var messageElement = `<div class = "message animate__animated animate__bounceIn"> ${yourName} <br> ${input.val()} </div>`;

        $('.chat-container').append(messageElement);

        input.val(''); //This will clear the content written in input field.
    }

    //Function will be called when user will click on send button 
    $('#send').on('click', function () {

        sendMessage();
        scrollDown();

    });

    //Function will be called when user will press Enter Button
    $('#message-content').keypress(function (event) {

        if (event.keyCode == 13) {
            sendMessage();
            scrollDown();
        }

    });

});