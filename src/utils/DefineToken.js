import CodeToken from "./CodeToken";

export default class DefineToken extends CodeToken
{
    /** @type {string} */
    define

    constructor (define)
    {
        super('DefineToken')
        this.define = define
    }
}