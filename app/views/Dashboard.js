import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Album Printer Home");
        this.setView('Dashboard')
    }

    async getHtml() {
        return `
            <h1>Welcome to Album Printer!!</h1>
            <p>You may use left navigation to explore our features!</p>
        `;
    }
}