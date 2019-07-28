//default credentials for firebase
const admin = require("firebase-admin");

const serviceAccount = require("./creds.json");

admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: "https://ibm-challenge-78f32.firebaseio.com",
databaseAuthVariableOverride: null
});

const db = admin.database();
//end of credentials


//path for the inventory
const reff = db.ref("/ShelterInventory/");

//this function will get the url of the image
//obj is just the object that will be sent as parameter from the main function
async function value(obj, node) {
    //this is the path to the image url in itemlist
    const image = reff.child(obj.org).child("ItemList").child(obj.name).child("Image");
    let _data = {}
    //the snapshot gets the value of the node
    image.once("value", function(snapshot) {
        _data = snapshot.val();
        node.update({
            "Image" : _data
        });
    }); 
    return _data;
}


//this function will be exported with the zip file
//it recieves an object as parameter
exports.main = obj => {
    //this is just to check that the object is sent correctly
    console.log(obj);

    //this is the timestamp
    const time = Date.now();

    //this is the path to the items inside the specified organization
    const node = reff.child(obj.org).child("AllItems");

    //we push an object with the specified name and qty
    //push() method creates a unique id
    const push = node.push({
        "Available" : 0,
        "Consumed" : 0,
        "Image" : "bitch",
        "Name" : obj.name,
        "QuantityBought" : obj.quantity,
        "Status" : {
            "State" : "Shipping",
            "Time" : time
        }
    });

    //this is the unique id created with the push
    child = node.child(push.key);


    //the promise gets the url of the img first, and then updates the value inside the database
    value(obj, child).then(ret => {
        child.once("value", function(snapshot) {
            console.log("djkasnfhjsdn", snapshot.val());
       })
    });
    

    //just a log to check that everything was added correctly
    child.once("value", function(snapshot) {
         console.log(snapshot.val());
    })

}
