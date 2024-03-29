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

        if (posts.length < 1) {
            this.savePosts([{
                "id": "1",
                "title": "Reise nach Stockholm",
                "author": "Anna",
                "land": "Schweden",
                "content": "Hallo liebe Leute, die Reise nach Stockholm war atemberaubend! :)",
                "year": 2019,
            }, {
                "id": "2",
                "title": "Roadtrip entlang der griechischen Küste",
                "author": "Henriette ",
                "land": "Griechenland",
                "content": "Grüß euch Weltenbummler, in diesem Post stelle ich die schönsten Reiseziele entlang der griechischen Küste vor.",
                "year": 2008,
            }, {
                "id": "3",
                "title": "Wochenendausflug nach Paris",
                "author": "Leonie",
                "land": "Frankreich",
                "content": "Hallo Freunde der Reiselust, heute berichte ich euch von meinem Wochenendausflug in die Stadt der Liebe.",
                "year": 2019,
            }, {
                "id": "4",
                "title": "Kulinarische Genüsse in Rom",
                "author": "Leonie",
                "land": "Italien",
                "content": "Ciao amici, kennt ihr schon die 10 besten Restaurants in ganz Rom?",
                "year": 2019,
            }, {
                "id": "5",
                "title": "Roadtrip durch die USA",
                "author": "Henriette",
                "land": "Amerika",
                "content": "Heey friends, der Roadtrip entlang der Route 66 war LIFECHANGING!",
                "year": 2019,
            }, {
                "id": "6",
                "title": "Begegnung mit einer Geisha in Kyoto",
                "author": "Anna",
                "land": "Japan",
                "content": "Hallo Freunde, in diesem Post berichte ich über meine Erlebnnisse in der ehemaligen, japanischen Hauptstadt Kyoto.",
                "year": 2019,
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
        let result = await this._posts.orderBy("title").get();
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
     * Speichert ein einzelnes Buch in der Datenbank. Das hierfür übergebene
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
     * @param books: Zu speicherndes Buch-Objekt
     */
    savePost(post) {
        this._posts.doc(post.id).set(post);
    }

    /**
     * Löscht ein einzelnes Buch aus der Datenbank.
     * @param id: ID des zu löschenden Buches
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async deletePostById(id) {
        return this._posts.doc(id).delete();
    }

    /**
     * Speichert die übergebenen Bücher in der Datenbank. Die hier übergebene
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
     * Löscht eines oder mehrerer Bücher aus der Datenbank.
     * @param ids: Liste der IDs der zu löschenden Bücher
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
}