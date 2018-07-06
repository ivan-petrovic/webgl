"use strict";

import MapEntry from './map_entry';

export default class {
    constructor() {
        // Number of outstanding load operations
        this.numOutstandingLoads = 0;

        // Callback function when all textures are loaded
        this.loadCompleteCallback = null;

        // Resource storage
        this.resourceMap = {};
    }

   /*
    * Register one more resource to load
    */
    asyncLoadRequested(resourceName) {
        this.resourceMap[resourceName] = new MapEntry(resourceName); // place holder for the resource to be loaded
        this.numOutstandingLoads += 1;
    }

    asyncLoadCompleted(resourceName, loadedAsset) {
        if (!this.isAssetLoaded(resourceName)) {
            console.log("Resource map - asyncLoadCompleted: [" + resourceName + "] not in map!");
        }
        this.resourceMap[resourceName].asset = loadedAsset;
        this.numOutstandingLoads -= 1;
        this._checkForAllLoadCompleted();
    }

    _checkForAllLoadCompleted() {
        if ((this.numOutstandingLoads === 0) && (this.loadCompleteCallback !== null)) {
            // ensures the load complete call back will only be called once!
            let funToCall = this.loadCompleteCallback;
            this.loadCompleteCallback = null;
            funToCall();
        }
    }

    // Make sure to set the callback _AFTER_ all load commands are issued
    setLoadCompleteCallback(funct) {
        this.loadCompleteCallback = funct;
        // in case all loading are done
        this._checkForAllLoadCompleted();
    }

    retrieveAsset(resourceName) {
        var r = null;
        if (resourceName in this.resourceMap) {
            r = this.resourceMap[resourceName].asset;
        } else {
            console.log("Resource map - retrieveAsset: [" + resourceName + "] not in map!");
        }
        return r;
    }

    isAssetLoaded(resourceName) {
        return (resourceName in this.resourceMap);
    }

    unloadAsset(resourceName) {
        if (resourceName in this.resourceMap) {
            delete this.resourceMap[resourceName];
        }
    }
}