var socket = io.connect(document.location.origin);

function appendToChat(data, from) {
    var img = user ? '<img class="chat_profile_pic" src="' + user.photo + '"/>' : '';
    var html = '<p class="chat_msg">' + img + (from === 'me' ? 'me:&nbsp;' : data.sender + ':&nbsp;') + data.msg + '</p>';
    $('#chat_window').append(html);
    document.getElementById('chat_window').scrollByLines(3);
};

socket.emit('availableChats',{});
var systemMessageHandlers={
    'info':function(data){
        $('#info').append(data);
    },
    'destroy':function(msg){
        document.write(msg);
    }
};
socket.on('sm',function(data){
   if(data&&data.t&&systemMessageHandlers[data.t]){
       systemMessageHandlers[data.t](data.m);
   }
});


socket.on('usersInRoom', function (users) {
    $('#usersInRoom').html('');
    for (var i in users) {
        $('#usersInRoom').append('<img src="' + users[i].profile_pic + '" alt="' + users[i].name + '"/>')
    }

});
socket.on('chatMessage', function (data) {
    appendToChat(data);
});
socket.on('whatever',function(data){
    console.log(arguments);
});
socket.on('userInfo', function (userInfo) {
    user = userInfo;
});
$('#chat_send').live('click', function () {
    var msg = escape($('#chat_message').val());
    if (msg.length > 0) {
        var data = {'msg':msg};
        socket.emit('chatMessage', data);
        appendToChat(data, 'me');
        $('#chat_message').val('');
    }
});
setTimeout(function(){
    $.ajax({
        type: 'GET',
        url: '/survey',
        success: function(){
            console.log(arguments)
        }

    });

},1000);


