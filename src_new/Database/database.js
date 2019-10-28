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
    }

    /**
     * Hilfsfunktion zum Anlegen von Demodaten. Die Daten werden nur angelegt,
     * wenn die Collection komplett leer ist.
     *
     * Beachte, dass das Auslesen aller Datensätze keine gute Idee ist, weil
     * Firebase für jedes abgerufene Dokument eine Gebühr verlangt, wenn man
     * keinen kostenlosten Account hat. Dummerweise gibt es aber keine einfache
     * Funktion zum Ermitteln der Anzahl Datensätze. Siehe:
     *
     * https://stackoverflow.com/questions/46554091/cloud-firestore-collection-count
     *
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async createDemoData() {
        let posts = await this.selectAllPosts();

        /* DATENSTRUKTUR
        *
        *    "id": "1",
        *    "title": "Reise nach Hamburg",
        *    "authors": "Leonie",
        *    "land": "Dautschland",
        *    "date": "input",
        *    "content": "Es war eine schöne Reise.",
        *    "picture": "img",
        *
        */


        if (posts.length < 1) {
            this.savePosts([{
                "authors": "Peter Pohmann",
                "edition": "1. Auflage",
                "id": "cpp17",
                "publisher": "Entwickler-Press",
                "title": "C++ 17 -- Praxiswissen zum Standard",
                "year": 2017
            }, {
                "authors": "Kyle Loudon; Rainer Grimm",
                "edition": "3. Auflage",
                "id": "cpp-kurz-gut",
                "publisher": "O'Reilly",
                "title": "C++ Kurz & Gut",
                "year": 2018
            }, {
                "authors": "Torsten T. Will",
                "edition": "1. Auflage",
                "id": "cpp-einfuehrung",
                "publisher": "Galileo Computing",
                "title": "Einführung in C++",
                "year": 2015
            }, {
                "authors": "Dietmar Ratz; Dennis Schulmeister-Zimolong; Detlef Seese; Jan Wiesenberger",
                "edition": "8. Auflage",
                "id": "grundkurs-java",
                "publisher": "Hanser-Verlag",
                "title": "Grundkurs Programmieren in Java",
                "year": 2018
            }, {
                "authors": "Dan Lüdtke",
                "edition": "1. Auflage",
                "id": "ip6-workshop",
                "publisher": "Amazon Distribution",
                "title": "IPv6 Workshop",
                "year": 2013
            }, {
                "authors": "Thomas Peschel-Findeisen",
                "edition": "1. Auflage",
                "id": "make-gepackt",
                "publisher": "mitp",
                "title": "make ge-packt",
                "year": 2004
            }]);
        }
    }
    /**
     * Gibt alle in der Datenbank gespeicherten Bücher zurück. Hier gilt
     * dasselbe wie im Kommentar zur Methode createDemoData() geschrieben.
     * Alle Dokumente auf einmal auszulesen ist nur dann eine gute Idee,
     * wenn man weiß, dass es nicht viele geben kann. Besser wäre daher,
     * die Menge mit der where()-Funktion von Firebase einzuschränken.
     *
     * @returns Promise-Objekt mit den gespeicherten Büchern
     */
    async selectAllPosts() {
        let result = await this._posts.orderBy("land").get();
        let posts = [];

        result.forEach(entry => {
            let post = entry.data();
            posts.push(post);
        });

        return posts;
    }

    /**
     * Gibt ein einzelnes Buch anhand seiner ID zurück.
     * @param id: ID des gesuchten Buches
     * @returns Promise-Objekt mit dem gesuchten Buch
     */
    async selectPostById(id) {
        let result = await this._posts.doc(id).get();
        return result.data();
    }

    /**
     * Speichert ein einzelnen Post in der Datenbank. Das hierfür übergebene
     * Objekt sollte folgenden Aufbau haben:
     *
     *      {
     *          id:        "MeinBuch1",
     *          title:     "Name des Buches",
     *          authors:   "Namen der Autoren",
     *          edition:   "8. Auflage",
     *          publisher: "Name des Verlags",
     *          year:      2019,
     *      }
     *
     * @param posts: Zu speicherndes Post-Objekt
     */
    savePost(post) {
        this._posts.doc(post.id).set(post);
    }

    /**
     * Löscht ein einzelnen Post aus der Datenbank.
     * @param id: ID des zu löschenden Posts
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */ /*
    async deletePostById(id) {
        return this._posts.doc(id).delete();
    }*/

    /**
     * Speichert die übergebenen Posts in der Datenbank. Die hier übergebene
     * Liste sollte folgenden Aufbau haben:
     *
     *      [
     *          {
     *              id:        "MeinBuch1",
     *              title:     "Name des Buches",
     *              authors:   "Namen der Autoren",
     *              edition:   "8. Auflage",
     *              publisher: "Name des Verlags",
     *              year:      2019,
     *          }, {
     *              ...
     *          },
     *     ]
     *
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
     * Löscht eines oder mehrerer Posts aus der Datenbank.
     * @param ids: Liste der IDs der zu löschenden Posts
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
     /*
    async deletePostsById(ids) {
        let batch = this._db.batch();

        ids.forEach(id => {
            let dbPost = this._posts.doc(id);
            batch.delete(dbPost);
        });

        return batch.commit();
    }*/
}
