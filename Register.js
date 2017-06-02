/**
 * Created by John on 4/25/2017.
 */
(function () {
    $(document).ready(function () {
        refreshTable();
    })

    // var details = document.getElementsByClassName("errMessage");
    var details = $('.errMessage');
    var result = [];
    var myArray = [];
    var nameRex = /^[A-Za-z]+$/;
    var locationRex = /^[A-Za-z0-9.# ]+$/;
    var emailRex = /^[A-Za-z0-9.]+$/;
    var removeTable = function () {
        $('#showTable tr').slice(1).remove();
    }
    var removeRecord = function () {
        if (typeof (Storage) !== "undefined") {
            localStorage.removeItem('myArray');
            location.reload();
        }
        $('#rmain').css({"visibility":"hidden"});
        removeTable();

    }

    var refreshTable = function () {
        if (typeof (Storage) !== "undefined") {
            var table = $('#showTable');
            var tbody = $('#showBody');
            removeTable();
            localStorage.removeItem("");
            if (localStorage.length > 0) {
                $('#rmain').css({"visibility":"visible"});
            }
            else {
                document.getElementById('rmain').style.visibility = "hidden";
                return;
            }
            var values = jQuery.parseJSON(localStorage.getItem("myArray"));

            /***Improvement: just use values[0].username ...***/
            $.each(values, function (index1, value) {
                var eachRecord = values[index1];
                var myValues = Object.keys(eachRecord).map(function (key) { return eachRecord[key]; });
                var markup = "<tr>";
                $.each(myValues, function (index2, value2) {
                    markup += "<td>"+ value2 +"</td>";
                })
                markup += "</tr>";
                tbody.append(markup);
            })
        }
    };

    $('#registerbtn').on('click', validateInput);
    $('#removebtn').on('click', removeRecord);
    $('#name_txt').on('change', validateUser);
    $('#pwd1_txt').on('change', validatePwd);
    $('#pwd2_txt').on('change', validatePwd);
    $('#fname_txt').on('change', validateFname);
    $('#lname_txt').on('change', validateLname);
    $('#email_txt').on('change', validateEmail);

    function validateInput() {
        validateUser();
        validatePwd();
        validateFname();
        validateLname();
        validateEmail();
        checkGender();
        validateLocation();
        checkThenSave();
    }

    function validateUser() {
        var username = $('#name_txt').val();
        details.eq(0).empty();
        result[0] = true;
        /**Improve, just use values[i].username**/
        if (typeof (Storage) !== "undefined") {
            var values = jQuery.parseJSON(localStorage.getItem("myArray"));
            $.each(values, function (index, value) {
                $.each(value, function (x,y) {
                    if(username == y){
                        details.eq(0).text("User already existed!");
                        details.eq(0).css({"visibility":"visible"});
                        result[0] = false;
                        return false;
                    }
                })
            })
        }
        if (username.length <= 3) {
            details.eq(0).text("You must enter a valid user name, at least 4 characters");
            details.eq(0).css({"visibility":"visible"});
            result[0] = false;
            return;
        }

    }

    function validatePwd() {
        details[2].style.visibility = "hidden";
        var pwd1 = $('#pwd1_txt').val();
        var pwd2 = $('#pwd2_txt').val();

        if (pwd1 == '' || pwd2 == '') {
            details.eq(2).html("Plaese enter your password.");
            details.eq(2).css({"visibility":"visible"});
            result[1] = result[2] = false;
            return;
        }
        if(pwd1 !== pwd2) {
            details.eq(2).text("Your passwords are not the same");
            details.eq(2).css({"visibility":"visible"});
            result[1] = result[2] = false;
            return;
        }
        details.eq(2).empty();
        result[1] = result[2] = true;
    }

    function validateFname() {
        var firstName = $('#fname_txt').val();
        if (firstName.length <= 1) {
            details.eq(3).html("Please enter your first name");
            details.eq(3).css({"visibility":"visible"});
            result[3] = false;
            return;
        }
        else if (!nameRex.test(firstName)) {
            details.eq(3).html("Your first name cannot cantain special characters or numbers.");
            details.eq(3).css({"visibility":"visible"});
            result[3] = false;
            return;
        }
        else {
            $('#fname_txt').val( $('#fname_txt').val().charAt(0).toUpperCase() +  $('#fname_txt').val().slice(1).toLowerCase());
            details.eq(3).css({"visibility":"hidden"});
            details.eq(3).empty();
            result[3] = true;
        }
    }
    function validateLname() {
        // var lastName = document.getElementById('lname_txt').value;
        var lastName = $('#lname_txt').val();
        if (lastName.length <= 1) {
            details.eq(4).html("Please enter your last name.");
            details.eq(4).css({"visibility":"visible"});
            result[4] = false;
            return;
        }

        else if (!nameRex.test(lastName)) {
            details.eq(4).html("Your last name cannot cantain special characters or numbers.");
            details.eq(4).css({"visibility":"visible"});
            result[4] = false;
            return;
        }
        else {
            $('#lname_txt').val( $('#lname_txt').val().charAt(0).toUpperCase() +  $('#lname_txt').val().slice(1).toLowerCase());
            details.eq(4).css({"visibility":"hidden"});
            details.eq(4).empty();
            result[4] = true;
        }
    }
    function validateEmail() {
        // Implement
        var email = $('#email_txt').val();
        if (email.includes('@')) {
            var part1 = email.substring(0, email.indexOf('@'));
            var part2 = email.substring(email.indexOf('@') + 1);
            if (part1.length >= 2 && part2.length >= 4 && part2.includes('.') && emailRex.test(part1) && emailRex.test(part2)) {
                details[5].style.visibility = "hidden";
                details[5].innerHTML = "";
                result[5] = true;
                return;
            }
        }
        details.eq(5).html("Your email address is invalid.");
        details.eq(5).css({"visibility":"visible"});
        result[5] = false;
    }
    function checkGender() {
        details.eq(6).css({"visibility":"hidden"});
        details.eq(6).empty();
        result[6] = true;
        if (!document.getElementById('mgender').checked && !document.getElementById('fgender').checked) {
            details.eq(6).html("Your need to select your gender");
            details.eq(6).css({"visibility":"visible"});
            result[6] = false;
            return;
        }
    }
    function validateLocation() {
        var location = $('#location_txt').val();
        details.eq(7).css({"visibility":"hidden"});
        details.eq(7).empty();
        result[7] = true;
        if (location.length < 2 || !locationRex.test(location)) {
            details[7].innerHTML = "You have to enter a valid address";
            details[7].style.visibility = "visible";
            result[7] = false;
        }
    }
    function checkThenSave() {
        for (var i = 0; i < result.length; i++) {
            if (result[i] == false)
                return;
        }
        var user = {
            username:$('#name_txt').val(),
            password: $('#pwd1_txt').val(),
            firstName: $('#fname_txt').val(),
            lastName: $('#lname_txt').val(),
            email: $('#email_txt').val(),
            gender: $('input[name=Gender]:checked').val(),
            location: $('#location_txt').val()
        };
        var jsonVal = JSON.parse(localStorage.getItem("myArray"));
        if (jsonVal != null)
            myArray = jsonVal;
        myArray.push(user);
        localStorage.setItem("myArray", JSON.stringify(myArray));
        refreshTable();
    }

})();

