var express = require('express');
var router = express.Router();

/* GET SQL page. */
router.get('/', function(req, res, next) {
  if ((req.session.passport) && (req.session.passport.user != null)) {
        // Requête SQL via l’instance sequelize
    GLOBAL.sequelize.query(req.message.sql_query, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(datas) { // sql query success
        //console.log('listes des datas : ', datas);
        res.render(req.message.view, {
            title: 'List from SQL',
            result: datas,
            connected:"true"
        });
    }).catch(function(err) { // sql query error
        console.log('error select', err);
    });
}else{
		res.render('login', { title: 'Server SQL' ,connected:"false"});
	}
});
module.exports = router;
