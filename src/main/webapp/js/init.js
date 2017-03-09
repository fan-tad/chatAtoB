(function ($) {
    $(function () {
        $(document).ready(function () {
            $('.modal').leanModal();
        });

        leanModalAction = function (idModal, action, addOverlay) {
            if (action === "close") {
                $(idModal).closeModal();
                if (addOverlay)
                    $("#popup-overlay").removeClass("opened-popup");
            }

            else if (action === "open") {
                $(idModal).openModal();
                if (addOverlay)
                    $("#popup-overlay").addClass("opened-popup");
            }
        };
    });
})(jQuery);