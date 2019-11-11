"use strict";

/**
 * Klasse PageDetail: Stellt die Detailseite der App zur Verfügung
 */
class PageDetail {
    /**
     * Konstruktor
     * @param {App} app Zentrale Instanz der App-Klasse
     */
    constructor(app) {
        this._app = app;
        this._recordLand = -1;
        this._data = null;
    }

    /**
     * Seite anzeigen. Wird von der App-Klasse aufgerufen.
     */
    async show(matches) {
        // URL-Parameter auswerten
        this._recordLand = matches[1];
        this._data = await this._app.database.selectAllPosts();

        // Anzuzeigenden Seiteninhalt nachladen
        let html = await fetch("page-detail/page-detail.html");
        let css = await fetch("page-detail/page-detail.css");

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

        await this._renderPosts(pageDom);

        this._app.setPageTitle(`Land ${this._recordLand}`, {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageHeader(pageDom.querySelector("header"));
        this._app.setPageContent(pageDom.querySelector("main"));
    }

     /**
     * Hilfsmethode, welche den HTML-Code der eingelesenen HTML-Datei bearbeitet
     * und anhand der eingelesenen Daten ergänzt. Zusätzlich wird hier ein
     * Event Handler für den Button registriert.
     *
     * @param {HTMLElement} pageDom Wurzelelement der eingelesenen HTML-Datei
     * mit den HTML-Templates dieser Seite.
     */

    async _renderPosts(pageDom) {
        let mainElement = pageDom.querySelector("main");
        let countryTemplateElement = pageDom.querySelector("#template-post");

        this._data.forEach(post => {
            if(this._recordLand === post.land) {
                let html = countryTemplateElement.innerHTML;
                html = html.replace("{YEAR}", post.year);
                html = html.replace("{TITLE}", post.title);
                html = html.replace("{AUTHOR}", post.author);
                html = html.replace("{CONTENT}", post.content);
                html = html.replace("{IMG}", post.img);
                mainElement.innerHTML += html;
            }
        });
    }
}
