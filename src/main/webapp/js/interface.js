(function ($) {
    $(function () {
        $("#message-form").on("click", "button", function (e) {
            e.preventDefault();
            var message = $('#message-form .input-field input').val();
            if (message.trim() != '') {
                if ($("#message-form").length) {
                    $("#message-form").submit();
                    setTimeout(function () {
                        $("#message-form")[0].reset();
                    }, 0);
                }
            }
        });
    });
})(jQuery);