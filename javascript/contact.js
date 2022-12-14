$(function () {

    // init the validator
    // validator files are included in the download package
    // otherwise download from http://1000hz.github.io/bootstrap-validator

    $('#contact-form').validator();

    var upper = Math.floor(Math.random() * 4)+1;
    var lower = Math.floor(Math.random() * 4)+1;

    if(upper < lower) {
      var tmp = lower;
      lower = upper;
      upper = tmp;
    }

    var operators = ["-", "+", "*"];
    var o = operators[Math.floor(Math.random()*operators.length)];

    $("#lower-number-label").html(upper);
    $("#upper-number-label").html(lower);
    $("#operator").html(o);

    $("#lower-number-val").val(upper);
    $("#upper-number-val").val(lower);
    $("#operator-val").val(o);

    // when the form is submitted
    $('#contact-form').on('submit', function (e) {

        //console.log($(this).serialize());
        // if the validator does not prevent form submit
        if (!e.isDefaultPrevented()) {
            var url = "php/contact.php";

            console.log($(this).serialize());
            // POST values in the background the the script URL
            $.ajax({
                type: "POST",
                url: url,
                data: $(this).serialize(),
                success: function (data)
                {
                    // data = JSON object that contact.php returns

                    console.log(data);
                    // we recieve the type of the message: success x danger and apply it to the
                    var messageAlert = 'alert-' + data.type;
                    var messageText = data.message;

                    // let's compose Bootstrap alert box HTML
                    var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';

                    // If we have messageAlert and messageText
                    if (messageAlert && messageText) {
                        // inject the alert to .messages div in our form
                        $('#contact-form').find('.messages').html(alertBox);
                        // empty the form
                        $('#contact-form')[0].reset();
                    }
                }
            });
            return false;
        }
    })
});
