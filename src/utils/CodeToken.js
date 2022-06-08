export default class CodeToken
{
    /**
     * @type {string}
     */
    tokenType
    /**
     * @type {CodeToken[]}
     */
    _children = []
    /**
     * @type {CodeToken}
     */
    parent

    get children ()
    {
        return this._children
    }
    set children (value)
    {
        this._children = value
        this._children.forEach(c => c.parent = this)
    }

    constructor (tokenType)
    {
        this.tokenType = tokenType
    }

    toString ()
    {
        return ''
    }
}