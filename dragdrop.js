/**
 * Created by John on 4/25/2017.
 */

    var outdiv = document.getElementsByClassName('imgs')[0];
    var div = outdiv.getElementsByTagName('div');
    var myArray = [];
    for(var i = 0;i < div.length; i++){
        var detail = div[i].getElementsByTagName('img')[0];
        myArray.push(detail);
    }
    for (var i = 0; i < myArray.length; i++) {
        myArray[i].addEventListener('dragstart', function (event) {
            event.dataTransfer.setData('id', this.getAttribute('id'));
        });
    }
    document.getElementById('dropbox').addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    document.getElementById('dropbox').addEventListener('drop', function (event) {
        event.preventDefault();
        var img_id = event.dataTransfer.getData('id');
        var img_src = document.getElementById(img_id).getAttribute("src");
        var capId = img_id+'_img';
        var caption = document.getElementById(capId).innerHTML;
        var html = "<div ondrag='dragMove(event)'>";
        html += " <img src =" + img_src + " style = 'width:50px;' />";
        html += " <span> " + caption + " </span> ";
        html += "</div>"
        event.target.innerHTML += html;

    });

    function dragMove(event) {
        var thisNode = event.target;

        if(thisNode.tagName == "IMG"){
            thisNode = thisNode.parentNode;
        }
        thisNode.remove();

    }