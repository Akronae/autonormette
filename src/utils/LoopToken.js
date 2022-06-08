import CodeToken from "./CodeToken"

export class LoopTokenType
{
    /**
     * @type {string}
     */
    name


    constructor (name)
    {
        this.name = name
    }

    /**
     * @type {LoopTokenType}
     */
    static For = new LoopTokenType('For')
    /**
     * @type {LoopTokenType}
     */
    static While = new LoopTokenType('While')
}

export default class LoopToken extends CodeToken
{
    /**
     * @type {LoopTokenType}
     */
    type
    /**
     * @type {CodeToken}
     */
    condition

    /**
     * 
     * @param {LoopTokenType} type 
     * @param {CodeToken} condition 
     * @param {CodeToken[]} body 
     */
    constructor (type, condition, body)
    {
        super('LoopToken')
        this.type = type
        this.condition = condition
        this.children = body
    }
}