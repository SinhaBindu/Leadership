$(function () {
    $("#captcha-div a").attr('href', '');
    $("#captcha-div a").on('click', function (event) {
        event.preventDefault();
    });
    $("#CaptchaInputText").attr('placeholder', 'Enter captcha code').attr('maxlength', '10');

});
$(document).ready(function () {

    $(".treeview li.active-link").each(function (i, e) {
        $(this).parent('ul').addClass('in');
        $(this).parents('li.treeview').removeClass('active').addClass('active-sub');
    });
    $("#mainnav-menu li.active-link").removeClass('active').addClass('active-sub');
    
});

$(function () {
    $("#btnPrint").click("click", function () {
        var printdiv = document.getElementById('printdiv');
        var popupWin = window.open('null', '_blank', 'width=500,height=500');
        popupWin.document.open();
        popupWin.document.write('<html> ' +
            '<link href="~/Content/bootstrap-table.css" rel="stylesheet" />' +
            '<link href="~/Content/bootstrap.css" rel="stylesheet" />' +

            '<style>#header, #nav, .noprint{display: none;} #Header, #Footer { display: none !important; }' +
            '.lbl{font-weight:bold; background-color:#bdb7b7; border:1px solid; font-size:10px; }' +
            ' .lbl1 {font-weight: bold; background-color: darkgray; border: 1px solid; font-size: 12px;}' +
            '.htxt{font-weight:bold; font-size:12px; text-align:left;}' +
            '  table {padding: 0px; margin: 0px; cellpadding: 0; cellspacing: 0; font-size: 11px;}' +
            'body{margin:0;padding:0px;}' +
            '@page{size: auto; margin-top:0mm; margin-bottom:0mm}</style>' +
            '<body onload="window.print()" style="font-size:12px;"></br>' + printdiv.innerHTML + '</html>');
        popupWin.document.close();
    });
});
$(document).ajaxStart(function () {
    $("#panel-load").show();
});
$(document).ajaxStop(function () {
    $("#panel-load").hide();
});

$("form.loader").on('submit', function () {
    if ($(this).valid()) {
        $("#panel-load").show();
    }
});

$(function () {
    $(".req").append(" <em>*<em>");
    $("#ListDataTable").DataTable(); 
   
});

$(document).ready(function () { 

    $('.namevalid').on('keypress', function (e) {
        var regex = new RegExp("^[a-zA-Z ]*$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    });
    $('#CCEmail').on('change', function (e) {
        var regex = new RegExp("(([a-zA-Z\-0-9\.]+@)([a-zA-Z\-0-9\.]+)[,]*)+");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    });
    $(document).on('invalid-form.validate', 'form', function () {
        var button = $(this).find('input[type="submit"]');
        setTimeout(function () {
            button.removeAttr('disabled');
        }, 1);
    });
    $(document).on('submit', 'form', function () {
        //var button = $(this).find('input[type="submit"]');
        var button = $(this).find('#btnSubmit');

        setTimeout(function () {
            // button.attr('disabled', 'disabled');
            $(button, this).val("Working...").attr('disabled', 'disabled');
        }, 0);
    });
    $(".scroll-bottom").click(function (e) {
        e.preventDefault();
        $('html,body').animate({ scrollTop: document.body.scrollHeight }, "medium");
    })
});
$(function () {
    //Initialize Select2 Elements
    $(".select2").select2({
        placeholder: "Search to Select"
    });
});

$(document).ready(function () {
    $('#loginform').on('submit', function () {
        if ($(this).valid()) {
            aesauth($('#login-password'));
            return true;
        }
    });
    $("form").attr('autocomplete', 'off');
    $('#change-pwd-form').on('submit', function () {
        if ($(this).valid()) {
            aesauth($('#OldPassword'));
            aesauth($('#NewPassword'));
            $('#ConfirmPassword').val($('#NewPassword').val());
            return true;
        }
    });
    $(".datepicker,.hasDatepicker").attr('readonly', 'readonly');

    $('#resetform').on('submit', function () {
        if ($(this).valid()) {
            aesauth($('#Password'));
            $('#ConfirmPassword').val($('#Password').val());
            return true;
        }
    });
});

function aesauth(element) {
    var dnum = CryptoJS.lib.WordArray.random(128 / 16).toString();
    var dnum2 = CryptoJS.lib.WordArray.random(128 / 16).toString();
    var zen = CryptoJS.enc.Utf8.parse(dnum.toString());

    var password = element.val();
    var encryptedpassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(password), zen,
        {
            keySize: 128 / 8,
            iv: zen,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    element.val(dnum.toString() + encryptedpassword + dnum2.toString());

}
 
$(document).ready(function () { 
    $(document).on('focus', '.datetimepic', function () {

        $(this).datetimepicker({
            dateFormat: "dd-M-yy",
            minDate: "+0D",
            controlType: 'select',
            oneLine: true,
            timeFormat: 'hh:mm TT'
        });
    });
  

    $(".datepicker").datepicker({
        dateFormat: 'dd-M-yy',
        changeMonth: true,
        changeYear: true,
        maxDate: new Date()
    });
    $(".futuredatepicker").datepicker({
        dateFormat: 'dd-M-yy',
        changeMonth: true,
        changeYear: true,
        minDate: new Date()
    });

    var tommorow = new Date();
    tommorow.setDate(tommorow.getDate() + 1); // add a day

    $(".tommorow_datepicker").datepicker({
        dateFormat: 'dd-M-yy',
        changeMonth: true,
        changeYear: true,
        minDate: tommorow
    });
    $("input[type='text']").each(function () {
        $(this).attr("autocomplete", "off");
    });


    $("div").on('input', '.input_capital', function (evt) {

        // Remember original caret position
        var caretPosition = getCaretPosition(this);

        // Uppercase-ize contents
        this.value = this.value.toLocaleUpperCase();

        // Reset caret position
        // (we ignore selection length, as typing deselects anyway)
        setCaretPosition(this, caretPosition);
    });

});


function getCaretPosition(ctrl) {
    var CaretPos = 0;    // IE Support
    if (document.selection) {
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
    }
    // Firefox support
    else if (ctrl.selectionStart || ctrl.selectionStart === '0') {
        CaretPos = ctrl.selectionStart;
    }

    return CaretPos;
}

function setCaretPosition(ctrl, pos) {
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    }
    else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function isDecimal(evt, value) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode === 46) {
        if (value.indexOf('.') > -1) {
            return false;
        }
        else {
            return true;
        }
    }
    else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}


// Table Row Data
//1. Add new row
function AddNewRow(tblid) {

    var $tableBody = $('#' + tblid);
  
    if ($tableBody.find('tr').length > 30)
    {
        return false; 
    }
    //var $trFirst = $("#first-sub-row");
    var $trLast = $tableBody.find("tr:last");
    var $trNew = $trLast.clone();



    var suffix = $trNew.find(':input:first').attr('name').match(/\d+/);


    $trNew.find("td:first").html((parseInt(suffix) + 2));
    $trNew.find("td:last").html('<p class="add-sub btn btn-success btn-sm"  onclick="AddNewRow(\'' + tblid + '\')" >+</p>&nbsp;<p class="remove-sub btn btn-danger btn-sm" id="' + tblid + '_' + (parseInt(suffix) + 1) + '" onclick="RemoveRow(this.id,\'' + tblid + '\')" >-</p>');
    $.each($trNew.find(':input'), function (i, val) {
        // Replaced Name

        var $this = $(this);
        var oldN = $(this).attr('name');
        var newN = oldN.replace('[' + suffix + ']', '[' + (parseInt(suffix) + 1) + ']');

        try {
            var oldID = $(this).attr('id');
            var newID = oldID.replace('_' + suffix + '_', '_' + (parseInt(suffix) + 1) + '_');
        }
        catch (err) { console.error(err); }

        $(this).attr('name', newN);
        $(this).attr('id', newID);

        $(this).val('');
        $(this).removeClass('hasDatepicker');

        $(this).css('background-color', '#fff');

    });
    $.each($trNew.find('.zero_id'), function () {

        $(this).val(0);
    });

    $.each($trNew.find('.remove'), function () {

        $(this).html('');
    });

    $.each($trNew.find('span'), function () {
        try {
            var $this = $(this);
            var oldN = $(this).attr('data-valmsg-for');
            var newN = oldN.replace('[' + suffix + ']', '[' + (parseInt(suffix) + 1) + ']');
            $(this).attr('data-valmsg-for', newN);
        }
        catch (err) {
            console.err(err);
        }
    });
     

    $trLast.after($trNew); 
    //Re-assign Validation
    var form = $("form")
        .removeData("validator")
        .removeData("unobtrusiveValidation");
    $.validator.unobtrusive.parse(form);

    // BindDate();

}

//2. Remove row
function RemoveRow(id, tblid) {

    $("#" + id).closest('tr').remove();

    var count = 1;
    var $tableBody = $('#' + tblid);

    $.each($tableBody.find("tbody tr"), function (i) {

        var $tr = $(this);

        $tr.find("td:first").html((i + 1));

        $.each($tr.find(':input'), function () {

            // Replaced Name
            var suffix = $(this).attr('name').match(/\d+/);
            var oldN = $(this).attr('name');
            var newN = oldN.replace('[' + suffix + ']', '[' + (i) + ']');

            $(this).attr('name', newN);

        });

        $.each($tr.find('p.remove-sub'), function () {
            $(this).attr('id', tblid + '_' + i);

        });


        $.each($tr.find('span'), function () {

            try {
                var suffix = $(this).attr('data-valmsg-for').match(/\d+/);
                var oldN = $(this).attr('data-valmsg-for');
                var newN = oldN.replace('[' + suffix + ']', '[' + (i) + ']');
                $(this).attr('data-valmsg-for', newN);
            }
            catch (err) { consol.error(err); }

        });
    })
}