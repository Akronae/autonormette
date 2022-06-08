import CodeToken from './CodeToken';

export default class StructDefineToken extends CodeToken
{
    /** @type {string} */
    name

    constructor (name, members)
    {
        super('StructDefineToken')
        this.name = name
        this.children = members
    }
}