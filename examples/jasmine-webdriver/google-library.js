/* jslint node: true */
"use strict";

var webdriver = require('selenium-webdriver');
var assert = require('assert');
var Yadda = require('yadda');

module.exports = (function() {

    var dictionary = new Yadda.Dictionary()
        .define('LOCALE', /(fr|es|ie)/)
        .define('NUM', /(\d+)/);

    var library = new Yadda.localisation.English.library(dictionary)

    .when("I open Google's $LOCALE search page", function(locale, next) {
        this.driver.get("http://www.google." + locale + "/");
    })

    .then("the title is $TITLE", function(title) {
        var driver = this.driver;
        driver.wait(function() {
            return driver.getTitle().then(function(value) {
                return value === title;
            });
        }, 5000);
    })

    .then("the $ACTION form exists", function(action) {
        var driver = this.driver;
        driver.wait(function() {
            return driver.findElement(webdriver.By.css('form[action="/' + action + '"]'));
        }, 5000);
    })

    .when("I search for $TERM", function(term) {
        this.driver.findElement(webdriver.By.name('q')).then(function(input) {
            input.sendKeys(term + '\n');
        });
    })

    .then("the search for $TERM was made", function(term) {
        var driver = this.driver;
        driver.wait(function() {
            return driver.getCurrentUrl().then(function(value) {
                return new RegExp('q=' + term).test(value);
            });
        }, 5000);
    })

    .then("$NUM or more results were returned", function(number) {
        var driver = this.driver;
        driver.wait(function() {
            return driver.findElements(webdriver.By.css('h3.r')).then(function(elements) {
                return elements.length >= parseInt(number);
            });
        });
    });

    return library;
})();
