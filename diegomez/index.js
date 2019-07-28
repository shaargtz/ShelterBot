 const admin = require("firebase-admin");

 const serviceAccount = require("./creds.json");
 
 admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 databaseURL: "https://ibm-challenge-78f32.firebaseio.com",
 databaseAuthVariableOverride: null
 });

 const database = admin.database();

//path for the inventory
const shelterInventory = database.ref("/ShelterInventory/");

// get value function
async function getValue(obj) {
  let _data = {}
  //the snapshot gets the value of the node
  await obj.once("value").then(snapshot => {
      _data = snapshot.val();
  }); 
  return _data;
}

//this function will be exported with the zip file
//it recieves an object as parameter
exports.main = obj => {

    //this is the timestamp
    const time = Date.now();

    //this is the path to the special donation inside the organization
    const donation = shelterInventory.child(obj.org).child("AllItems").child(obj.key);

    const status = donation.child("Status");

    const boughtQuantity = donation.child("QuantityBought");

    const objectName = donation.child("Name");

    const itemList = shelterInventory.child(obj.org).child("ItemList");

    let itemListedStock, donatedItemStock, QuantityBought, newStock, donatedItem;

    getValue(boughtQuantity).then(value => donation.update({
      "Available" : value
    }))

    getValue(boughtQuantity).then(value => {
      QuantityBought = value;
    })

    getValue(objectName).then(item => {
      donatedItemStock = itemList.child(item).child("Stock");
      donatedItem = itemList.child(item);

      getValue(donatedItemStock).then(stock => {
        itemListedStock = stock;
        newStock = stock + QuantityBought;
        donatedItem.update({
          "Stock" : newStock
        })
      })

    })

    // update status
    status.update({
      "State" : "Delivered",
      "Time" : time
    });
}
