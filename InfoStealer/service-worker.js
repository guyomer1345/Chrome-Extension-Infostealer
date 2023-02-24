let db = null;

function create_database() {
    const request = indexedDB.open('MyTestDB');
    
    request.onerror = function (event) {
        console.log("Problem opening DB.");
    }

    request.onupgradeneeded = function (event) {
        db = event.target.result;

        let objectStore = db.createObjectStore('info', {
            keyPath: 'platform'
        });

        objectStore.transaction.oncomplete = function (event) {
            console.log("ObjectStore Created.");
        }
    }

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("DB OPENED.");

    }
}

function insert_record(record) {
    if (db) {
        const insert_transaction = db.transaction("info", "readwrite");
        const objectStore = insert_transaction.objectStore("info");

        return new Promise((resolve, reject) => {
            insert_transaction.oncomplete = function () {
                console.log("ALL INSERT TRANSACTIONS COMPLETE.");
                resolve(true);
            }

            insert_transaction.onerror = function () {
                console.log("PROBLEM INSERTING RECORDS.")
                resolve(false);
            }


            let request = objectStore.add(record);
            request.onsuccess = function () {
                console.log("Added: ", record);
            }

        });
    }
}

function get_record(platform) {
    if (db) {
        const get_transaction = db.transaction("info", "readonly");
        const objectStore = get_transaction.objectStore("info");

        return new Promise((resolve, reject) => {
            get_transaction.oncomplete = function () {
            console.log("ALL GET TRANSACTIONS COMPLETE.");
            }

            get_transaction.onerror = function () {
            console.log("PROBLEM GETTING RECORDS.")
            }

            let request = objectStore.get(email);

            request.onsuccess = function (event) {
                console.log(event)
            resolve(event.target.result);
            }
        });
    }
}

function update_record(record) {
    if (db) {
        const put_transaction = db.transaction("info", "readwrite");
        const objectStore = put_transaction.objectStore("info");

        return new Promise((resolve, reject) => {
            put_transaction.oncomplete = function () {
                console.log("ALL PUT TRANSACTIONS COMPLETE.");
                resolve(true);
            }

            put_transaction.onerror = function () {
                console.log("PROBLEM UPDATING RECORDS.")
                resolve(false);
            }

            objectStore.put(record);
        });
    }
}

function delete_record(platform) {
    if (db) {
        const delete_transaction = db.transaction("info", 
        "readwrite");
        const objectStore = delete_transaction.objectStore("info");

        return new Promise((resolve, reject) => {
            delete_transaction.oncomplete = function () {
                console.log("ALL DELETE TRANSACTIONS COMPLETE.");
                resolve(true);
            }

            delete_transaction.onerror = function () {
                console.log("PROBLEM DELETE RECORDS.")
                resolve(false);
            }

            objectStore.delete(platform);
        });
    }
}


processorDict = {
    'twitter': twitterProcessor,
    'facebook': facebookProcessor,
    'linkedin': linkedinProcessor
}

function linkedinProcessor(args){
    console.log(args)
}


async function twitterProcessor(args){
    var userName = args['username']
    const name = 'screen_name'
    const location = '"location' // ' " ' at the start is to avoid other location fields 
    const response = await fetch('https://twitter.com/'+userName)
    const elements = [name, location]
    var text =  (await response.text()).toString()

    elements.forEach(element => {
        
        var index = text.search(element)
        if (index != -1){
            var userName = text.slice(index+element.length,-1)
            userName = userName.split('"')
            console.log(userName[2])
        }   
         
    });
}

async function facebookProcessor(args){
    console.log(args)
}


chrome.webNavigation.onCompleted.addListener(async function (args) {
    var url = args.url 
    const cookies =  await chrome.cookies.getAll({ url })
    if(cookies){
        console.log(cookies)
    }
    console.log(url)

    
  });
  


chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log(msg)
    var platform = msg['platform']
    processorDict[platform](msg['args']) // TODO return some value and push said value to db
    sendResponse("Recived the content");
});
