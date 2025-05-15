"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var cookie_parser_1 = require("cookie-parser");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.post('/register');
app.post('/login');
