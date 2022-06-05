let db;

//Budget_Tracker = Name of IndexDB database & 1 = version number.
const request = indexedDB.open("Budget_Tracker", 1);

//Event occurs when version number needs to be changed
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("new_budget", { autoIncrement: true });
}

//Event occrus on success and runs function 
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.online) {
        //function to upload data
    };
};

//Event occurs on error and return error code
request.onerror = function (event) {
    console.log(event.target.errorCode);
};

//Event occrus when submitting data however there is no internet connection
function saveBudget(budgetData) {
    const transaction = db.transaction(["new_budget"], "readwrite");

    const budgetObjectStore = transaction.objectStore("new_budget");
    budgetObjectStore.add(record);
};