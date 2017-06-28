var express = require('express');
var router = express.Router();

/* GET sql list page. */
router.route('/').get(function(req, res, next) {
 
      GLOBAL.modelsSeq["users"].findAll().then(function(datas){
		  res.render(req.message.view,{
			  title: 'List from SQL ',
			  result: datas
		  });
	  })
  
});
module.exports = router;
