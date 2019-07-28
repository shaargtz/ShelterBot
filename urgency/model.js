//import json with stock and timestamps of uses and donations
const items = require("./dataset.json");

//convert json to an array for easier handling
const itemArray = Object.entries(items);

//this holds the average units of each product that gets donated per second
let donationRates = [];
//this holds the average units of each product that gets used per second
let burnRates = [];
//this holds the stock divided by the difference between donation and burn rates
let availRates = [];
//this will be the item that gets sent to the user
let mostUrgent = [];

for (item in itemArray) {
    //this is to prioritize any items with no stock
    if (itemArray[item][1].stock == 0) {
        mostUrgent.push(itemArray[item][0]);
    } else {
        //this is just a simple slope equation
        donationRates[item] = 1 / (itemArray[item][1].donations[4]-itemArray[item][1].donations[0]);
        //same as above
        burnRates[item] = 1 / (itemArray[item][1].uses[4]-itemArray[item][1].uses[0]);
        //divide by the stock to have a more precise urgency rate
        availRates.push([itemArray[item][1].stock / (donationRates[item] - burnRates[item]), item]);
    }    
}

//the most negative values are the items with the most urgency
availRates.sort();

//this will fill the mostUrgent array with the top 3 items
//this also prevents repetition of an item with no stock
let counter = 0;
while (mostUrgent.length < 3) {
    mostUrgent.push(itemArray[availRates[counter][1]][0]);
    counter++;
}

console.log(`The most urgent items are ${mostUrgent[0]}, ${mostUrgent[1]} and ${mostUrgent[2]}`)