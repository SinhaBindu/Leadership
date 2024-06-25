var msg = "";
$.validator.addMethod(
    'validatefiletype',
    function (value, element, params) {

        msg = "";
        var response;
        var formdata = new FormData();
        var file = element.files[0];
        formdata.append("Doc", file)
        formdata.append("FileType", params.filetype)

        $.ajax({
            url: "/Validation/ValidateUploadedFileType",
            type: 'POST',
            data: formdata,
            processData: false,
            contentType: false,
            async:false,
            success: function (data) {

                response = data == true ? true : false;
                msg = data != true ? data : "";
            }
        });

        return response;
    },
    function () {
        return msg;
    }
);
$.validator.addMethod(
    'validatefilesize',
    function (value, element, params) {

        msg = "";
        var response = true;
        var file = element.files[0];

        var size = "";
        if ((params.maxkb / 1024) >= 1) {
            var mb = params.maxkb / 1024;
            size = (params.maxkb / 1024).toFixed(1) + " MB";
        }
        else {
            size = params.maxkb + " KB";
        }

        if (file != null && file.size > 0) {
            if (file.size > (params.maxkb * 1024)) {
                response = false;
                msg = "File size must not be greater than " + size;
            }
        }
        return response;
    },
    function () {
        return msg;
    }
);
$.validator.addMethod(
    'validatefilemultipleext',
    function (value, element) {

        msg = "";
        var response = true;

        var array = value.split('.');
        if (array.length > 2) {

            response = false;
            msg = "File can't have multiple extensions";
        }
        return response;
    },
    function () {
        return msg;
    }
);

$(function () {

    $(".upload-pdf").on('change', function () {

        $(this).rules("add", {

            validatefilemultipleext: true,
            validatefilesize: {
                maxkb: 2048
            },
            validatefiletype: {
                filetype: 'PDF'
            }

        });
        if ($(this).valid() === false) {
            $(this).val('');
        }
    });

    $(".upload-img").on('change', function () {

        $(this).rules("add", {

            validatefilemultipleext: true,
            validatefilesize: {
                maxkb: 2048
            },
            validatefiletype: {
                filetype: 'Image'
            }
        });

        if ($(this).valid() === false) {
            $(this).val('');
        }
    });

});