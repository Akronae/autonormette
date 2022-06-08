import CodeToken from "./CodeToken";

export default class IfNDefToken extends CodeToken
{
    /** @type {string} */
    define

    constructor (define, body)
    {
        super('IfNDefToken')
        this.define = define
        this.children = body
    }
}