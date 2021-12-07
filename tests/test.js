const supertest = require("supertest");
const joi = require("joi");
const joiAssert = require("joi-assert");

global.Joi = joi;
global.joiAssert = joiAssert;
global.request = supertest("https://tchml.tradersclub.com.br/bff/v1/news");
global.authRequest = supertest("https://tchml.tradersclub.com.br/bff/v1/auth/login");
