//import { jsPDF } from "jspdf";

// this will be the PouchDB database
var db = new PouchDB('shopping');

// template shopping list object
const sampleShoppingList = {
  "_id": "",
  "type": "list",
  "version": 1,
  "title": "",
  "checked": false,
  "tags": [],
  "date": "",
  "place": {
    "title": "",
    "license": null,
    "lat": null,
    "lon": null,
    "address": {}
  },
  "createdAt": "",
  "updatedAt": ""
};

// template shopping list item object
const sampleListItem = {
  "_id": "",
  "type": "item",
  "version": 1,
  "title": "",
  "tags": [],
  "checked": false,
  "createdAt": "",
  "updatedAt": "",
  "isGalleryOpen": false,
  "images": [],
};

const alphabetically = (a, b) => {
  if (a.title < b.title) return -1;
  if (a.title > b.title) return 1;
  return 0;
}

const unalphabetically = (a, b) => {
  if (a.title > b.title) return -1;
  if (a.title < b.title) return 1;
  return 0;
}

/**
 * Sort comparison function to sort an object ascending by "createdAt" field
 *
 * @param  {String} a
 * @param  {String} b
 * @returns {Number}
 */
const newestFirst = (a, b) => {
  if (a.createdAt > b.createdAt) return -1;
  if (a.createdAt < b.createdAt) return 1;
  return 0 
};

/**
 * Sort comparison function to sort an object descending by "createdAt" field
 *
 * @param  {String} a
 * @param  {String} b
 * @returns {Number}
 */
const oldestFirst = (a, b) => {
  if (a.createdAt < b.createdAt) return -1;
  if (a.createdAt > b.createdAt) return 1;
  return 0;
};

/**
 * Perform an "AJAX" request i.e call the URL supplied with the 
 * a querystring constructed from the supplied object
 *
 * @param  {String} url 
 * @param  {Object} querystring 
 * @returns {Promise}
 */
const ajax = function (url, querystring) {
  return new Promise(function(resolve, reject) {

    // construct URL
    var qs = [];
    for(var i in querystring) { qs.push(i + '=' + encodeURIComponent(querystring[i]))}
    url = url + '?' + qs.join('&');

    // make HTTP GET request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          var obj = JSON.parse(xmlhttp.responseText);
          resolve(obj);
        } else {
          reject(null);
        }
      }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  });
};

// Vue Material plugin
Vue.use(VueMaterial);

// Vue Material theme
Vue.material.registerTheme('default', {
  primary: 'blue',
  accent: 'white',
  warn: 'red',
  background: 'grey'
});

// this is the Vue.js app. It contains
// el - the HTML element where the app is rendered
// data - the data the app needs to be rendered
// computed - derived data required for the display logic
// method - JavaScript functions
var app = new Vue({
  el: '#app',
  data: {
    mode: 'showlist',
    pagetitle: 'Shopping Lists',
    shoppingLists: [],
    shoppingListItems: [],
    singleList: null,
    currentListId: null,
    newItemTitle:'',
    places: [],
    tagInput: '',
    selectedPlace: null,
    syncURL:'',
    syncStatus: 'notsyncing',
    sortOrder: 'asc',
    sortType: 'date'
    },
  // computed functions return data derived from the core data.
  // if the core data changes, then this function will be called too.
  computed: {
    /**
     * Calculates the counts of items and which items are checked
     * grouped by shopping list
     * 
     * @returns {Object}
     */
    counts: function() {
      var obj = {};
      // count #items and how many are checked
      for(var i in this.shoppingListItems) {
        var d = this.shoppingListItems[i];
        if (!obj[d.list]) {
          obj[d.list] = { total: 0, checked: 0};
        }
        obj[d.list].total++;
        if (d.checked) {
          obj[d.list].checked++;
        }
      }
      return obj;
    },
    /**
     * Calculates the shopping list but sorted into
     * date order - newest first
     * 
     * @returns {Array}
     */
    sortedShoppingLists: function() {
      return this.shoppingLists.sort(newestFirst);
    },
    /**
     * Calculates the shopping list items but sorted into
     * date order - newest first
     * 
     * @returns {Array}
     */
    sortedShoppingListItems: function() {
      if (this.sortType === 'date') {
        return this.shoppingListItems.sort(this.sortOrder === 'asc' ? oldestFirst : newestFirst);
      }
      return this.shoppingListItems.sort(this.sortOrder === 'asc' ? alphabetically : unalphabetically);
    },
  },
  /**
   * Called once when the app is first loaded
   */
  created: function() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
  
    if (dataParam) {
      try {
        const compressed = atob(decodeURIComponent(dataParam)); // Base64 dekodieren
        const decompressed = pako.inflate(compressed, { to: 'string' }); // Dekomprimieren
        const data = JSON.parse(decompressed);
  
        this.singleList = data.list;
        this.shoppingListItems = data.items;
        this.currentListId = this.singleList._id;
        this.mode = 'itemedit'; // Wechsel direkt zur Bearbeitungsansicht
      } catch (e) {
        console.error('Error decoding data: ', e);
      }
    } else {
      this.loadInitialData(); // Normales Laden der Daten
    }
  },
  
  
  // Extrahierte Methode für Datenladung aus der DB
  
  methods: {
    duplicateList: function(listId) {
      const listIndex = this.shoppingLists.findIndex(list => list._id === listId);
      if (listIndex !== -1) {
        const newList = JSON.parse(JSON.stringify(this.shoppingLists[listIndex])); // Tiefenkopie der Liste
        newList._id = 'list:' + cuid(); // Generiere eine neue ID für die kopierte Liste
        newList.createdAt = new Date().toISOString();
        newList.updatedAt = new Date().toISOString();
        delete newList._rev; // Entferne die alte _rev Property, da es eine neue Dokumentation ist
    
        db.put(newList).then((result) => {
          this.shoppingLists.push(newList);
          console.log('Liste wurde erfolgreich dupliziert:', result);
        }).catch((error) => {
          console.error('Fehler beim Duplizieren der Liste:', error);
        });
      } else {
        console.error('Liste nicht gefunden:', listId);
      }
    },
    
    openGallery(itemId) {
      this.loadImagesForItem(itemId);
      this.isGalleryOpen = true;
    },
    loadImagesForItem(itemId) {
      const item = this.shoppingListItems.find(item => item._id === itemId);
      if (item && item.images) {
        this.images = item.images.map(imageUrl => ({
          url: imageUrl,
          alt: `Bild für ${item.title}`
        }));
      } else {
        this.images = [];  // Setze die Bilder auf ein leeres Array, wenn keine Bilder gefunden wurden
        console.error('Keine Bilder gefunden für:', itemId);
      }
    },
    handleFileUpload: function(event, itemId) {
      const file = event.target.files[0]; // Zugriff auf die Datei aus dem Input-Feld
      this.uploadImage(file, itemId); // Aufruf der Upload-Funktion
    },

    uploadImage: async function(file, itemId) {
      if (!file) return;
    
      // Load the AWS SDK and configure credentials and region
      
      AWS.config.update({
        accessKeyId: 'rtT6GTjVmeZh3OwmyvKi',
        secretAccessKey: 'Gf3cMUv77m5h9iHbnGTw51AiGvTxa7tlmK9ElZuu',
        region: 'eu' // This needs to match your bucket's region, even if it's a local MinIO setup
      });
    
      const s3 = new AWS.S3({
        endpoint: 'http://localhost:9000', // Your MinIO server endpoint
        s3ForcePathStyle: true, // Needed for MinIO to work correctly
        signatureVersion: 'v4' // Use AWS Signature Version 4
      });
    
      const params = {
        Bucket: 'shopping-list-images', // Your bucket name
        Key: itemId, // Filename to save as in the bucket
        Body: file,
        ACL: 'public-read' // Optional: Set the ACL policy if needed
      };
    
      try {
        const data = await s3.upload(params).promise();
        console.log('Image uploaded successfully', data);
        
      } catch (err) {
        console.error('Failed to upload image', err);
      }
    },
    

    generateShareLink: function(listId) {
      const list = this.shoppingLists.find(list => list._id === listId);
      const items = this.shoppingListItems.filter(item => item.list === listId);
      const data = { list: list, items: items };
      const strData = JSON.stringify(data);
    
      // Komprimieren der Daten
      const compressed = pako.deflate(strData, { to: 'string' });
      const base64 = btoa(compressed); // Konvertieren zu Base64
    
      const baseUrl = window.location.href.split('?')[0];
      const shareUrl = `${baseUrl}?data=${encodeURIComponent(base64)}`;
    
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    },
    

    loadInitialData: function() {
      db.createIndex({ index: { fields: ['type'] }}).then(() => {
        var q = { selector: { type: 'list' } };
        return db.find(q);
      }).then((data) => {
        this.shoppingLists = data.docs;
        var q = { selector: { type: 'item' } };
        return db.find(q);
      }).then((data) => {
        this.shoppingListItems = data.docs;
        return db.get('_local/user');
      }).then((data) => {
        this.syncURL = data.syncURL;
        this.startSync();
      }).catch((e) => {});
    },

    toggleDarkMode() {
      var element = document.body;
      element.classList.toggle("dark-mode");
    },  
    toggleSortType() { 
      this.sortType = this.sortType === 'date' ? 'alphabetical' : 'date'; // Ändere den Sortiermodus
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'; // Ändere den Sortiermodus
    },

    /**
     * Called when the user clicks the "Download PDF" button. This function
     * creates a new instance of jsPDF and loops through the shopping lists
     * adding the title, date and place to the PDF. The PDF is then saved
     * to the user's device.
    */
   
    onClickDownloadPDF() {
      const doc = new jsPDF();
    
      const lineHeight = 10;
      let currentY = 10;
    
      this.shoppingLists.forEach((list, index) => {
        doc.text(10, currentY, `Title: ${list.title}`);
        doc.text(10, currentY + lineHeight, `Execution Date: ${list.date}`);
        doc.text(10, currentY + 2 * lineHeight, `Place: ${list.place.title}`);

        if (list.tags.length > 0) {
          doc.text(10, currentY + 3 * lineHeight, `Tags: ${list.tags.join(', ')}`);
        }

        doc.text(10, currentY + 4 * lineHeight, 'Items:')
    
        currentY += 5 * lineHeight;
    
        this.shoppingListItems.forEach((item) => {
          if (item.list === list._id) {
            doc.text(20, currentY, `${item.title}`);
            currentY += lineHeight;
          }
        });
    
        doc.text(10, currentY, '------------------------------------------');
    
        currentY += lineHeight;
      });
    
      doc.save('shopping_lists.pdf');
    },
    

    /**
     * Checks if date is in the past
     * @param {*} date 
     * @returns true/false
     */
    isDateInPast(date) {
      if (!date) return false; // Return false if date is not set
      const currentDate = new Date(); // Get current date
      const inputDate = new Date(date); // Parse input date
      return inputDate < currentDate; // Compare dates
    },
    /**
     * Called when the settings button is pressed. Sets the mode
     * to 'settings' so the Vue displays the settings panel.
     */
    onClickSettings: function() {
      this.mode = 'settings';
    },
    /**
     * Called when the about button is pressed. Sets the mode
     * to 'about' so the Vue displays the about panel.
     */
    onClickAbout: function() {
      this.mode = 'about';
    },    
    /**
     * Saves 'doc' to PouchDB. It first checks whether that doc
     * exists in the database. If it does, it overwrites it - if
     * it doesn't, it just writes it. 
     * @param {Object} doc
     * @returns {Promise}
     */
    saveLocalDoc: function(doc) {
      return db.get(doc._id).then((data) => {
        doc._rev = data._rev;
        return db.put(doc);
      }).catch((e) => {
        return db.put(doc);
      });
    },
    /**
     * Called when save button on the settings panel is clicked. The
     * Cloudant sync URL is saved in PouchDB and the sync process starts.
     */
    onClickStartSync: function() {
      var obj = {
        '_id': '_local/user',
        'syncURL': this.syncURL
      };
      this.saveLocalDoc(obj).then( () => {
        this.startSync();
      });
    },
    /**
     * Called when the sync process is to start. Initiates a PouchDB to
     * to Cloudant two-way sync and listens to the changes coming in
     * from the Cloudant feed. We need to monitor the incoming change
     * so that the Vue.js model is kept in sync.
     */
    startSync: function() {
      this.syncStatus = 'notsyncing';
      if (this.sync) {
        this.sync.cancel();
        this.sync = null;
      }
      if (!this.syncURL) { return; }
      this.syncStatus = 'syncing';
      this.sync = db.sync(this.syncURL, {
        live: true,
        retry: false
      }).on('change', (info) => {
        // handle change
        // if this is an incoming change
        if (info.direction == 'pull' && info.change && info.change.docs) {
          
          // loop through all the changes
          for(var i in info.change.docs) {
            var change = info.change.docs[i];
            var arr = null;

            //console.log(change)

            // see if it's an incoming item or list or something else
            if (change._id.match(/^item/)) {
              arr = this.shoppingListItems;
            } else if (change._id.match(/^list/)) {
              arr = this.shoppingLists;
            } else {
              continue;
            }

            // locate the doc in our existing arrays
            var match = this.findDoc(arr, change._id);

            // fetch eventual conflicts
            log = db.get(change._id, { conflicts: true }).then((data) => {
              console.log('Eventual Conflicts (Only if old revisions will be printed):');
              console.log(data);

              // print losing revisions
              for (var rev in data._conflicts) {
                db.get(change._id, { rev: data._conflicts[rev] }).then((res) => {
                  console.log('Losing revision:');
                  console.log(res);
                });
              }
            });

            // if we have it already 
            if (match.doc) {
              // and it's a deletion
              if (change._deleted == true) {
                // remove it
                arr.splice(match.i, 1);
              } else {

              /*
              if (change.version < this.match.version) {
                console.log('conflict, older version' + this.change.version + ': ');
                console.log(change);
              } else if (change.version > this.match.version) {
                console.log('conflict, older version' + this.match.version + ': ');
                console.log(this.match);
                } else {
                  console.log('no conflict');
                }*/

                // modify it
                delete change._revisions;
                Vue.set(arr, match.i, change);
              }
            } else {
              // add it
              if (!change._deleted) {
                arr.unshift(change);
              }
            }
          }
        }
      }).on('error', (e) => {
        this.syncStatus = 'syncerror';
      }).on('denied', (e) => {
        this.syncStatus = 'syncerror';
      }).on('paused', (e) => {
        if (e) {
          this.syncStatus = 'syncerror';
        }
      });;
    },

    /**
     * Given a list of docs and an id, find the doc in the list that has
     * an '_id' (key) that matches the incoming id. Returns an object 
     * with the 
     *   i - the index where the item was found
     *   doc - the matching document
     * @param {Array} docs
     * @param {String} id
     * @param {String} key
     * @returns {Object}
     */
    findDoc: function (docs, id, key) {
      if (!key) {
        key = '_id';
      }
      var doc = null;
      for(var i in docs) {
        if (docs[i][key] == id) {
          doc = docs[i];
          break;
        }
      }
      return { i: i, doc: doc };
    },

    /**
     * Given a list of docs and an id, find the doc in the list that has
     * an '_id' (key) that matches the incoming id. Updates its "updatedAt"
     * attribute and write it back to PouchDB.
     *   i - the index where the item was found
     *   doc - the matching document
     * @param {Array} docs
     * @param {String} id

     */
    findUpdateDoc: function (docs, id) {

      // locate the doc
      var doc = this.findDoc(docs, id).doc;

      // if it exits
      if (doc) {
        
        // modift the updated date
        doc.updatedAt = new Date().toISOString();

        // write it on the next tick (to give Vue.js chance to sync state)
        this.$nextTick(() => {

          // write to database
          db.put(doc).then((data) => {

            // retain the revision token
            doc._rev = data.rev;
          });
        });
      }
    },

    /**
     * Called when the user clicks the Add Shopping List button. Sets
     * the mode to 'addlist' to reveal the add shopping list form and
     * resets the form variables.
     */
    onClickAddShoppingList: function() {

      // open shopping list form
      this.singleList = JSON.parse(JSON.stringify(sampleShoppingList));
      this.singleList._id = 'list:' + cuid();
      this.singleList.createdAt = new Date().toISOString();
      this.pagetitle = 'New Shopping List';
      this.places = [];

      this.selectedPlace = null;
      this.mode='addlist';
    },

    /**
     * Called when the Save Shopping List button is pressed.
     * Writes the new list to PouchDB and adds it to the Vue 
     * model's shoppingLists array
     */
    onClickSaveShoppingList: function() {

      // add timestamps
      this.singleList.updatedAt = new Date().toISOString();

      // add to on-screen list, if it's not there already
      if (typeof this.singleList._rev === 'undefined') {
        this.shoppingLists.unshift(this.singleList);
      }
      
      this.singleList.tags = this.tagInput.split(',').map(tag => tag.trim())
      //console.log(this.singleList);
      // write to database
      db.put(this.singleList).then((data) => {
        // keep the revision tokens
        this.singleList._rev = data.rev;

        // switch mode
        this.onBack();
      });
    },

    /**
     * Called when the Back button is pressed. Returns to the
     * home screen with a lit of shopping lists.
     */
    onBack: function() {
      this.mode='showlist';
      this.pagetitle='Shopping Lists';
    },

    /**
     * Called when the Edit button is pressed next to a shopping list.
     * We locate the list document by id and change mode to "addlist",
     * pre-filling the form with that document's details.
     * @param {String} id
     * @param {String} title
     */
    onClickEdit: function(id, title) {
      this.singleList = this.findDoc(this.shoppingLists, id).doc;
      this.pagetitle = 'Edit - ' + title;
      this.places = [];
      this.selectedPlace = null;
      this.mode='addlist';
    },

    /**
     * Called when the delete button is pressed next to a shopping list.
     * The shopping list document is located, removed from PouchDB and
     * removed from Vue's shoppingLists array.
     * @param {String} id
     */
    onClickDelete: function(id) {
      var match = this.findDoc(this.shoppingLists, id);
      db.remove(match.doc).then(() => {
        this.shoppingLists.splice(match.i, 1);
      });
    },

    // the user wants to see the contents of a shopping list
    // we load it and switch views
    /**
     * Called when the user wants to edit the contents of a shopping list.
     * The mode is set to 'itemedit'. Vue's currentListId is set to this list's
     * id field.
     * @param {String} id
     * @param {String} title
     */
    onClickList: function(id, title) {
      this.currentListId = id;
      this.pagetitle = title;
      this.mode = 'itemedit';
    },

    /**
     * Called when a new shopping list item is added. A new shopping list item
     * object is created with a unique id. It is written to PouchDB and added
     * to Vue's shoppingListItems array
     */
    onAddListItem: function() {
      if (!this.newItemTitle) return;
      if (this.itemTagin && this.itemTagin.length > 35) return; 
      var obj = JSON.parse(JSON.stringify(sampleListItem));
      obj._id = 'item:' + cuid();
      obj.title = this.newItemTitle;
      obj.list = this.currentListId;
      if (this.itemTagin) {
        obj.tags = this.itemTagin.split(',').map(tag => tag.trim())
      }
      obj.createdAt = new Date().toISOString();
      obj.updatedAt = new Date().toISOString();
      //this.singleList.version = this.singleList.version + 1;
      db.put(obj).then( (data) => {
        obj._rev = data.rev;
        this.shoppingListItems.unshift(obj);
        this.newItemTitle = '';
        this.itemTagin = '';
      });
      
      //console.log(this.singleList.version);
      //console.log(this.singleList);

      db.put(this.singleList).then((data) => {
        // keep the revision tokens
        this.singleList._rev = data.rev;

        // switch mode
        //this.onBack();
      });
      
    },

    /**
     * Called when an item is checked or unchecked from a shopping list.
     * The item is located and written to PouchDB
     * @param {String} id
     */
    onCheckListItem: function(id) {
      this.findUpdateDoc(this.shoppingListItems, id);
      // this.singleList.version = this.singleList.version + 1;
      db.put(this.singleList).then((data) => {
        // keep the revision tokens
        this.singleList._rev = data.rev;

        // switch mode
        //this.onBack();
      });
    },

    /**
     * Called when the Lookup button is pressed. We make an API call to 
     * OpenStreetMap passing in the user-supplied name of the place. If
     * the API returns something, the options are added to Vue's "places"
     * array and become a pull-down list of options on the front end.
     */
    onClickLookup: function() {

      // make request to the OpenStreetMap API
      var url = 'https://nominatim.openstreetmap.org/search';
      var qs = {
        format: 'json',
        addressdetails: 1, 
        namedetails: 1,
        q: this.singleList.place.title
      };
      ajax(url, qs).then((d) => {

        // add the list of places to our list
        this.places = d;

        // if there is only one item in the list
        if (d.length ==1) {
          // simulate selection of first and only item
          this.onChangePlace(d[0].place_id);
        }
      });

    },

    // when a place is selected from the list, we find the object in the list
    // and copy the lat/long, licence and name over to our database
    /**
     * Called when an item is selected from the places pull-down list. The
     * place is found in the "places" array and its lat/long, licnece and 
     * address are moved to the Vue object linked with the front-end form.
     * @param {String} v
     */
    onChangePlace: function(v) {
      var doc = this.findDoc(this.places, v, 'place_id').doc;
      this.singleList.place.lat = doc.lat;
      this.singleList.place.lon = doc.lon;
      this.singleList.place.license = doc.licence;
      this.singleList.place.address = doc.address;
     },

    /**
     * Called when an item is deleted from a shopping list. We locate the item
     * in the list, delete it from PouchDB and remove it from the shoppingListItems
     * Vue array.
     * @param {String} id
     */
     onDeleteItem: function(id) {
       var match = this.findDoc(this.shoppingListItems, id);
       db.remove(match.doc).then((data) => {
         this.shoppingListItems.splice(match.i, 1);
       });

       // this.singleList.version = this.singleList.version + 1;
      db.put(this.singleList).then((data) => {
        // keep the revision tokens
        this.singleList._rev = data.rev;

        // switch mode
        //this.onBack();
      });
     }
  }
})