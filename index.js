const express = require('express'); 
const fs = require('fs') ; 
// const { parse } = require("csv-parse");
let csvToJson = require('convert-csv-to-json');
// const { url } = require('inspector');
// const axios = require("axios");
// const { throws } = require('assert');


const app = express(); 
// use json data 
app.use(express.json());
// app.use(express.urlencoded()); 
app.use(express.urlencoded({ extended: true }))

// const errorHandler = (error, request, response, next) => {
//   // Error handling middleware functionality
//   // console.log( `error ${error.message}`) // log the error
//   const status = error.status || 400
//   // send back an easily understandable error message to the caller
//   // response.status(status).send(error.message)
//   response.status(status).write("<p>Unable to Process your request</p>") ; 
// }

const PORT = process.env.PORT || 8080;
const URL = "http://10.103.34.94:8080/"

// app.use((err, req, res, next) => {
//   // console.error(err.stack)
//   res.status(500).send('Something broke!'); 

// })

// app.use(methodOverride())
// app.use((err, req, res, next) => {
//   // res.status(); 
//   // res.render('error', { error: err }) ;   
//   res.write('<h1>Unable to process your request</h1>'); 
//   res.end();
// }) ; 



app.use(express.static("public")); //* used to serve html files from public folder

const row = html => `<tr>\n${html}</tr>\n`,
      heading = object => row(Object.keys(object).reduce((html, heading) => (html + `<th>${heading}</th>`), '')),
      datarow = object => row(Object.values(object).reduce((html, value) => (html + `<td>${value}</td>`), ''));
                               
function htmlTable(dataList) {
  return `<table>
            ${heading(dataList[0])}
            ${dataList.reduce((html, object) => (html + datarow(object)), '')}
          </table>`
}

//List All Books 
app.get("/books",(req,res)=>{

//     fs.createReadStream("./data/books.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2 }))
//   .on("data", function (row) {
//     console.log(row);
//   })
//   .on("end", function () {
//     console.log("finished");
//   })
//   .on("error", function (error) {
//     console.log(error.message);
//   });

let json_obj = csvToJson.fieldDelimiter(';').getJsonFromCsv("./data/books.csv");
res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.write(htmlTable(json_obj));
  res.end();

// console.log(json_obj);

    
});

// List Magazines 

app.get("/magazines",(req,res)=>{

    let json_obj = csvToJson.fieldDelimiter(';').getJsonFromCsv("./data/magazines.csv");
    res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(htmlTable(json_obj));
      res.end();
    
    // console.log(json_obj);
    
        
    });

// Display book with ISBN     

app.get('/books/isbn', function(req, res){
      
      // throw new Error('BROKEN') 
        // res.send('id: ' + req.query.isbn);
        let json_obj = csvToJson.fieldDelimiter(';').getJsonFromCsv("./data/books.csv");
        // get the results 

        var results = [];
        var searchField = "isbn";
        var searchVal = req.query.isbn;

//  console.log(`the search val is ${searchVal}`)
        for (var i=0 ; i < json_obj.length ; i++)
        {
            if (json_obj[i][searchField] == searchVal) {
                results.push(json_obj[i]);
            }
        }

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(`<h4>Displaying Book with ISBN : ${searchVal}</h4>`); 
        try { 
            // res.write("<h2>Printing Magazines</h2>");     
            // res.write(`<p><strong>Magazines of Author</strong></p>`)   ; 
        res.write(htmlTable(results)) ;       
          //  res.write("<h2>Priniting Books </h2>")       
        }catch(error)
        {
             res.write(`<h5>OOPS!.. No Book With ISBN : <i>${searchVal}</i> is found</h5>`);
        }
        res.end();
  });

// search a magazine by isbn 
app.get('/magazines/isbn', function(req, res){
      
        // res.send('id: ' + req.query.isbn);
        let json_obj = csvToJson.fieldDelimiter(';').getJsonFromCsv("./data/magazines.csv");
        // get the results 

        var results = [];
var searchField = "isbn";
var searchVal = req.query.isbn;
// console.log(`the search val is ${searchVal}`)
for (var i=0 ; i < json_obj.length ; i++)
{
    if (json_obj[i][searchField] == searchVal) {
        results.push(json_obj[i]);
    }
}

// if (typeof results !== 'undefined' && results.length > 0) 

  // the array is defined and has at least one element
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.write(`<h4>Displaying Magazine with ISBN : ${searchVal}</h4>`); 
       try { 
        // res.write("<h2>Printing Magazines</h2>");     
        // res.write(`<p><strong>Magazines of Author</strong></p>`)   ; 
       res.write(htmlTable(results)) ;       
      //  res.write("<h2>Priniting Books </h2>")       
       }catch(error)
       {
          res.write(`<h5>OOPS!.. No Magazine With ISBN : <i>${searchVal}</i> is found</h5>`);
       }
      
  // try{ 
  // res.write(htmlTable(results));
  // res.end();
  // }catch(err)
  // {
  //   res.write("Unable to process request") ; 
  //   res.end(); 
  // }

  // res.writeHead(200, {
  //   'Content-Type': 'text/html'
  // });
  // res.send("<p>Unable to process your request");
   res.end();





      });

//  Display the works of author 
app.get("/author/publications" ,(req,res)=>{
  
    // get the author email 
    var searchField = "authors";
    var searchVal = req.query.email;
    author_books = [] ; 
    author_magazines = [] ; 
    let json_obj = csvToJson.fieldDelimiter(';').getJsonFromCsv("./data/magazines.csv");
    for (var i=0 ; i < json_obj.length ; i++)
    {
      if (json_obj[i][searchField] == searchVal) {
          author_magazines.push(json_obj[i]);
      }
    }
    json_obj = csvToJson.fieldDelimiter(';').getJsonFromCsv("./data/books.csv");
    for (var i=0 ; i < json_obj.length ; i++)
    {
      if (json_obj[i][searchField] == searchVal) {
          author_books.push(json_obj[i]);
      }
    }
    res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write('<h4>Displaying authors works</h4>'); 
       try { 
        // res.write("<h2>Printing Magazines</h2>");     
        res.write(`<p><strong>Magazines of Author</strong></p>`)   ; 
       res.write(htmlTable(author_magazines)) ;       
      //  res.write("<h2>Priniting Books </h2>")       
       }catch(error)
       {
          res.write(`<h5>OOPS!.. No Magazines for Author : <i>${searchVal}</i> were found</h5>`);
       }
       try {
        res.write(`<p><strong>Books of Author</strong></p>`)   ; 
        res.write(htmlTable(author_books)) ;    
       }catch(error)
       {
          res.write(`<h2>OOPS!.. No Books for Author : <i>${searchVal}</i> were found</h2>`);
       }
      res.end();
    
});  


// Add a Book 
app.get('/books/add',(req,res)=>{
  res.send(`
  <fieldset>
  <legend>Add a Book </legend>
   <form action="/books/add" method="post">
  <label for="bookname">enter Book Name </label>
  <input type="text" id="bookname" name="bname"><br><br>
  <label for="book-ISBN">enter ISBN NUMBER </label>
  <input type="text" id="book-ISBN" name="bisbn"><br><br>
  <label for="book-authors">enter Authors of Book </label>
  <input type="email" id="book-authors" name="bemail"><br><br>
  <label for="book-description">Description  </label>
  <input type="text" id="book-description" name="bdesc"><br><br>
  <input type="submit" value="Submit" id="book-submit">
</form>
  `);

}); 

app.post('/books/add',(req,res)=>{
  // res.send(req.body); 
  // console.log(req.body.bname); 
    let book_name = req.body.bname ; 
  let book_isbn = req.body.bisbn ; 
  let book_email = req.body.bemail ; 
  let book_desc = req.body.bdesc ; 

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
// res.write(htmlTable(req.body)) ; 
// res.end();
fs.appendFile("./data/books.csv", `${book_name};${book_isbn};${book_email};${book_desc}\n`, (err) => {
      if (err) {
        console.log(err);
      }
      else {
        // Get the file contents after the append operation
        // console.log("\nFile Contents of file after append:",
        //   fs.readFileSync("example_file.txt", "utf8"));
      }
    });  
  res.write(`<p>Book is added<p>`); 
  res.write(`<p> BOOK NAME : <i> ${book_name} </i> </p>`);
  res.write(`<p> BOOK ISBN : <i> ${book_isbn} <i></p>`);
  res.write(`<p> BOOK AUTHORS : <i>${book_email} </i></p>`);
  res.write(`<p> BOOK DESCRIPTION : <i> ${book_desc} </i></p>`);
  res.end();


}) ; 


// Add a magazine 

app.get('/magazines/add',(req,res)=>{
  res.send(`
  <fieldset>
  <legend>Add a Magazine </legend>
   <form action="/magazines/add" method="post">
  <label for="magzinename">enter Magazine Name </label>
  <input type="text" id="magzinename" name="mname"><br><br>
  <label for="magazine-ISBN">enter ISBN NUMBER </label>
  <input type="text" id="magazine-ISBN" name="misbn"><br><br>
  <label for="magazine-authors">enter Authors of Book </label>
  <input type="email" id="magazine-authors" name="memail"><br><br>
  <label for="magazine-description">Description  </label>
  <input type="text" id="magazine-description" name="mdesc"><br><br>
  <input type="submit" value="Submit" id="magazine-submit">
</form>
  `);

}); 

app.post('/magazines/add',(req,res)=>{
  // res.send(req.body); 
  // console.log(req.body.bname); 
    let magazine_name = req.body.mname ; 
  let magazine_isbn = req.body.misbn ; 
  let magazine_email = req.body.memail ; 
  let magazine_desc = req.body.mdesc ; 

  
// res.write(htmlTable(req.body)) ; 
// res.end();
fs.appendFile("./data/magazines.csv", `${magazine_name};${magazine_isbn};${magazine_isbn};${magazine_desc}\n`, (err) => {
      if (err) {
        //console.log(err);
			res.writeHead(501, {
    'Content-Type': 'text/html'
  });
  res.write(`<p>There is an error encountered at server level ${err}`); 
  res.end(); 
      }
      else {
        // Get the file contents after the append operation
        // console.log("\nFile Contents of file after append:",
        //   fs.readFileSync("example_file.txt", "utf8"));
		res.writeHead(200, {
    'Content-Type': 'text/html'
  });
	res.write(`<p>MAGAZINE is added<p>`); 
  res.write(`<p> MAGAZINE NAME : <i> ${magazine_name} </i> </p>`);
  res.write(`<p> MAGAZINE ISBN : <i> ${magazine_isbn} <i></p>`);
  res.write(`<p> MAGAZINE AUTHORS : <i>${magazine_email} </i></p>`);
  res.write(`<p> MAGAZINE DESCRIPTION : <i> ${magazine_desc} </i></p>`);
  res.end();
      }
    });  



}) ; 

// use error handler 
// app.use(errorHandler); 
  // run the server 
app.listen(PORT, () => {
  console.log(`listening on port ${PORT} `) ; 
}); 