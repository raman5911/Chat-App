$(document).ready(function () {

    const socket = io();

    let name;

    do
    {
        name = prompt('Enter your name : ');

    } while(! name);

    socket.emit('user-connected', name);

    function showStatus(message, name)
    {
          var statusElement = `<p class="status">${name} ${message}</p>`
          $('.chat-container').append(statusElement);
    }

    socket.on('show-status', (message, name) => {
        showStatus(message, name);
    });

    function scrollDown() {
        $('.chat-container').scrollTop($('.chat-container').height());
    }

    function appendMessage(data, nameClass, userColor, messageClass) {

        //This will create a new div which will contain message typed by the user.

        var userName;
        
        if(nameClass == 'my-name')
            userName = `<p class = "my-name" style = "color: ${userColor}"> You </p>`

        else
            userName = `<p class = "user2-name" style = "color: ${userColor}"> ${data.user} </p>`

        var messageElement = `<div class = "${messageClass} animate__animated animate__bounceIn"> ${userName} <br> ${data.message} </div>`;

        $('.chat-container').append(messageElement);
    }

    // Send Messages

    function sendMessage()
    {
        var input = $('#message-content'); //Input Container

        let data = {
            user : name,
            message : input.val()
        };

        appendMessage(data, 'my-name', '#fff', 'message');

        input.val(''); //This will clear the content written in input field.
    
        scrollDown();
    
        socket.emit('message', data);
    }

    // Show typing

    function showTyping(name)
    {
        var element = `<div class = "user2-message typing"> ${name} is typing ... </div>`
        $('.chat-container').append(element);
    }

    function hideTyping()
    {
        $('.typing').remove();
    }

    socket.on('show-typing', (name) => {
        showTyping(name);
        scrollDown();
    });

    socket.on('hide-typing', () => {
        hideTyping();
    });

    var typing = false;
    var timeout = undefined;

    function timeoutFunction()
    {
        typing = false;
        socket.emit('stopped-typing');
    }

    function keyOtherThanEnter()
    {
        if(typing == false)
        {
            typing = true;
            socket.emit('typing');
            timeout = setTimeout(timeoutFunction, 1000);
        }

        else    //If user doesn't stopped typing then reset timeout
        {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 1000);
        }
    }

    //Function will be called when user will click on send button 
    $('#send').on('click', function () {
        var input = $('#message-content'); //Input Container

        if(input.val().trim().length > 0)
            sendMessage();
    });

    //Function will be called when user will press Enter Button
    $('#message-content').keyup(function (event) {

        var input = $('#message-content'); //Input Container

        if (event.key === 'Enter' && input.val().trim().length > 0)
        {
            timeoutFunction();
            sendMessage();
        }

        else
            keyOtherThanEnter();
    });

    // Receive Messages

    socket.on('message', (data, userColor) => {
        appendMessage(data, 'user2-name', userColor, 'user2-message');
        scrollDown();
    });

});
