document.addEventListener('DOMContentLoaded', function(){
    var el = document.getElementById('vanilla-demo');
    var vanilla = new Croppie(el, {
        viewport: {width: 100, height: 150, type: "square"},
        boundary: {width: 200, height: 200},
        //showZoomer: true,
        customClass: 'w3-twothird',
        enableOrientation: false
    });

    vanilla.bind({
        url: "/images/200x200.png"
    });
    //on button click
    document.querySelector('.vanilla-kek').addEventListener('update', function(ev) {
        vanilla.result({
            type: 'base64',
            size: 'original'
        }).then(function (base64str)
        {
            document.getElementById('avatar-preview').src = base64str;
            document.getElementById('result_crop').value = base64str;

        });
    });

    var avatar_input = document.getElementById('avatar')
    avatar_input.setAttribute("onchange", "loadFile(event);")

    var loadFile = function (event)
    {
        var reader = new FileReader();
        reader.onload = function ()
        {
            avatar_input.val = reader.result;
            vanilla.bind({
                url: reader.result
            });
        };
        reader.readAsDataURL(event.target.files[0]);
    };

}, false);

function filterBookList(event) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                //document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
            }
            else if (xmlhttp.status == 400) {
                alert('There was an error 400');
            }
            else {
                alert('something else other than 200 was returned');
            }
        }
    };
    alert(event.value);
    xmlhttp.open("POST", "/library/", true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify({
        filter: event.value
    }));
}
