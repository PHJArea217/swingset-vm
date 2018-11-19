var express = require('express');
var wordgame = require('./wordgame/index.js');
var short_urls = require('./short-urls.json');

var expressApp = express();

/* Guess the Word Game (depends only on arguments) */
expressApp.get("/gtw", wordgame.callback);

/* URL shortener */
expressApp.get("/short-url/:value", (req, res) => {
	var target = short_urls["/" + req.params.value];
	if (target == undefined || target === null) {
		res.sendStatus(404);
		return;
	}
	target = String(target);
	if (target.startsWith('http')) {
		res.redirect(302, target);
	} else {
		res.sendStatus(500);
	}
});

for (var v in short_urls) {
	var key = String(v);
	if (!key.startsWith('@')) {
		continue;
	}
	expressApp.get(`/short-url/${key.substring(1)}/:p`, (req, res) => {
		res.redirect(302, String(short_urls[key])
			.replace("\[!v]", String(req.params.p)))
	});
}

if (process.env.NODE_ENV === 'production') {
	expressApp.listen("/socket/socket");
} else {
	expressApp.listen(Number(process.env.PORT));
}