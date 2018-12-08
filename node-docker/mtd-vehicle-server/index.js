var express = require("express");
var app = express();

app.use("/", require("./express-middleware.js").serveJsonFiles);

app.listen(process.env.PORT || 8008);
