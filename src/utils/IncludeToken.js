import CodeToken from "./CodeToken";

export default class IncludeToken extends CodeToken
{
    /**
     * @type {string}
     */
    filePath
    /**
     * @type {boolean}
     */
    isAbsolute

    constructor (filePath, isAbsolute)
    {
        super('IncludeToken')
        this.filePath = filePath
        this.isAbsolute = isAbsolute
    }
}