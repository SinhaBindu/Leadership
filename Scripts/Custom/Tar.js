$(document).ready(function () {
    $(function () {
        $('#StateType').change(function () {
            var v = $(this).val();
            if (v === "In State") {
                $("#VisitType").removeAttr('disabled');
                $('#VisitType').attr("required", "true");
                $('#VisitType').focus();
            }
            else {
                $("#VisitType").attr('disabled', 'disabled');
                $("#VisitType").val('');
                $('#VisitType').removeAttr('required')
            }
        })
    });

});

// Validate Tar Date
$("#dataTable").delegate(".datetimepic ", "focusin", function () {
    $(this).datetimepicker({
        dateFormat: "dd-M-yy",
        minDate: "+0D",
        controlType: 'select',
        oneLine: true,
        timeFormat: 'hh:mm TT',
        onSelect: function () {
            var dt = $(this).attr('id');
            var tardate = $(this).val();
            var _requestId = $('#RequestId').val();
            var _data = {
                'date': tardate,
                'RequestId': _requestId
            };
            //
            //Check  Valid date
            var tardateArray = [];
            var oldtarvalue = '';
            $('.tardate').each(function () {
                tardateArray.push($(this).val());
            });
            $.each(tardateArray, function (tag, text) {

                if (new Date(text) <= new Date(oldtarvalue)) {

                    $('#' + dt).focus();
                    $('#' + dt).val("");

                    alert("Tar Date should be greater than above date");
                }
                else {
                    oldtarvalue = text;
                }
            }); 
            //Check Exits Data
            $.ajax({
                type: 'POST',
                url: "/Tar/getTripValidate/", 
                dataType: "json",
                data: _data,
                cache: false,
                success: function (data) {
                    if (data.result === true) {
                        $('#' + dt).val("");
                        $('#' + dt).focus();
                        alert("Your Tar Date Already exists !");
                        return;
                    }
                }
            });
        }

    });
});