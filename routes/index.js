var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	 if ((req.session.passport) && (req.session.passport.user != null)) {
		res.render('index', { title: 'Server SQL' ,connected:'true'});
	}else{
		res.render('index', { title: 'Server SQL',connected:'false' });
	}
});


module.exports = router;
