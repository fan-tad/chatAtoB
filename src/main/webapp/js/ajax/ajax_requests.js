$(document).ready(function () {
    var loadAllMessages = function () {
        var path = window.location.search;
        var args = new Array();
        args = path.replace("?", "").split("&");
        var salon = args[0].split("=")[1];
        var user = args[1].split("=")[1];
        var request = $.ajax({
            method: "GET",
            url: "/back-office/messages/" + salon + "/" + user + "/all",
            dataType: "json",
        });

        request.done(function (msg) {
            _NumberOfMessages = 0;
            printMessages(msg);
        });
        request.fail(function (jqXHR, textStatus) {
            Materialize.toast("Impossible de récupérer les messages", 4000);
        });
    };

    $("input[name=\"usermessage\"]").keypress(function (e) {
        if (e.which == 13) {
            $("#send-message").click();
        }
    });

    $("#user-connecte").click(function () {
        var path = window.location.search;
        var args = new Array();
        args = path.replace("?", "").split("&");
        var salon = args[0].split("=")[1];
        var user = args[1].split("=")[1];
        window.location = '/ajax/ajax_user_connecte.html?salon=' + salon + '&user=' + user;
    });

    $("#modify-last-modal-submit").click(function () {
        var path = window.location.search;
        var args = new Array();
        args = path.replace("?", "").split("&");
        var salon = args[0].split("=")[1];
        var user = args[1].split("=")[1];
        var newMessage = $("#modify-last-input").val();
        if (user.trim() === '' || salon.trim() === '' || newMessage.trim() === '') {
            return;
        }
        var request = $.ajax({
            method: "PUT",
            url: "/back-office/messages/" + salon + "/" + user + "/modify",
            dataType: 'json',
            contentType: 'json',
            data: {
                message: newMessage,
            }
        });
        request.done(function (msg) {
            leanModalAction("#modify-last-modal", "close", true);
            Materialize.toast("Message modifié avec succès", 4000);
        });
        request.fail(function (jqXHR, textStatus) {
            leanModalAction("#modify-last-modal", "close", true);
            Materialize.toast("Echec de la modification du Message (PUT)", 4000);
            console.log(jqXHR.responseText);
        });
    });

    $("#add-pseudo-modal-submit").click(function () {
        var path = window.location.search;
        var args = new Array();
        args = path.replace("?", "").split("&");
        var salon = args[0].split("=")[1];
        var user = args[1].split("=")[1];
        var newUsername = $("#add-pseudo-input").val();
        if (user.trim() === '' || salon.trim() === '' || newUsername.trim() === '') {
            return;
        }
        var request = $.ajax({
            method: "POST",
            url: "/back-office/users/add/" + salon + "/" + user,
            dataType: 'json',
            data: {
                user: newUsername,
            }
        });
        request.done(function (msg) {
            leanModalAction("#add-pseudo-modal", "close", true);
            Materialize.toast("Utilisateur ajouté avec succès", 4000);
        });
        request.fail(function (jqXHR, textStatus) {
            leanModalAction("#add-pseudo-modal", "close", true);
            Materialize.toast("Impossible d'ajouter l'utilisateur", 4000);
            console.log(jqXHR.responseText);
        });
    });


    $("#delete-last").click(function () {
        var path = window.location.search;
        var args = new Array();
        args = path.replace("?", "").split("&");
        var salon = args[0].split("=")[1];
        var user = args[1].split("=")[1];
        if (user.trim() === '' || salon.trim() === '') {
            return;
        }
        var request = $.ajax({
            method: "DELETE",
            url: "/back-office/messages/" + salon + "/" + user + "/delete",
        });
        request.done(function (msg) {
            window.location.href = window.location.href;
            leanModalAction("#modify-last-modal", "close", true);
            Materialize.toast("Dernier Message supprimé avec succès", 4000);
        });
        request.fail(function (jqXHR, textStatus) {
            leanModalAction("#modify-last-modal", "close", true);
            Materialize.toast("Echec de la suppression du Message (DELETE)", 4000);
            console.log(jqXHR.responseText);
        });
    });

    $("#send-message").click(function () {
        var path = window.location.search;
        var args = new Array();
        args = path.replace("?", "").split("&");
        var salon = args[0].split("=")[1];
        var user = args[1].split("=")[1];
        var message = $("input[name=\"usermessage\"]").val();
        $("input[name=\"usermessage\"]").val("");
        if (user.trim() === '' || salon.trim() === '' || message.trim() === '') {
            return;
        }
        var request = $.ajax({
            method: "POST",
            url: "/back-office/messages/" + salon + "/" + user + "/add",
            dataType: "json",
            data: {
                user: user,
                salon: salon,
                usermessage: message
            }
        });
        request.done(function (msg) {
            addMessage(msg);
        });
        request.fail(function (jqXHR, textStatus) {
            Materialize.toast("Echec de l'envoi du message", 4000);
            console.log(jqXHR.responseText);
        });
    });

    var printMessages = function (message) {
        var allMessages = "";
        var lastNumber = 0;
        if ($("#message-wrapper div:last").length) {
            lastNumber = $("#message-wrapper div:last").attr("id");
            lastNumber = parseInt(lastNumber);
            lastNumber += 1;
        }
        var currentUser = message.user;
        var messagesList = message.messagesList;
        for (var i = 0; i < messagesList.length; i++) {
            var messageObject = messagesList[i];
            _NumberOfMessages += 1;
            var className = "";
            if (messageObject.user != currentUser)
                className = "other-user";
            allMessages += " <div id=\"" + _NumberOfMessages + " \" class=\"received-message " + className + " z-depth-1\">\n" +
                "      <span>" + messageObject.user + "</span>\n" +
                "      <p>" + messageObject.message + "</p>\n" +
                "    </div>"
        }

        if ($(".messages-wrapper").length) {
            $("#message-wrapper").append(allMessages);
            $(".messages-wrapper").scrollTop($(".messages-wrapper")[0].scrollHeight);
        }
    };



    var addMessage = function (message) {
        var currentUser = message.user;
        var messageNumber = message.messagesList.length - 1;
        var lastMessage = message.messagesList[messageNumber];
        var messageToAppend = $(" <div id=\"" + (messageNumber + 1) + " \" class=\"received-message z-depth-1\">\n" +
            "      <span>" + lastMessage.user + "</span>\n" +
            "      <p>" + lastMessage.message + "</p>\n" +
            "    </div>");

        if ($(".messages-wrapper").length) {
            $("#message-wrapper").append(messageToAppend);
            _NumberOfMessages += 1;
            $(".messages-wrapper").scrollTop($(".messages-wrapper")[0].scrollHeight);
        }
    };

    var getLastMessages = function () {
        var path = window.location.search;
        var args = new Array();
        args = path.replace("?", "").split("&");
        var salon = args[0].split("=")[1];
        var user = args[1].split("=")[1];
        // var lastNumber = $("#message-wrapper div:last").attr("id");

        var requestNumberOfMessages = $.ajax({
            method: "GET",
            url: "/back-office/messages/" + salon + "/" + user + "/message-number",
            dataType: "json",
        });

        requestNumberOfMessages.done(function (msg) {
            if ((msg.number > _NumberOfMessages)) {
                var request = $.ajax({
                    method: "GET",
                    url: "/back-office/messages/" + salon + "/" + user + "/get-from-" + (_NumberOfMessages + 1),
                    dataType: "json",
                });

                request.done(function (msg2) {
                    printMessages(msg2);
                });
                request.fail(function (jqXHR, textStatus) {
                    Materialize.toast("Impossible de récupérer les derniers messages", 4000);
                });
            }
            else {
                return;
            }
        });

        requestNumberOfMessages.fail(function (jqXHR, textStatus) {
            Materialize.toast("Impossible de récupérer le nombre de messages", 4000);
        });
    };

    $(document).keyup(function (e) {
        if (e.keyCode == 27) { //Si on appuie sur escape
            leanModalAction(".modal", "close", true);
        }
    });

    var modalHandler = function (idModal) {
        $("#open-" + idModal).on("click", function () {
            leanModalAction("#" + idModal + "-modal", "open", true);
        });

        $("#" + idModal + "-close").click(function () {
            leanModalAction("#" + idModal + "-modal", "close", true);
        });
    };

    modalHandler("modify-last");
    modalHandler("add-pseudo");

    loadAllMessages();
    setInterval(getLastMessages, 5000);
});