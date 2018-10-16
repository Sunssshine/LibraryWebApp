
var el = document.getElementById('vanilla-demo');
var vanilla = new Croppie(el, {
    viewport: {width: 100, height: 150, type: "square"},
    boundary: {width: 200, height: 200},
    //showZoomer: true,
    customClass: 'w3-twothird',
    enableOrientation: false
});

vanilla.bind({
    url: "/images/book_cover_by_default.jpg"
});
//on button click
document.querySelector('.vanilla-kek').addEventListener('update', function(ev) {
    vanilla.result({
        type: 'base64',
        size: 'original'
    }).then(function (base64str)
    {
        document.getElementById('result_crop').value = base64str;
    });
});

var avatar_input = document.getElementById('avatar');

var loadFile = function(event)
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
avatar_input.setAttribute("onchange", "loadFile(event);")

function filterBookList(evt, value) {
    value = value.trim();
    var tablinks = document.getElementsByClassName("tablink");
    for (var i = 0; i < 3; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-border-red", "");
    }
    evt.currentTarget.firstElementChild.className += " w3-border-red";

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                if(xmlhttp.responseText)
                {
                    filtered_books = JSON.parse(xmlhttp.responseText);
                    bookshelf = document.getElementById('bookshelf');
                    bookshelf.removeChild(bookshelf.childNodes[0]);
                    book_div = document.createElement('div');
                    bookshelf.appendChild(book_div);
                    for (book of filtered_books)
                    {
                        var bookStatus = "В библиотеке";
                        if(!book.onHands)
                            bookStatus = "У пользователя";
                        book_div.insertAdjacentHTML('beforeend',
                        `<div class="w3-card-4" style="width: 300px; display: inline-block; margin-left: 20px; margin-bottom: 25px">
                            <div class="w3-container" style="margin-bottom: 10px; margin-top: 10px">
                                <span class="w3-input">${book.author}</span>
                                <label class="w3-tag w3-win8-mauve">Автор</label>
                            </div>
                            <div class="w3-container" style="margin-bottom: 10px">
                                <span class="w3-input">${book.releaseDate}</span>
                                <label class="w3-tag w3-win8-mauve">Дата выпуска</label>
                            </div>
                            <div class="w3-container" style="margin-bottom: 10px">
                                <span class="w3-input">${bookStatus}</span>
                                <label class="w3-tag w3-win8-mauve">Cтатус книги</label>
                            </div>
                            <div class="w3-bar w3-pink">
                                <span class="w3-bar-item"><h5>${book.title}</h5></span>
                                <a class="w3-bar-item w3-button w3-right" href="/library/books/${book.title}">
                                    <h5><i class="fa fa-caret-right"></i></h5>
                                </a>
                            </div>
                        </div>`
                        );
                    }
                }
            }
            else if (xmlhttp.status == 400) {
                alert('There was an error 400');
            }
            else {
                alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("POST", "/library/", true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify({
        filter: value
    }))
};
