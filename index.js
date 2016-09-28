'use strict';

const customers = require("./data/customers.json");
const lodown = require('lodown-jmenkin');


// Number of Males
function numMales(arr) {
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
function oldestCustomer(){
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
    lodown.reduce(ages, function(youngest, next, i){
        if (next < youngest){
            index = i;
            return next;
        }
        return youngest;
    });
    return (customers[index]["name"] + ", " + customers[index]["age"]);
}
console.log("Youngest Customer: " + youngestCustomer());


// Average Balance
function averageBalance(){
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
function customerName(collection) {
    var AtoZ = [];
    //Creates A to Z Array from ASCII Code
    for (var i = 65; i < 91; i++) {
        AtoZ.push(String.fromCharCode(i));
    }
    // Runs filter on Every Letter A to Z 
    for (var j = 0; j < AtoZ.length; j++) {
        var results = lodown.filter(collection, function(customer) {
            return customer.name.charAt(0) == AtoZ[j];
        }).length;
        if(results) {
            console.log("Customer Names that Begin with " + AtoZ[j] + ": " + results);
        }
    }
}
customerName(customers);


// Customer Friends Names That Being With...(Takes Letter Argument)
function customerFriendName(collection, letter) {
    var friends = lodown.map(collection, function(customer){
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
    var numFriends = 0;
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
function topTags(amount) {
    var allTags = [];
    lodown.each(customers, function(customer){
      lodown.each(customer.tags, function(tag){
          allTags.push(tag);
      });
    });
    var uniques = lodown.unique(allTags);
    var uniqueCount = [];
    lodown.each(uniques, function(uniqueTag){
        var counter = 0;
        lodown.each(allTags, function(tag){
            if(tag === uniqueTag) counter++;
        });
        uniqueCount.push(counter);
    });
    var results = [];
    while (results.length < amount){
        var index = 0;
        lodown.reduce(uniqueCount, function(max, next, i){
            if(max < next){
                index = i;
                return next;
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

