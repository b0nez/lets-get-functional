'use strict';

const customers = require("./data/customers.json");
const lodown = require('lodown-jmenkin')


// Number of Males
function numMales (arr) {
    return lodown.filter(arr, function (customer){ 
        return customer.gender === "male";
    }).length;
}
console.log("Number of Males: " + numMales(customers));


// Number of Females
function numFemales(arr) {
    return lodown.filter(arr, function (customer) {
        return customer.gender === "female";
    }).length;
}
console.log("Number of Females: " + numFemales(customers));


// Oldest Customer
function oldestCustomer (){
    var ages = lodown.pluck(customers, "age");
    var index;
    lodown.reduce(ages, function(oldest, next, i){
        if(next > oldest){
            index = i;
            return next;
        }
        return oldest;
    });
    return(customers[index]["name"] + ", " + customers[index]["age"]);
}
console.log("Oldest Customer: " + oldestCustomer());


// Youngest Customer
function youngestCustomer() {
    var ages = lodown.pluck(customers, "age");
    var index;
    lodown.reduce(ages, function(youngest, challenger, i){
        if (challenger < youngest){
            index = i;
            return challenger;
        }
        return youngest;
    });
    return (customers[index]["name"] + ", " + customers[index]["age"]);
}
console.log("Youngest Customer: " + youngestCustomer());


// Average Balance
function averageBalance (){
    var balances = lodown.pluck(customers, "balance");
    balances = lodown.map(balances, function(elem, i, balances){
        var value = elem.slice(1);
        value = value.replace(",","");
        return Number(value);
    });
    var totalBalance = lodown.reduce(balances, function(total, elem){
        return total + elem;
    });
    var averageBalance = (totalBalance / balances.length).toFixed(2);
    return averageBalance;
}
console.log("Average Balance: $" + averageBalance());

// Customer Names that Begin With ...
function customerName(collection, letter) {
    var results = lodown.filter(collection, function(customer) {
        return customer.name.charAt(0) == letter;
    }).length;
    console.log("Customer Names that Being with " + letter + ": " + results);
}
customerName(customers, "D");


// Customer Friends Names That Being With...
function customerFriendName(arr, letter) {
    let friends = lodown.map(arr, function(customer){
        return customer.friends;
    });
    var merged = [].concat.apply([], friends);
    var results = lodown.filter(merged, function(friend) {
        return friend.name.charAt(0) === letter;
    }).length;
    console.log("Customer Friends' Name that Begin with " + letter + ": " + results);
}
customerFriendName(customers, "D");


// Number of Customer Friends
function customerFriends() {
    let numFriends = 0;
    lodown.each(customers, function(customer){
        lodown.each(customer.friends, function(friend){
            lodown.each(customers, function(customerJ){
                if (customerJ.name === friend.name) numFriends++;
            });
        });
    });
    return numFriends;
}
console.log("Number of Customers That Are Friends: " + customerFriends());


// Top Three Tags
function topTags (amount) {
    let allTags = [];
    lodown.each(customers, function(customer){
       lodown.each(customer.tags, function(tag){
           allTags.push(tag);
       });
    });
    let uniques = lodown.unique(allTags);
    let uniqueCount = [];
    lodown.each(uniques, function(uniqueTag){
        let counter = 0;
        lodown.each(allTags, function(tag){
            if(tag === uniqueTag) counter++;
        });
        uniqueCount.push(counter);
    });
    let results = [];
    while (results.length < amount){
        let index = 0;
        lodown.reduce(uniqueCount, function(max, challenger, i){
            if(max < challenger){
                index = i;
                return challenger;
            }
            return max;
        });
        results.push(uniques[index]);
        uniques.splice(index,1);
        uniqueCount.splice(index,1);
    }
    return results;
}
console.log("Top Three Tags:", topTags(3));


// Summary of Genders
function countByGender(arr) {
    var genders = lodown.map(arr, function (customer){
        return customer.gender;
    });
    return lodown.reduce(genders, function (gender, i, genders) {
        if (typeof gender[i] == 'undefined') {
            gender[i] = 1;
        } else {
            gender[i] += 1;
        }
    return gender;
    }, {});
}
console.log("Summary of Genders: ", countByGender(customers));
