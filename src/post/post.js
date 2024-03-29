"use strict";
let db;
/**
 * Klasse Post: Stellt die BLogbeitrag Erstellung der App zur Verfügung
 */
class Post {
    /**
     * Konstruktor
     * @param {App} app Zentrale Instanz der App-Klasse
     */
    constructor(app) {
        this._app = app;

    }

    /**
     * Seite anzeigen. Wird von der App-Klasse aufgerufen.
     */
    async show() {
        // Anzuzeigenden Seiteninhalt nachladen
        let html = await fetch("post/post.html");
        let css = await fetch("post/post.css");

        if (html.ok && css.ok) {
            html = await html.text();
            css = await css.text();
        } else {
            console.error("Fehler beim Laden des HTML/CSS-Inhalts");
            return;
        }

        // Seite zur Anzeige bringen
        let pageDom = document.createElement("div");
        pageDom.innerHTML = html;

        this._app.setPageTitle("Neuen Post", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageHeader(pageDom.querySelector("header"));
        this._app.setPageContent(pageDom.querySelector("main"));

        let submitBtn = document.getElementById("button-submit");
        submitBtn.addEventListener("click", function (){save();});

        db=this._app;
        // Fertig bearbeitetes HTML-Element zurückgeben
        return pageDom;
    }
}

async function save() {
    let img = document.querySelector("#img").value;
    let e = document.getElementById("land");
    let land = e.options[e.selectedIndex].value;
    let post = {
        "title": document.querySelector("#titel").value,
        "author": document.querySelector("#vorname").value,
        "land": land,
        "content": document.querySelector("#content").value,
        "year": document.querySelector("#jahr").value,
        "img": img
    };

    if(await db.database.savePost(post)){
        alert("Post gespeichert");
    }
}
