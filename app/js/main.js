import '../css/main.scss'

import Dashboard from "../views/Dashboard.js";
import GeneratePrintDesc from "../views/GeneratePrintDesc.js";
import LoadPrintDesc from "../views/LoadPrintDesc.js";



const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/generate", view: GeneratePrintDesc },
        { path: "/load", view: LoadPrintDesc }
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    document.querySelector("#album-printer").innerHTML = await view.getHtml();
    switch(view.view){
        case 'Generate':
            {
                const { fileSelectorChange, generateDesc, scaleImage } = view
                const fileSelector = document.getElementById("fileSelector");
                const generateButton = document.getElementById("generateButton");
                const scaleButton = document.getElementById("scale");
                if(fileSelector){
                    fileSelector.onchange = fileSelectorChange;
                }
                if(generateButton){
                    generateButton.onclick = generateDesc
                }
                if(scaleButton){
                    scaleButton.onchange = scaleImage
                }
            }
            break;

        case 'Load':
            {
                const jsonFileSelector = document.getElementById("jsonFileSelector");
                const { loadPrintDesc } = view 
                if(jsonFileSelector){
                    jsonFileSelector.onchange = loadPrintDesc;
                }
            }
            break;


    }
    
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});