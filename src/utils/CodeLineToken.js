import CodeToken from "./CodeToken";

export default class CodeLineToken extends CodeToken
{
    /** @type {string} */
    code

    /**
     * 
     * @param {string} code 
     */
    constructor (code)
    {
        super('CodeLineToken')
        this.code = code
    }
}