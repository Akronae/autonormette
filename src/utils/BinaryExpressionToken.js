import CodeToken from "./CodeToken"

export class BinaryExpressionTokenType
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
     * @type {BinaryExpressionTokenType}
     */
    static EqualTo = new BinaryExpressionTokenType('EqualTo')
    /**
     * @type {BinaryExpressionTokenType}
     */
    static NotEqualTo = new BinaryExpressionTokenType('NotEqualTo')
    /**
     * @type {BinaryExpressionTokenType}
     */
    static LessThan = new BinaryExpressionTokenType('LessThan')
    /**
     * @type {BinaryExpressionTokenType}
     */
    static MoreThan = new BinaryExpressionTokenType('MoreThan')
}

export default class BinaryExpressionToken extends CodeToken
{
    /**
     * @type {BinaryExpressionTokenType}
     */
    type
    /**
     * @type {CodeToken}
     */
    left
    /**
     * @type {CodeToken}
     */
    right

    /**
     * 
     * @param {BinaryExpressionTokenType} type 
     * @param {CodeToken} left 
     * @param {CodeToken} right 
     */
    constructor (type, left, right)
    {
        super('BinaryExpressionToken')
        this.type = type
        this.left = left
        this.right = right
    }
}