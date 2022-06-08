import CodeToken from './CodeToken';

export default class TypedefToken extends CodeToken
{
    /** @type {string} */
    typeName

    constructor (defined, typeName)
    {
        super('TypedefToken')
        this.children = defined
        this.typeName = typeName
    }
}