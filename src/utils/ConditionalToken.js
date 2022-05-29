import CodeToken from "./CodeToken"

export class ConditionalTokenType
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
     * @type {ConditionalTokenType}
     */
    static If = new ConditionalTokenType('If')
    /**
     * @type {ConditionalTokenType}
     */
    static ElseIf = new ConditionalTokenType('ElseIf')
    /**
     * @type {ConditionalTokenType}
     */
    static Else = new ConditionalTokenType('Else')
    /**
     * @type {ConditionalTokenType}
     */
    static Ternary = new ConditionalTokenType('Ternary')
}

export default class ConditionalToken extends CodeToken
{
    /**
     * @type {ConditionalTokenType}
     */
    type
    /**
     * @type {CodeToken}
     */
    condition
    /**
     * @type {CodeToken[]}
     */
    body

    /**
     * 
     * @param {ConditionalTokenType} type 
     * @param {CodeToken} condition 
     * @param {CodeToken[]} body 
     */
    constructor (type, condition, body)
    {
        super('ConditionalToken')
        this.type = type
        this.condition = condition
        this.body = body
    }
}