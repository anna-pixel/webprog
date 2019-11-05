"use strict";

/**
 * Klasse PageOverview: Stellt die Startseite der App zur Verfügung
 */
class PageOverview {
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
        let html = await fetch("page-overview/page-overview.html");
        let css = await fetch("page-overview/page-overview.css");

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

        await this._renderCountries(pageDom);

        this._app.setPageTitle("Startseite");
        this._app.setPageCss(css);
        this._app.setPageHeader(pageDom.querySelector("header"));
        this._app.setPageContent(pageDom.querySelector("main"));
    }

    /**
     * Darstellung der Länder  auf der Startseite erzeugen.
     *
     * @param {HTMLElement} pageDom Wurzelelement der eingelesenen HTML-Datei
     * mit den HTML-Templates dieser Seite.
     */
    async _renderCountries(pageDom) {
        let mainElement = pageDom.querySelector("main");
        let countryTemplateElement = pageDom.querySelector("#template-country");

        let countries = await this._app.database.selectAllCountries();

        countries.forEach(country => {
            let html = countryTemplateElement.innerHTML;
            html = html.replace("{ID}", country.id);
            html = html.replace("{NAME}", country.name);
            html = html.replace("{IMG}", country.img)

            mainElement.innerHTML += html;
        });
    }
}
