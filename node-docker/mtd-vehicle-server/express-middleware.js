var express = require("express");
exports.serveJsonFiles = (req, res, next) => {
	if (req.path == "/") {
		res.set("Content-Type", "text/plain");
		res.set("X-Content-Type-Options", "nosniff");
		res.send(`In this folder:

reroutes.json - cached copy of getreroutes from MTD API, updated about once per hour
reroutes.pp.json - same but pretty-printed
vehicles.json - cached copy of getvehicles from MTD API, updated about every 40-45 seconds
vehicles.pp.json - same but pretty-printed

Data provided by CUMTD.
Visit https://go.peterjin.org/cumtd-api for more information.
			`);
		return;
	}
	express.static(process.env.VS_PUBLIC_DIR || "public", {etag: true, setHeaders: (res, path, stat) => {
		let p = String(path);
		if (/\/vehicles(\.pp)?\.json$/.test(p)) {
			res.set("Cache-Control", "max-age=20, public");
		} else {
			res.set("Cache-Control", "max-age=900, public");
		}
		res.set("X-Content-Type-Options", "nosniff");
	}})(req, res, next);
};
