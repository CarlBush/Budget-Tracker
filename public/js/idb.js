let db;

//Budget_Tracker = Name of IndexDB database & 1 = version number.
const request = indexedDB.open("Budget_Tracker", 1);

//Event occurs when version number needs to be changed
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("new_budget", { autoIncrement: true });
}

//Event occurs on success and runs uploadTransaction
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.online) {
        uploadTransaction();
    };
};

//Event occurs on error and return error code
request.onerror = function (event) {
    console.log(event.target.errorCode);
};

//Function used in js/index.js
function saveRecord(transactionData) {
    const transaction = db.transaction(["new_budget"], "readwrite");
    const budgetObjectStore = transaction.objectStore("new_budget");
    budgetObjectStore.add(transactionData);
};

//Collects all the data from "new_budget" and POSTs to the server
function uploadTransaction() {
    const transaction = db.transaction(["new_budget"], "readwrite");
    const budgetObjectStore = transaction.objectStore("new_budget");
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type" : "application/json"
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(["new_budget"], "readwrite");
                const budgetObjectStore = transaction.objectStore("new_budget");
                budgetObjectStore.clear();
                alert("Budget has been submitted");
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
};

window.addEventListener("online", uploadTransaction);