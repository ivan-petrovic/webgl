/*
 * Loads an text file into resourceMap, either as simple text or as XML.
 * 
 * When done calls the callbackFunction().
 * Parameter fileName is treated as resource map key,
 * and file content is stored as asset.
 */

"use strict";

export default class {
    constructor(resourceMap) {
        this.eTextFileType = Object.freeze({
            eXMLFile: 0,
            eTextFile: 1
        });
        this.resourceMap = resourceMap;
    }

    // fileType is a eTextFileType
    loadTextFile(fileName, fileType, callbackFunction) {
        if (!(this.resourceMap.isAssetLoaded(fileName))) {
            // Update resources in load counter.
            this.resourceMap.asyncLoadRequested(fileName);

            // Asynchronously request the data from server.
            var req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if ((req.readyState === 4) && (req.status === 200)) {
                    let fileContent = null;
                    if (fileType === this.eTextFileType.eXMLFile) {
                        let parser = new DOMParser();
                        fileContent = parser.parseFromString(req.responseText, "text/xml");
                    } else {
                        fileContent = req.responseText;
                    }
                    this.resourceMap.asyncLoadCompleted(fileName, fileContent);
                    if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                        callbackFunction(fileName);
                    }
                }
            };
            req.open('GET', fileName, true);
            req.setRequestHeader('Content-Type', 'text/xml');
            req.send();
        
        } else {
            if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                callbackFunction(fileName);
            }
        }
    }

    unloadTextFile(fileName) {
        this.resourceMap.unloadAsset(fileName);
    }
}