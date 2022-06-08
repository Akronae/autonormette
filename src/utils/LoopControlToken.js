import CodeToken from './CodeToken'

export class LoopControlTokenType
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
     * @type {LoopControlTokenType}
     */
    static Break = new LoopControlTokenType('Break')
    /**
     * @type {LoopControlTokenType}
     */
    static Continue = new LoopControlTokenType('Continue')
}

export default class LoopControlToken extends CodeToken
{
    /**
     * @type {LoopControlTokenType}
     */
    type

    constructor (type)
    {
        super('LoopControlToken')
        this.type = type
    }
}