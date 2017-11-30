var express=require('express');
var app=new express();
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

//krijojme skemen e rregjistrimit dhe te login
var loggedin=false;
var user="";
mongoose.connect("mongodb://jori:jori@ds123956.mlab.com:23956/juliantauland");

mongoose.connection.once("open", function() {
	console.log("database connected");
//krijojme skemen e rregjistrimit 
	var UserSchema = new mongoose.Schema({
		email:String,
		username:String,
		phone:String,
		password:String
	});


	
var User=mongoose.model('User',UserSchema);

//ketu behet rregjistrimi ne database
	app.post('/signup',function(req,res) {			
		var username=req.body.username;
		var email=req.body.email;
		var phone =req.body.phone;
		var password=req.body.password;
		User.findOne({
			
			username:username,
			email:email
			
			
	},function(err,item){
		if(err)console.log(err);
		else if(item!= null)res.json( { message:"you are registered"});
		else {
			User.create({
			username:username,
			email:email,
			phone:phone,
			password:password
		},function(err,item){
			if(err){console.log(err);
			}else {console.log(item);
			}
		});
		}
	})
	});
	
	
	app.get('/profile',function(req,res){
		if(loggedin==true) res.sendFile(__dirname +"/public/home.html");
		else res.send("ju nuk jeni i loguar");

		
	});

app.get('/logout',function(req,res){
	loggedin=false;
	res.json({message:"you are now logged out"});

});
//kerkojme ne database per userin qe rregjistruam 
	app.post('/login',function(req,res){
		var username=req.body.username;	
		var password=req.body.password;
		
		console.log(username);
		console.log(password);
		
		User.findOne({
			username:username,
			password: password
		},function(err,item){
			if(err){
				console.log(err);
				res.json({message:err});
			}else if(item==null){
				res.json({message :"nuk u gjet useri"});
			}else {loggedin=true; user=username;
			res.json({message:"u gjet"});
			
			}
		});
	});
});
app.listen(process.env.PORT || 7000);