export default class {
    constructor(params) {
        this.params = params;
    }

    setView(view){
        this.view = view;
    }

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }
}