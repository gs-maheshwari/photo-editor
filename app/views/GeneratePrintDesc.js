import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Generate Print Desc");
        this.setView('Generate');
    }

    pixelPerInch = 300;
    imageContainer = document.getElementById( "imageContainer" );
    debugContainer = document.getElementById( "debugContainer" );

    log = (msg) => {
        // show debug/state message on screen
        debugContainer.innerHTML += "<p>" + msg + "</p>";
    }

    scaleToFill = (img, cvs, ctx) => {
        // get the scale
        const scale = Math.max(cvs.width / img.width, cvs.height / img.height);
        // get the top left position of the image
        const x = (cvs.width / 2) - (img.width / 2) * scale;
        const y = (cvs.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    scaleImage = () => {
        const scale = document.getElementById("scale");
        const scaleBy = Number(scale.value);
        let tempCanvas=document.createElement("canvas");
        let tctx=tempCanvas.getContext("2d");
        let canvas = imageContainer.childNodes[1];
        const cw=canvas.width;
        const ch=canvas.height;
        tempCanvas.width=cw;
        tempCanvas.height=ch;

        tctx.drawImage(canvas,0,0);
        canvas.width*=scaleBy;
        canvas.height*=scaleBy;
        let ctx=canvas.getContext('2d');
        ctx.drawImage(tempCanvas,0,0,cw,ch,0,0,cw*scaleBy,ch*scaleBy);
    }

    fileSelectorChange = (e) => {
        // get all selected Files
        let files = e.target.files;
        let file;
        for (let i = 0; i < files.length; ++i ) {
            file = files[ i ];
            // check if file is valid Image (just a MIME check)
            switch ( file.type ) {
                case "image/jpeg":
                case "image/png":
                case "image/gif":
                    // read Image contents from file
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        // create HTMLImageElement holding image data
                        let img = new Image();
                        img.src = reader.result;
                        img.name = file.name
                        // remove existing images from ImageContainer
                        while ( imageContainer.childNodes.length > 0 )
                            imageContainer.removeChild( imageContainer.childNodes[ 0 ]);

                        // add image to container
                        imageContainer.appendChild(img);
                        img.style.display = 'none';
                        let canvas = document.createElement('canvas');
                        let ctx = canvas.getContext('2d');
                        imageContainer.appendChild(canvas);
                        img.onload = () => {
                            // grab some data from the image
                            var imageData = {
                                "width": img.naturalWidth,
                                "height": img.naturalHeight
                            };

                            this.scaleToFill(img, canvas, ctx);
                            this.log( "Loaded Image w/dimensions " + imageData.width + " x " + imageData.height );
                        }
                        // do your magic here...
                        
                        
                    };
                    reader.readAsDataURL( file );
                    // process just one file.
                    return;


                default:
                    this.log( "not a valid Image file :" + file.name );
            }
        }
    }

    generateDesc = () => {
        const [img, canvas] = imageContainer.childNodes;
        const { x, y, naturalWidth, naturalHeight, name } = img
        const { width, height } = canvas
        let printObj = {
            "canvas": {
                "width": width,
                "height": height,
                "photo": {
                    "id": name,
                    "width": naturalWidth,
                    "height": naturalHeight,
                    "x": x,
                    "y": y
                }
            }
        }
        const string = JSON.stringify(printObj, null, 5);
        this.log(string);
    }

    async getHtml() {
        return `
            <h1>Generate print description here!</h1>
            <ol>
                <li>Select a photo file from your device and import it into the application</li>
                <li>Position and scale this photo on a canvas</li>
                <li>Hit a submit button which will generate the print description</li>
            </ol>
            <p>Generate print description here!</p>
            <form action="#">
                <fieldset>
                    <label for="fileSelector">Select an Image file</label>
                    <input type="file" id="fileSelector" />
                </fieldset>
                <fieldset>
                    <label for="scale">Scale Image file</label>
                    <select name="scale" id="scale">
                        <option value=".5">50%</option>
                        <option value="1" selected="selected">100%</option>
                        <option value="1.5">150%</option>
                        <option value="2">200%</option>
                    </select>
                </fieldset>
            </form>
            <div class="column left">
                <div id="imageContainer">
                    <!-- will hold photos -->
                </div>
                <button id="generateButton">Generate!</button>
            </div>
            <div class="column right">
                <div id="debugContainer">
                    <!-- will hold debug messages -->
                </div>
            </div>
            <p>
                <a href="/" data-link>Back to Dashboard</a>
            </p>
        `;
    }
}