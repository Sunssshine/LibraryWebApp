var express = require('express');
var router = express.Router();
var base64Img = require('base64-img');
var path = require('path');

router.put('/books/:bookTitle', function(req, res) {


});
router.get('/books/:bookTitle', function(req, res)
{
    var calledBookNumber = -1;
    var reqBookTitle = req.params.bookTitle;
    for(var i = 0; i< global.libraryState.books.length; i++)
    {
        if (global.libraryState.books[i].title === reqBookTitle)
        {
            calledBookNumber = i
        }
    }

    if(calledBookNumber === -1)
    {
        res.status(404);
        res.send("Book not found");
        return;
    }

    if(req.query.usertake && req.query.deadline)
    {
        global.libraryState.books[calledBookNumber].user = req.query.usertake;
        global.libraryState.books[calledBookNumber].deadline = req.query.deadline;
        global.libraryState.books[calledBookNumber].onHands = "False";
    }

    if(req.query.getBack)
    {
        global.libraryState.books[calledBookNumber].user = "";              // TODO сделать нормальными поля ввода дат
        global.libraryState.books[calledBookNumber].deadline = "";
        global.libraryState.books[calledBookNumber].onHands = "True";
    }

    if(req.query.title && req.query.author && req.query.releaseData)
    {
        global.libraryState.books[calledBookNumber].title = req.query.title;
        global.libraryState.books[calledBookNumber].author = req.query.author;
        global.libraryState.books[calledBookNumber].releaseDate = req.query.releaseData;
    }

    if(req.query.deleteBook)
    {
        global.libraryState.books.splice(calledBookNumber, 1); // TODO разобраться с PUT и DELETE запросами
        res.redirect('/library/');
        return
    }

    console.log(global.libraryState.books[calledBookNumber]);
    res.status(200);
    //res.statusCode = 200;
    res.render('bookpage', {book: global.libraryState.books[calledBookNumber]});

});
/* GET users listing. */
router.get('/', function(req, res) {
    res.render('library', { title: 'Library', books: global.libraryState.books }); //TODO AJAX запрос на добавление и удаление книги
});

router.post('/', function(req, res) {
    if(req.body && req.body.title && req.body.onHands && req.body.releaseDate && req.body.avatar)
    {
        base64Img.img(req.body.avatar, 'public/images', req.body.title, function(err, filepath) { console.log(filepath)
            global.libraryState.books.push(
                {
                    title: req.body.title,
                    onHands: req.body.onHands,
                    releaseDate: req.body.releaseDate,
                    imageURL: `/images/${path.basename(filepath)}`
                });
            console.log(global.books);
        });
    }
    console.log(req.body);
    res.statusCode = 200;
    res.render('library', { title: 'Library', books: global.libraryState.books }); //TODO Запрос на открытие странички книги
});                         //TODO Поле взявшего книгу юзера и возврат книги

module.exports = router;
