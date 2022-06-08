import CodeToken from "./CodeToken"

export class CommentTokenType
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
     * @type {CommentTokenType}
     */
    static Singleline = new CommentTokenType('Singleline')
    /**
     * @type {CommentTokenType}
     */
    static Multiline = new CommentTokenType('Multiline')
}

export default class CommentToken extends CodeToken
{
    /**
     * @type {CommentTokenType}
     */
    type
    /**
     * @type {string}
     */
    content

    constructor (type, content)
    {
        super('CommentToken')
        this.type = type
        this.content = content
    }
}