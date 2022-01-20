import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Load Print Description");
        this.setView('Load')
    }

    loadPrintDesc = (e) => {
        let files = e.target.files;
        const canvasContainer = document.getElementById("canvasContainer");
        let canvas = document.getElementById('mycanvas')
        let ctx = canvas.getContext('2d');
        let reader = new FileReader();
        if (files[0]) {
            // read the contents of the first file in the <input type="file">
            reader.readAsText(files[0]);
        }

        // this function executes when the contents of the file have been fetched
        reader.onload = () => {
            let data = JSON.parse(reader.result);
            let image = new Image();
            image.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0); // draw the new image to the screen
            }
            image.src = data.image; // data.image contains the data URL
            canvasContainer.appendChild(image);
        };
    }

    async getHtml() {
        return `
        <h1>Load print description here!</h1>
        <ol>
            <li>Hit the import button which loads a previously saved description</li>
            <li>Upon loading, the application will show a canvas that contains the photo</li>
            <li>Photo is scaled and positioned as expected according to the loaded print instructions</li>
        </ol>
        <p>Load print description here!</p>
        <form action="#">
            <fieldset>
                <label for="jsonFileSelector">Select an Print Desc file</label>
                <input type="file" accept="application/JSON" id="jsonFileSelector" />
            </fieldset>
        </form>
        <div class="column left">
            <div id="canvasContainer">
                <canvas id="mycanvas" height="300" width="300"></canvas>
                <!-- will hold photos -->
            </div>
        </div>
        <p>
            <a href="/" data-link>Back to Dashboard!</a>
        </p>
        `;
    }
}