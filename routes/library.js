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
        global.libraryState.books[calledBookNumber].onHands = false;
    }

    if(req.query.getBack)
    {
        global.libraryState.books[calledBookNumber].user = "";
        global.libraryState.books[calledBookNumber].deadline = "";
        global.libraryState.books[calledBookNumber].onHands = true;
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
    res.render('library', { title: 'Library', books: global.libraryState.books });
});

router.post('/', function(req, res) {
    if(req.body && req.body.title
        && req.body.releaseDate && req.body.author)
    {
        if(req.body.avatar)
        {
            base64Img.img(req.body.avatar, 'public/images', req.body.title, function (err, filepath)
            {
                console.log(filepath);
                global.libraryState.books.push(
                    {
                        title: req.body.title,
                        onHands: true,
                        releaseDate: req.body.releaseDate,
                        author: req.body.author,
                        imageURL: `/images/${path.basename(filepath)}`
                    });
            });
        }
        else
        {
            req.body.onHands = true;
            global.libraryState.books.push(req.body);
        }

        console.log(req.body);
        console.log(req.baseUrl);
        return res.redirect(req.baseUrl);
    }
    console.log(req.body)
    if(req.body.filter)
    {
        if(req.body.filter === 'show-all')
        {
            res.statusCode = 200;
            res.send(JSON.stringify(global.libraryState.books));
            return
        }
        else if(req.body.filter === 'show-onHands')
        {
            res.statusCode = 200;
            console.log(JSON.stringify(global.libraryState.books.filter(book => book.onHands == true)));
            res.send(JSON.stringify(global.libraryState.books.filter(book => book.onHands == true)));
            return
        }
        else if(req.body.filter === 'show-not-onHands')
        {
            res.statusCode = 200;
            res.send(JSON.stringify(global.libraryState.books.filter(book => book.onHands == false)))
            return
        }
    }

    res.statusCode = 200;
    res.render('library', { title: 'Library', books: global.libraryState.books });
});

module.exports = router;
