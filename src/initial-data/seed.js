const dishJson = require('./dishess.json');
const leaderJson = require('./leaders.json');
const promJson = require('./promosions.json');
const userJson = require('./users.json')

const Dishes = require('../models/dishes');
const Leaders = require('../models/leaders');
const Promotions = require('../models/promotions');
var Users = require('../models/user');

async function seed() {
    dishJson.forEach((dish)=>{
        Dishes.create(dish).then((data) => {
            console.log("successfully added dishes data seed: ");
        }, (err) => { console.log(err); });
    })
    
    leaderJson.forEach((leader)=>{
        Leaders.create(leader).then((data) => {
        console.log("successfully added leaders data seed: ");
    }, (err) => { console.log(err); });
    })
    
    promJson.forEach((prom)=>{
        Promotions.create(prom).then((data) => {
        console.log("successfully added promotions data seed: ");
    }, (err) => { console.log(err); });
    })
    
    userJson.forEach((user)=>{
     Users.create(user).then((data) => {
        console.log("successfully added users data seed: ");
    }, (err) => { console.log(err); });   
    })
    

    
}
module.exports = seed;