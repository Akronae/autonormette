import CodeToken from "./CodeToken";

export default class IncludeToken extends CodeToken
{
    /**
     * @type {string}
     */
    filePath

    constructor (filePath)
    {
        super('IncludeToken')
        this.filePath = filePath
    }

    toString ()
    {
        return `#include "${this.filePath}"\n` 
    }
}