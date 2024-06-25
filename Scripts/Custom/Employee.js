$(document).ready(function () {

    //if (supervisorid !== "") {
    //  //  $('#SupervisorName').val(supervisorid).select2();   
    //    getSupervisor();
    //}
    $('#SupervisorName').change(function () {       
        getSupervisor();
    });
    function getSupervisor() {
        $("#SupervisorId").val("");
        $("#SupervisorEmail").val("");
        $.getJSON(document.baseURI+'Base/GetSuperwiserDetails/?id=' + $('#SupervisorName').val(), function (data) {
            $.each(data, function (i, block) {
                $("#SupervisorEmail").val(block.Text);
                $("#SupervisorId").val(block.Value);
            });
        });
    }

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#singImage').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#SingImageDoc").change(function () {
        readURL(this);
    });
     
    $("#add-desg-frm").on('submit', function (event) {
        event.preventDefault();
        var error = $("#modal-error-msg");
        if ($("#NewDesignation").val() == '') {
            error.text('Designation name is required');
        }

        $.ajax({
            type: "POST",
            url: document.baseURI + "Employee/AddDesignation",
            data: { 'Designation': $("#NewDesignation").val() },
            success: function (result) {
                if (result.success) {

                    var id = result.id;
                    $("#NewDesignation").val('');
                    $('#AddDesgModal').modal('toggle');
                    RefreshDesignaiton();
                    $("#DesignationId").val(id);
                    $("#DesignationId").select2();
                }
                else {
                    error.text(result.msg);
                }
            }
        });

    });

    $("#NewDesignation").on('input', function () {

        var error = $("#modal-error-msg");
        if ($(this).val() != '') {
            error.text('');
        }
        else {
            error.text('Designation name is required!');
        }
    })
    
});
function RefreshDesignaiton() {

    $('#DesignationId').empty();
    $('#DesignationId').append($("<option>").val('').text('Select'));

    $.ajax({
        type: "GET",
        url: document.baseURI + "Employee/GetDesignationList",
        data: '',
        PententType: "application/json; charset=utf-8",
        global: false,
        async: false,
        dataType: "json",
        success: function (data) {
            $.each(data, function (i, exp) {
                $('#DesignationId').append($("<option>").val(exp.Value).text(exp.Text));
            })
        }
    });

    $('#DesignationId').select2();
}