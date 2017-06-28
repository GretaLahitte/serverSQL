var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs =require('fs');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');


///SEQUELIZE
GLOBAL.db={};
var Sequelize =require('sequelize');
db.Sequelize=Sequelize;
//dbSeq = require('./core/sequelize');
//Configuration des paramétres de la connexion
GLOBAL.sequelize = new Sequelize('serverSQL','admin','vulpecula',{
	host:'localhost',
	dialect:'mysql',
	define: {
    timestamps: false  // I don't want timestamp fields by default
	},
	pool:{max:5,min:0,idle:10000}
});
db.sequelize=sequelize;
GLOBAL.modelsSeq={};

// Loader Sequelize models into GLOBAL.modelsSeq
fs.readdirSync(__dirname+'/models')
	.filter(function(file){
		return (file.indexOf(".") !== 0);
		}) // on filtre les fichiers, ils doivent contenir un point (.js)
	.forEach(function(file){
		var model= GLOBAL.sequelize.import(path.join(__dirname + '/models',file));
		GLOBAL.modelsSeq[model.name]=model;
		console.log('file read : '+file);
	});
/*
//CREATION DE L'ASSOCIATION
GLOBAL.modelsSeq["personnel"].belongsTo(GLOBAL.modelsSeq["countries"],{
	foreignKey:"country_code",
	keyType:GLOBAL.db.Sequelize.STRING
});
	*/
//Controleurs dynamiques
GLOBAL.actions_json = JSON.parse(fs.readFileSync('./routes/config_actions.json','utf-8'));

// set hbs partials
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials', function() {
console.log('Partials registered');
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
				  cookieName: 'serverSQL',
				  secret: 'keyboard cat',
				   }));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user,done){
	done(null,user.id);
});
passport.deserializeUser(function(account, done){
     try {
		 console.log('account: ',account);
         GLOBAL.sequelize
            .query("select * from users where id='"+account+"'", {type:GLOBAL.sequelize.QueryTypes.SELECT})
            .then(function(users) {
              done(null, users[0]);
            });
        } catch (err) {
            return done(err);
        }
    });
passport.use('local', new LocalStrategy({
            // by default, local strategy uses username and password, we will
            // override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
            // allows us to pass back the entire request to the
            // callback
        },
		function (req, username, password, done) {
			//console.log('req.session:',req.session);	
			process.nextTick(function () {
			      try {sequelize
					  .authenticate()
					  .then(() => {
						console.log('Connection has been established successfully.');
					  })
					  .catch(err => {
						console.error('Unable to connect to the database:', err);
  });

                  GLOBAL.sequelize
                    .query("select * from users where login='"+username+"'", {type: GLOBAL.sequelize.QueryTypes.SELECT})
                    .then(function(users) {
                        if(users.length>0){
							console.log('sequelize: ',users);
							_account = users[0];

							var role = _account.role.toLowerCase();
							if(role === "sadmin")
							  role = "admin";
							req.session.profile = role;
                       
							//Test Password

							var bcrypt = require('bcrypt-nodejs');
							console.log("###password : ", password.green);
							console.log("###_account.password : ", _account.password);
							if ( _account == password) {console.log('bingo')};
                   
							bcrypt.compare(password, _account.password, function(err, isMatch) {
							  if (err) return done(err);
							  if (isMatch) {
								console.log('user logged');
								req.session.user = _account;
								return done(null, _account);
							  } else {
								console.log('user error');
								req.session.profile = 'default';
								return done(null, false, {"flag": "password", "username": username, "message": 'Passport Bad Password for username : ' + username  });
							  }
							});
                          
                        }else{
							console.log('user error');
							return done(null, false, {"flag": "username", "username": username, "message": 'Passport account not found in db for username : ' + username  });
                        }
                    });
				} catch (err) {
                    return done(err);
                }
			 })
		 }
));

app.post('/authenticated', passport.authenticate('local'), function (req, res) {
	if (req.session.passport.user != null) {
			res.redirect('/users'); //le user est authentifié on affiche l’index il est en session
	    } else {
		   res.redirect('/'); // il n’est pas présent on renvoie à la boîte de login
		     } });

// Routes Managed dynamicaly
require('./dynamicRouter')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//HELPERS
hbs.registerHelper('compare', function(lvalue,rvalue,options){
	console.log('###### COMPARE lvalue: ',lvalue,' et rvalue: ',rvalue);
	if (arguments.length<3)
		throw new Error("Handlebars Helper 'compare' needs 2 parameters");
	var operator = options.hash.operator || '==';
	var operators = {
		'==': function(l,r){
			return l == r;
			},
		'isTabEmpty': function(obj){
			return (!obj|| obj.length==0)}
	}
if (!operators[operator])
	throw new Error("'compare' doesn't know the operator "+operator);
	console.log(operators[operator]);
var result =operators[operator](lvalue,rvalue);
if (result){
	return options.fn(this);
}else{
	return options.inverse(this);
}});
module.exports = app;
