exports.addMiddleware = (express, app) => {
	app.use("/vehicle-svr", require("./mtd-vehicle-server/express-middleware.js").serveJsonFiles);
}
