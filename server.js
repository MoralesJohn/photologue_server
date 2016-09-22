// Setup and app definition //
var express = require("express");
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var path = require("path");
var multer = require('multer');
var upload = multer({dest: './uploads/'})

var app = express();
mongoose.connect('mongodb://localhost/photologuedb');


app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "./static")));

var logueSchema = new mongoose.Schema({
	comments: {type: String}, 
	date: {type: Date}, 
	image: {type: String}
}, {timestamps: true});
mongoose.model('Entry', logueSchema);
var Entry = mongoose.model('Entry');

// Routes //
app.get('/', function(req, res) {
	Entry.find({}, function(err,entries){
		if (err) throw err;
		res.render("index",{entries:entries});
	});
});

app.get('/entries/news', function(req, res){
	res.render('news');
});

app.get('/entries/:id', function(req, res){
	Entry.find({_id: req.params.id}, function(err,entry){
		if (err) throw err;
		res.render('display',{entry:entry});
	});
});

app.post('/upload', upload.single('pic'), function (req, res) {
	// req.files is array of `photos` files 
	// req.body will contain the text fields, if there were any 
	var entry = new Entry({comments: req.body.comments, date: req.body.date, image: req.body.filename});
	entry.save(function(err){
		if (err) throw err;
	});
	res.json({});
});

app.post('/entries', function(req, res){
	var dt = req.body.dt_found;

	var entry = new Entry({name: req.body.name, dt_found: req.body.dt_found});
	console.log(dt);
	entry.save(function(err){
		if (err){
			throw err;
		}
	});
	res.redirect('/');
});

app.get('/entries/:id/edit', function(req, res){
	Entry.findOne({_id:req.params.id}, function(err,entry){
		if (err) throw err;
		console.log(entry);
		res.render('edit',{entry:entry});
	});
});

app.post('/entries/:id', function(req, res){
	var data = {
		name: req.body.name,
		dt_found: req.body.dt_found
	}
	console.log(req.body.dt_found);
	Entry.update({_id: req.params.id}, data, function(err, affected){
		if (err) throw err;
	});
	res.redirect('/');
});

app.get('/entries/:id/destroy', function(req, res){
	Entry.remove({_id: req.params.id},function(err){
		if (err) throw err;
		res.redirect('/');
	});
});

// Server setup //
var server = app.listen(8000, function() {
 console.log("Photologue listening on port 8000");
});
