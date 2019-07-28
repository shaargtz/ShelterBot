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

const ref = db.ref("/ShelterInventory/");

main = obj => {
    const trackedItem = ref.child("Org1").child("AllItems").child(obj.id);
    const statusNode = trackedItem.child("Status").child("State");

    let data = "";

    const getData = async () => {
        await statusNode.once("value", function(snapshot) {
            data = snapshot.val();
        });
    }
    
    getData();

    return data;

}

let uuu = {
    "id" : "-Lk_YGt1yfkKmf5DmoN8"
}

console.log(main(uuu));