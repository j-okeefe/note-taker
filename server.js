// Packages
const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");

// Creates express server
const app = express();
const PORT = process.env.PORT || 3001

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Display routes
app.get ('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// API routes
// Retrieves existing notes
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', "utf8", (err,data) => {
        if(err) return console.error(err);
        res.send(data);
    });
});

// Post new notes
app.post('api/notes', (req, res) => {
    fs.readFile('db/db.json', "utf8", (err, data) => {
        if (err){
            return console.error(err);
        } else {
            let notes = JSON.parse(data);
            let newNote = req.body;
            console.log(newNote);
            newNote['id'] = uniqid;
            notes.push(newNote);
            fs.writeFile('db/db.json', "utf8", JSON.stringify(notes), (err) =>
                err ? console.error(err) : console.log("Note has been stored."))
            res.json(newNote);
        }
        
    });
});

// Delete notes
app.delete('api/notes/:id', (req, res) => {
    fs.readFile('db/db.json', "utf8", (err, data) => {
        if (err) {
            return console.error(err);
        } else {
            let notes = JSON.parse(data);
            notes = notes.filter(e => e.id != req.params.id)
            fs.writeFile('db/db.json', "utf8", JSON.stringify(notes), (err) =>
                err ? console.error(err) : console.log("Note has been deleted."))
            res.send({});
        }
    });
});

// Event listener
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));