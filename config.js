var development = {
	servicedependencies: {
		dbapi : "http://"+(global.process.env.DBAPI_PORT_13301_TCP_ADDR || "localhost")+":"+ (global.process.env.DBAPI_PORT_13301_TCP_PORT || "13301")
	},
	port : 12200
};


var production = {
  	//mongodb : "mongodb://127.0.0.1:28018/spending",
	//port : 3000
};

if (global.process.env.NODE_ENV === 'production'){
	console.log("setting env to production");
	exports.Config = production;
}
else {
	console.log("setting env to development");
	exports.Config = development;
}
