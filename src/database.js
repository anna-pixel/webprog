"use strict";

/**
 * Zentrale Klasse für alle Datenbazugriffe. Diese Klasse versteckt die
 * Einzelheiten der Firebase-Datenbank vor dem Rest der Anwendung, indem
 * sie für alle benötigten Datenbankzugriffe eine Methode definiert, in der
 * der Zugriff auf Firebase ausprogrammiert wurde.
 *
 * Vgl. https://firebase.google.com/docs/firestore?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 */
class Database {
    /**
     * Konstruktor. Hier wird die Verbindung zur Firebase-Datenbank
     * hergestellt.
     *
     * Vgl. https://firebase.google.com/docs/firestore/quickstart
     */
    constructor() {
        // Diese Informationen müssen aus der Firebase-Konsole ermittelt
        // werden, indem dort ein neues Projekt mit einer neuen Datenbank
        // angelegt und diese dann mit einer neuen App verknüpft wird.
        firebase.initializeApp({
            apiKey: "AIzaSyCpuC3Bx2tT5ZtF0jOBgSQ4ieuzcitwjyg",
            authDomain: "webprog-reiseblog.firebaseapp.com",
            databaseURL: "https://webprog-reiseblog.firebaseio.com",
            projectId: "webprog-reiseblog",
            storageBucket: "webprog-reiseblog.appspot.com",
            messagingSenderId: "647753401931",
            appId: "1:647753401931:web:dbda6e0aa65c658c346fce"
        });

        // Dieses Objekt dient dem eigentlichen Datenbankzugriff.
        // Dabei können beliebig viele "Collections" angesprochen werden,
        // die in etwa den Tabellen einer klassischen Datenbank entsprechen.
        this._db = firebase.firestore();
        this._posts = this._db.collection("posts");
        this._countries = this._db.collection("countries");
    }

    /**
     * Hilfsfunktion zum Anlegen von Demodaten. Die Daten werden nur angelegt,
     * wenn die Collection komplett leer ist.
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    /*async createDemoData() {
        // Demo-Länder anlegen
        let countries = await this.selectAllCountries();

        if (countries.length < 1) {
            this.saveCountries([{
                "id": "FR",
                "name": "Frankreich",
                "img": "http://www.all-free-photos.com/images/chateaux-4/PI5987-hr.jpg",
            }, {
                "id": "DE",
                "name": "Deutschland",
                "img": "http://www.all-free-photos.com/images/berlin/PI88750-hr.jpg",
            }, {
                "id": "SE",
                "name": "Schweden",
                "img": "http://www.all-free-photos.com/images/berlin/PI88750-hr.jpg",
            }, {
                "id": "GR",
                "name": "Griechenland",
            }, {
                "id": "IT",
                "name": "Italien",
            }, {
                "id": "US",
                "name": "Amerika",
            }, {
                "id": "JP",
                "name": "Japan",
            }, {
                "id": "AUS",
                "name": "Australien",
            }, {
                "id": "CA",
                "name": "Kanada",
            }, {
                "id": "SA",
                "name": "Südafrika",
            }, {
                "id": "MA",
                "name": "Mauritus",
            }, {
                "id": "NA",
                "name": "Namibia",
            }, {
                "id": "CNA",
                "name": "China",
            },{
                "id": "IND",
                "name": "Indien",
            },{
                "id": "SC",
                "name": "Südkorea",
            },{
                "id": "NL",
                "name": "Niederlande",
            }
            ]);
        }*/

        // Demo-Blogbeiträge anlegen
        /*let posts = await this.selectAllPosts();

        if (posts.length < 1) {
            this.savePosts([{
                "id": "1",
                "title": "Reise nach Stockholm",
                "author": "Anna",
                "land": "SE",
                "content": "Hallo liebe Leute, die Reise nach Stockholm war überwältigend! :)",
                "year": 2019,
            }, {
                "id": "2",
                "title": "Roadtrip entlang der griechischen Küste",
                "author": "Henriette ",
                "land": "GR",
                "content": "Grüß euch Weltenbummler, in diesem Post stelle ich euch die schönsten Reiseziele entlang der griechischen Küste vor.",
                "year": 2008,
            }, {
                "id": "3",
                "title": "Wochenendausflug nach Paris",
                "author": "Leonie",
                "land": "FR",
                "content": "Hallo Freunde der Reiselust, heute berichte ich euch von meinem Wochenendausflug in die Stadt der Liebe.",
                "year": 2019,
                "img": "http://www.all-free-photos.com/images/chateaux-4/PI5987-hr.jpg",
            }, {
                "id": "4",
                "title": "Kulinarische Genüsse in Rom",
                "author": "Leonie",
                "land": "IT",
                "content": "Ciao amici, kennt ihr schon die 10 besten Restaurants in ganz Rom?",
                "year": 2019,
                "img": "",
            }, {
                "id": "5",
                "title": "Roadtrip durch die USA",
                "author": "Henriette",
                "land": "US",
                "content": "Hey friends, der Roadtrip entlang der Route 66 war LIFECHANGING!",
                "year": 2019,
                "img": "https://www.connections.be/~/media/images/connections/wom/north-america/new-usa/usa-west/route-66/route-66-n-america-usa-straight-road.jpg"
            }, {
                "id": "6",
                "title": "Begegnung mit einer Geisha in Kyoto",
                "author": "Anna",
                "land": "JP",
                "content": "Hallo Freunde, in diesem Post berichte ich über meine Erlebnnisse in der ehemaligen, japanischen Hauptstadt Kyoto.",
                "year": 2019,

            }, {
                "id": "7",
                "title": "Backpacking durch das Outback",
                "author": "Henriette",
                "land": "AUS",
                "content": "EXCITING news from Australia! Wir sind mit dem Rucksack am Uluru gewandert und haben nachts viele Sterne gesehen.",
                "year": 2019,
                "img": "https://www.ozeanien-entdecken.de/img/reisen/Australien__Hoehepunkte_1899_1.jpg",

            }, {
              "id": "8",
              "title": "Genüsse auf dem holländischen Käsemarkt",
              "author": "Leonie",
              "land": "NL",
              "content": "Freunde, ich glaube, ich wandere in das Käseparadies aus!",
              "year": 2019,
              "img": "https://www.kaasmarkt.nl/media/1037/rvf_1078-version-3.jpg?width=1280&height=620&mode=crop",

            }, {
              "id": "9",
              "title": "Ausflug in das südkoreanische Hawaii",
              "author": "Anna",
              "land": "SC",
              "content": "Hallo meine Lieben, habt ihr schon mal von der wunderschönen Insel Jeju und dem Hello-Kitty-Land gehört?",
              "year": 2017,
              "img": "https://static.geo.de/bilder/37/da/68763/article_image_big/jeju-do-island-suedkorea-m-hprn8n.jpg",

            }, {
              "id": "10",
              "title": "Linsendal und Yogastunden am heiligen Ganges",
              "author": "Leonie",
              "land": "SC",
              "content": "Hallo Freunde, falls ihr den Sinn eures Lebens sucht, kann ich euch eine 2-wöchige Reise nach Indien nur wärmstens empfehlen.",
              "year": 2017,
              "img": "http://cdn.simplesite.com/i/ed/80/283163834432717037/i283163839605056616._szw480h1280_.jpg",

            }, {
              "id": "11",
              "title": "Städtetour von Peking nach Shangai",
              "author": "Henriette",
              "land": "CHN",
              "content": "你好 allerseits! Unsere Städtetour von Peking nach Shangai war im wahrsten Sinne atemberaubend!",
              "year": 2018,

            }, {
              "id": "12",
              "title": "Rundreise durch die älteste Wüste der Welt - Namib",
              "author": "Anna-Maria",
              "land": "NA",
              "content": "Liebe Leute, stellt euch vor, ich habe ein echtes Nashorn gesehen!!",
              "year": 2018,
              "img": "https://www.imago-images.de/imagoextern/asp/default/bild.asp?c=x%B7%9Cl%91%5C%84Zg%7F%5CWS%BC%C1k%B6T%9F%A9h%D2%A7%B3%C1%C6",

            }, {
              "id": "13",
              "title": "Seele baumeln lassen an den traumhaften Stränden Mauritus",
              "author": "Leonie",
              "land": "MA",
              "content": "Hallo Freunde, sehnt ihr euch auch bei diesen winterlichen Temperaturen nach Urlaub in der Südsee?",
              "year": 2017,
              "img": "https://picture.yatego.com/images/5bec4787bb8692.7/big_9fca6038acdc7ead8b2353f2237e625c-kqh/strand-hngematte-beach-meer-palmen-wandtattoo-wandsticker-wandaufkleber-r0222.jpg",

            }, {
              "id": "14",
              "title": "Kapstadt ist die schönste Stadt der Welt!",
              "author": "Henriette",
              "land": "SA",
              "content": "Seid gegrüst, ihr Reiselustigen. Nachdem ich schon viele Städte der Welt kennnen lernen durfte, kann ich euch heute meinen absoulten Favorit vorstellen.",
              "year": 2017,
              "img": "https://globusliebe.com/wp-content/uploads/2017/05/Kapstadt-Urlaub-Tipps.jpg",  

            }, {
              "id": "15",
              "title": "Museumstour in Vancouver",
              "author": "Anna-Maria",
              "land": "CA",
              "content": "Servus ihr Lieben, seid ihr interessiert an Kunst, Wissenschaft und Botanik? Dann seid ihr in Vancouver mit seinen zahlreichen Museen genau richtig!",
              "year": 2017,
              "img": "https://www.faszination-kanada.com/wp-content/uploads/2018/03/2_VAG-Landon-Mackenzie-100.jpg",


            }]);
        }
    }*/
    /**
     * Gibt alle in der Datenbank gespeicherten Posts zurück. Hier gilt
     * dasselbe wie im Kommentar zur Methode createDemoData() geschrieben.
     * Alle Dokumente auf einmal auszulesen ist nur dann eine gute Idee,
     * wenn man weiß, dass es nicht viele geben kann. Besser wäre daher,
     * die Menge mit der where()-Funktion von Firebase einzuschränken.
     *
     * @returns Promise-Objekt mit den gespeicherten Posts
     */
    async selectAllPosts() {
        let result = await this._posts.orderBy("year").get();
        let posts = [];

        result.forEach(entry => {

                let post = entry.data();
                posts.push(post);

        });

        return posts;
    }

    /**
     * Alle vorhanden Länder auslesen.
     * @returns {Promise<[]>}
     */
    async selectAllCountries() {
        let result = await this._countries.orderBy("name").get();
        let countries = [];

        result.forEach(entry => {
            let country = entry.data();
            countries.push(country);
        });

        return countries;
    }

    /**
     * Gibt ein einzelnen Post anhand seiner ID zurück.
     * @param id: ID des gesuchten Posts
     * @returns Promise-Objekt mit dem gesuchten Posts
     */
    async selectPostById(id) {
        let result = await this._posts.doc(id).get();
        return result.data();
    }

    /**
     * Gibt ein einzelnes Country anhand seiner ID zurück.
     * @param id: ID des gesuchten Country
     * @returns Promise-Objekt mit dem gesuchten County
     */
    async selectCountryById(id) {
        let result = await this._countries.doc(id).get();
        return result.data();
    }

    /**
     * Speichert einzelnen Post in der Datenbank.
     * @param post: Zu speicherndes Post-Objekt
     */
    savePost(post) {
        let saved = true;
        this._posts.add(post).catch(function(error){
            saved = false;
        });
        return saved;
    }
    /**
     * Speichert einzelnes Country in der Datenbank.
     * @param country: Zu speicherndes Country-Objekt
     */
    saveCountry(country) {
        this._countries.doc(country.id).set(country);

    }

    /**
     * Löscht ein einzelnen Post aus der Datenbank.
     * @param id: ID des zu löschenden Posts
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async deletePostById(id) {
        return this._posts.doc(id).delete();
    }
    /**
     * Löscht ein einzelnes Country aus der Datenbank.
     * @param id: ID des zu löschenden Country
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async deleteCountryById(id) {
        return this._countries.doc(id).delete();
    }

    /**
     * Speichert die übergebenen Posts in der Datenbank.
     * @param posts: Liste mit den zu speichernden Objekten
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async savePosts(posts) {
        let batch = this._db.batch();

        posts.forEach(post => {
            let dbPost = this._posts.doc(post.id);
            batch.set(dbPost, post);
        });

        return batch.commit();
    }
    /**
     * Speichert die übergebenen Countries in der Datenbank.
     * @param countries: Liste mit den zu speichernden Objekten
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async saveCountries(countries) {
        let batch = this._db.batch();

        countries.forEach(country => {
            let dbCountry = this._countries.doc(country.id);
            batch.set(dbCountry, country);
        });

        return batch.commit();
    }

    /**
     * Löscht ein oder mehrerer Posts aus der Datenbank.
     * @param ids: Liste der IDs der zu löschenden Posts
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async deletePostsById(ids) {
        let batch = this._db.batch();

        ids.forEach(id => {
            let dbPost = this._posts.doc(id);
            batch.delete(dbPost);
        });

        return batch.commit();
    }
    /**
     * Löscht ein oder mehrerer Countries aus der Datenbank.
     * @param ids: Liste der IDs der zu löschenden Countries
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async deleteCountriesById(ids) {
        let batch = this._db.batch();

        ids.forEach(id => {
            let dbCountry = this._countries.doc(id);
            batch.delete(dbCountry);
        });

        return batch.commit();
    }
}
