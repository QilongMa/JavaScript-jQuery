/**
 * Created by John on 5/1/2017.
 */
var chk = 0;
$(document).ready(function () {
    chk = 1;
    var recordIndex = 0;
    jQuery.expr[':'].icontains = function (a, i, m) {
        return jQuery(a).text().toUpperCase()
                .indexOf(m[3].toUpperCase()) >= 0;
    };
    function getData() {
        var data = localStorage.getItem('myTable');
        return JSON.parse(data);
    }
    function setData(data) {
        localStorage.setItem('myTable', JSON.stringify(data));
    }
    /****On function for Submit***/
    $(document).on('click', '#mySubmitBtn', insertData);
    $(document).on('click', '#myPopulateBtn', populateData);
    $(document).on('click', '#view_', myHelperFn);
    $(document).on('click', '#edit_', myHelperFn);
    $(document).on('click', '#delete_', myDeleteFn);
    $(document).on('click', '#mySearchBtn', mySearchFn);
    function insertData() {
        var data = {};
        data.firstname = $('#FirstName').val();
        data.lastname = $('#LastName').val();
        data.email = $('#Email').val();
        /***Get Location***/
        data.location = [];
        // data.location.push($('#Location').val());
        var locas = $('#Location').children();
        for(var i = 0; i < locas.length; i++)
            data.location.push(locas[i].innerHTML);
        data.phone = $('#Phone').val();
        data.current_class = $('#Class').val();
        /***Get Address***/
        data.address = {};
        data.address.communication = $('#Address1').val();
        data.address.permanent = $('#Address2').val();
        /***Get Marks***/
        data.marks = {};
        data.marks.english = $('#Marks1').val();
        data.marks.science = $('#Marks2').val();
        data.marks.computer = $('#Marks3').val();
        data.marks.hardware = $('#Marks4').val();
        var myTable = getData();
        myTable.push(data);
        setData(myTable);
        showTable();
        clearForm();
    }

    $('#selectBtn').click(function () {
        var x = document.getElementById('mySelect');
        var y = x.options[x.selectedIndex].value;
        // $('table tr').show();
        // $('table tr:gt('+ y +')').hide();
        loadMore(y);
    })

    function clearForm() {
        $('#FirstName').val("");
        $('#LastName').val("");
        $('#Email').val("");
        $('#Location').children().detach();
        $('#Phone').val("");
        $('#Class').val("");
        $('#Address1').val("");
        $('#Address2').val("");
        $('#Marks1').val("");
        $('#Marks2').val("");
        $('#Marks3').val("");
        $('#Marks4').val("");
    }

    var viewClick = function () {
        $('button[id ^=view_]').each(function () {
            $(this).click(function (event) {
                myHelperFn(event);
            })
        })
        $('button[id ^=edit_]').each(function () {
            $(this).click(function (event) {
                myHelperFn(event);
            })
        })
    }

    function myHelperFn(event) {
        var data = $(event.target).parent().parent();
        var firstname = $(data.children()[0]).html();
        var lastname = $(data.children()[1]).html();
        var email = $(data.children()[2]).html();
        /***Get Location***/
        var location = $(data.children()[3]).html();
        var phone = $(data.children()[4]).html();
        var current_class = $(data.children()[5]).html();
        /***Get Address***/
        var addresses = $(data.children()[6]).html();
        var index1 = addresses.indexOf('permanent');
        var address1 = addresses.substring(15, index1-4);
        var address2 = addresses.substring(index1+11);
        /***Get Marks***/
        var allMarks = $(data.children()[7]);
        var mark1 = $(allMarks.children()[0]).html();
        var mark2 = $(allMarks.children()[1]).html();
        var mark3 = $(allMarks.children()[2]).html();
        var mark4 = $(allMarks.children()[3]).html();
        $('#ModalIndex').attr('index', email);
        $('#ModalFirstName').val(firstname);
        $('#ModalLastName').val(lastname);
        $('#ModalEmail').val(email);
        $('#ModalLocation').val(location);
        $('#ModalPhone').val(phone);
        $('#ModalClass').val(current_class);
        $('#ModalAddress1').val(address1);
        $('#ModalAddress2').val(address2);
        $('#ModalMarks1').val(mark1);
        $('#ModalMarks2').val(mark2);
        $('#ModalMarks3').val(mark3);
        $('#ModalMarks4').val(mark4);
        $('#myModal').modal('show');
    }

    function myDeleteFn() {
        var myKey = $(this).parent().parent().children()[2].innerText.trim();
        $(this).parent().parent().remove();
        var myTable = getData();
        for(var i = 0; i < myTable.length; i++){
            if(myTable[i].email.trim() == myKey){
                myTable.splice(i, 1);
                break;
            }
        }
        if(myTable.length > 0)
            localStorage.setItem('myTable', JSON.stringify(myTable));
        else
            localStorage.removeItem('myTable');
    }

    /**Search users match multiple inputs**
     * get user objects then match with the records
     * */
    function mySearchFn() {
        var obj = {};
        obj.firstname = $('#FirstName').val();
        obj.lastname = $('#LastName').val();
        obj.location = [];
        var locas = $('#Location').children();
        for(var i = 0; i < locas.length; i++){
            obj.location.push(locas[i].innerHTML);
        }
        obj.phone = $('#Phone').val();
        obj.current_class = $('#Class').val();
        var data = getData();
        var newData = [];
        for(var i = 0; i < data.length; i ++){
            if(matchDetail(data[i], obj)){
                newData.push(data[i]);
            }
        }
        showTable(newData);
    }

    function matchDetail(var1, var2) {
        if (var1.firstname.trim() != var2.firstname.trim()|| var1.lastname.trim() != var2.lastname.trim() || var1.phone.trim() != var2.phone.trim() || var1.current_class.trim() != var2.current_class.trim())
            return false;
        if (var1.location.length != var2.location.length)
            return false;
        var1.location = var1.location.sort();
        var2.location = var2.location.sort();
        return var1.location[0].trim() == var2.location[0].trim() ? true : var1.location[1].trim() == var2.location[1].trim() ? true : var1.location[2].trim() == var2.location[2].trim();
    }

    function resetWindow() {
        $('body').scrollTop(0);
        $(window).scrollTop(0);
    }

    if(typeof (Storage) != 'undefined'){
        var myTable = localStorage.getItem('myTable');
            resetWindow();
        if(myTable != null){
            loadMore();
            // showTable();
            //$('table tr:gt(10)').hide();
        }
        else {
            $.ajax({
                "method": "GET",
                "url": "./test.json",
                "data": { "name": "Bruce", "password": "admin" },
                "success": function (data) {
                    showTable(data);
                    setData(data);
                    $('table tr:gt(10)').hide();
                },
                "error": function () {
                    alert('Error here');
                }
            })
        }
    }

    $('#searchtxt').keyup(function () {
        var input = $(this).val();
        $('table tr:not(:contains("' + input + '"))').slice(1).hide();
        $('table tr:icontains("' + input + '")').show();
    })

    function showTable(data) {
        if(data == null)    var data = getData();
        var html = " <table class='table center'> ";
        html += ' <tr><th class="col-md-1">First Name</th><th class="col-md-1">Last Name</th><th class="col-md-1">Email</th><th class="col-md-2">Location</th><th class="col-md-1">Phone</th><th class="col-md-1">Class</th><th class="col-md-3">Address</th><th>Marks</th><th class="col-md-2">Manipulation</th> ';
        for (var num in data) {
            html += '<tr>';
            html += '<td>' + data[num].firstname + '</td>';
            html += '<td>' + data[num].lastname + '</td>';
            html += '<td>' + data[num].email + '</td>';
            html += '<td>';
            for(var locas in data[num].location){
                html += data[num].location[locas] + ',';
            }
            html = html.substring(0, html.length-1);
            html += '</td>';
            html += '<td>' + data[num].phone + '</td>';
            html += '<td>' + data[num].current_class + '</td>';
            html += '<td>';
            html += 'communication: ' + data[num].address.communication + '<br/>';
            html += 'permanent: ' + data[num].address.permanent;
            html += '</td>';
            html += '<td class="tdhide">';
            html +=  '<p>'+data[num].marks.english + '</p>, <p>' + data[num].marks.science + '</p>, <p>' + data[num].marks.computers + '</p>, <p>' + data[num].marks.hardware  + '</p><br/>';
            html += '</td>';
            html += '<td><button id="view_" > View </button><button id="edit_" >Edit</button><button id="delete_"> Delete </button> ';
            html += ' </tr>';
        }
        html += "</table>";
        $('#tableRecord').html(html);
        if(chk==1) {
            setTimeout(function() {
                $('body').scrollTop(0);
            }, 0);
            chk = 0;
        }

        $('#tableRecord th').eq(7).hide();
        $('.tdhide').hide();
        $('table tr').addClass('success');
    }

    $('#saveBtn').click(function () {
        var myTable = getData();
        var data = {};
        data.firstname = $('#ModalFirstName').val();
        data.lastname = $('#ModalLastName').val();
        data.email = $('#ModalEmail').val();
        /***Location Array***/
        data.location = [];
        var locas = $('#ModalLocation').val();
        for(var i = 0, j = 0 ; i < locas.length; i++){
            if(locas[i] == ',' || i == locas.length-1){
                i = (i == locas.length - 1) ? locas.length : i;
                data.location.push(locas.substring(j,i));
                j = i + 1;
            }
        }
        data.phone = $('#ModalPhone').val();
        data.current_class = $('#ModalClass').val();
        /***Address Obj***/
        data.address = {};
        data.address.communication = $('#ModalAddress1').val();
        data.address.permanent = $('#ModalAddress2').val();
        /***Marks Obj***/
        data.marks = {};
        data.marks.english = $('#ModalMarks1').val();
        data.marks.science = $('#ModalMarks2').val();
        data.marks.computers = $('#ModalMarks3').val();
        data.marks.hardware = $('#ModalMarks4').val();
        $.each(myTable, function (index) {
            if(myTable[index].email == data.email){
                myTable[index] = data;
                return false;
            }
        })
        setData(myTable);
        /***Instead of showTable, we can directly use #Firstname related Td to get this data, save a post back and cost***/
        showTable();
    })

    /***Populate Dumy Users***/
    function populateData() {
        var myTable = getData();
        var len = $('#num_user').val();
        for(var i = 0; i < len; i++){
            var user = {};
            user.firstname = appendixGen()+i;
            user.lastname = 'Random';
            user.email = appendixGen(4) + '@gmail.com';
            user.location = [];
            user.location.push('New York');
            user.phone = appendixGen();
            user.current_class = "8th";
            user.address = {};
            user.address.communication = "here";
            user.address.permanent = "there";
            user.marks = {};
            user.marks.english=85;
            user.marks.science=90;
            user.marks.computers=90;
            user.marks.hardware=95;
            myTable.push(user);
        }
        setData(myTable);
        loadMore();
        // showTable();
        // $('table tr:gt(10)').hide();
    }

    function appendixGen(applens) {
        var full = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var res = "";
        if(typeof(applens) === 'undefined') applens = 10;
        for(var i = 0; i < applens; i++){
            var idx = Math.floor((Math.random() * 60));
            res += full[idx];
        }
        return res;
    }

    /***Drag Drop***/
    document.getElementById('loc1').addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('id', event.target.id);
    });
    document.getElementById('loc2').addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('id', event.target.id);
    });
    document.getElementById('loc3').addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('id', event.target.id);
    });
    document.getElementById('Location').addEventListener('dragover', function(event){
        event.preventDefault();
    });
    document.getElementById('Location').addEventListener('drop', function (event) {
        event.preventDefault();
        var lid = event.dataTransfer.getData('id');
        var html = '<p id= '+lid + ' draggable="true"' + "ondrag='dragMove(event)'" +' >';
        html += document.getElementById(lid).innerHTML;
        html += ' </p>'
        // event.target.appendChild(document.getElementById(lid));
        event.target.innerHTML += html;
    })

    /***Window Scroll***/
    $(window).scroll(function () {
        //console.log('First: ',$(window).scrollTop() ,' Second: ' , $(document).height() - $(window).height());
        if($(window).scrollTop() >= $(document).height() - $(window).height() - 1){
            loadMore();
        }
    })
    function loadMore(row=10) {
        var currentRecord = $('table tr').length;
        currentRecord = (currentRecord <= 10 ? 0 : currentRecord);
        row = (row != 10 ? row : 10);
        var getTill = currentRecord + row;
        var data = getData();
        if(data.length > getTill){
            data = data.slice(0, getTill);
        }
        else if(showflag && currentRecord-1 == data.length){
            showflag = false;
            alert('No more data');
        }
        showTable(data);
    }
});
function dragMove(event) {
    var thisNode = event.target;
    thisNode.remove();
}
var showflag = true;