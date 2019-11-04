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
        *    "Datum": "11.05.2013",
        *    "content": "Es war eine schöne Reise.",
        *    "picture": "img"
        */
        if (posts.length < 1) {
            this.savePosts([{
                "id": "1",
                "title": "Reise nach Stockholm",
                "authors": "Anna-Maria Vater",
                "land": "Schweden",
                "Datum": "24.06.2012",
                "content": "Hallo liebe Leute, die Reise nach Stockholm war atemberaubend! :) "
                /** "picture:"https://upload.wikimedia.org/wikipedia/commons/c/c3/Stockholm.jpg" */
            },{
                "id": "2",
                "title": "Roadtrip entlang der griechischen Küste",
                "authors": "Henriette Wien",
                "land": "Griechenland",
                "Datum": "12.10.2015",
                "content": "Grüß euch Weltenbummler, in diesem Post stelle ich die schönsten Reiseziele entlang der grichischen Küste vor. "
              /**  "picture:"https://upload.wikimedia.org/wikipedia/commons/6/6e/Ionian_sea_islands%2C_pic1.JPG" */
            },{
                "id": "3",
                "title": "Wochenendausflug nach Paris",
                "authors": "Leonie Neis",
                "land": "Frankreich",
                "Datum": "14.02.2008",
                "content": "Hallo Freunde der Reiselust, heute berichte ich euch von meinem Wochenendausflug in die Stadt der Liebe. "
                /** "picture:"https://upload.wikimedia.org/wikipedia/de/c/cf/Paris_Montage_Ancient_and_Modern.png" */
            },{
                "id": "4",
                "title": "Kulinarische Genüsse in Rom",
                "authors": "Leonie Neis",
                "land": "Italien",
                "Datum": "05.08.2016",
                "content": "Ciao amici, kennt ihr schon die 10 besten Restaurants in ganz Rom?"
              /**  "picture:"https://upload.wikimedia.org/wikipedia/commons/a/ae/Pasta-Herstellung.jpg" */
            },{
                "id": "5",
                "title": "Roadtrip durch die USA",
                "authors": "Henriette Wien",
                "land": "Amerika",
                "Datum": "15.09.2017",
                "content": "Heey friends, der Roadtrip entlang der Route 66 war LIFECHANGING! "
                /** "picture:"https://upload.wikimedia.org/wikipedia/commons/1/11/Route66_2004.jpg" */
            },{
                "id": "6",
                "title": "Begegnung mit einer Geisha in Kyoto ",
                "authors": "Anna-Maria Vater",
                "land": "Japan",
                "Datum": "25.11.2018",
                "content": "Hallo Freunde, in diesem Post berichte ich über meine Erlebnnisse in der ehemaligen, japanischen Hauptstadt Kyoto."
                /**"picture:"https://upload.wikimedia.org/wikipedia/commons/f/f0/150124_At_Yasakakamimachi_Kyoto_Japan01n.jpg */
            }]);
        }
    }
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
        let result = await this._posts.orderBy("id").get();
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
     *          "id": "nummer",
     *          "title": "Titel des Posts",
     *          "authors": "Name des Autors",
     *          "land": "Name des Landes",
     *          "Datum": "Datum der Reise",
     *          "content": "Text des Posts",
     *          "picture": "img"                momentan noch auskommentiert!!!
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
     */
    async deletePostById(id) {
        return this._posts.doc(id).delete();
    }

    /**
     * Speichert die übergebenen Posts in der Datenbank. Die hier übergebene
     * Liste sollte folgenden Aufbau haben:
     *
     *      [
     *          {
     *              "id": "nummer",
     *              "title": "Titel des Posts",
     *              "authors": "Name des Autors",
     *              "land": "Name des Landes",
     *              "Datum": "Datum der Reise",
     *              "content": "Text des Posts",
     *              "picture": "img"                momentan noch auskommentiert!!!
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

    async deletePostsById(ids) {
        let batch = this._db.batch();

        ids.forEach(id => {
            let dbPost = this._posts.doc(id);
            batch.delete(dbPost);
        });

        return batch.commit();
    }
}
