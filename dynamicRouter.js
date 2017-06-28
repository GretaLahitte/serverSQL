var express = require("express");
var router = express.Router();
var appContext
var url = require("url");
//dynamicRouter
function dynamicRouter(app){
	appContext = app;
	router.use(manageAction);
	appContext.use(router);
}

function manageAction(req,res,next){
	var path; //le path aprés le port 3000 dans l'url
	var type; //GET ou POST
	var controler; //nom du controleur à charger
		path = url.parse(req.url).pathname;
	//il faut supprimer pour le routage le param aprés l'action
	if (path.split('/').length>0) path='/'+path.split('/')[1]
	//console.log('Path url: ',path.split('/')[1]);
	type =req.method;
	console.log('path: ',path);
	req.message={};
	req.message.action=type+path;
	if(GLOBAL.actions_json[type+path].view)
		req.message.view=GLOBAL.actions_json[type+path].view;
	else
		req.message.view=null;
	if(GLOBAL.actions_json[type+path].sql_query)
		req.message.sql_query=GLOBAL.actions_json[type+path].sql_query;
	else
		req.message.sql_query=null;
	if (typeof GLOBAL.actions_json[type+path]=='undefined'){
		console.log("Erreur pas d'action: "+path);
		next();
	}
	else{
		console.log('No cache'.green);
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		res.header('Expires', '-1');
		res.header('Pragma', 'no-cache');
		instanceModule = require('./routes/'+GLOBAL.actions_json[type+path].controler);
		router.use(path,instanceModule);
		next();
	}
}
module.exports = dynamicRouter;
