var express = require('express');
var router = express.Router();

/* GET companies list page. */
router.route('/').get(function(req, res, next) {
 
      GLOBAL.modelsSeq["companies"].findAll({
		  include:[{
			  model: GLOBAL.modelsSeq["countries"],
			  keyType: GLOBAL.db.Sequelize.STRING
		}]
		}).then(function(datas){
			  console.log('Data from Sequelize Model Jointure: ',datas);
			  res.render(req.message.view,{
				title: 'List from SQL postgreSQL Jointure',
				result: datas
		  });
	  })
  
});
module.exports = router;
