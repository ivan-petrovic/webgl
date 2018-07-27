// On contruction of this object this.asset is just the placeholder
// for resource with resourceName.
// When loading of resource finishes this.asset is resource itself.
// For example, if resoutce is text file this.asset is content of file.

export default class {
    constructor(resourceName) {
        this.asset = resourceName;
    }
}