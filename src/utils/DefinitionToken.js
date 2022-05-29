import CodeToken from "./CodeToken";

export default class DefinitionToken extends CodeToken
{
    /** @type {string} */
    type
    /** @type {string} */
    name
    /** @type {string} */
    defaultValue

    /**
     * 
     * @param {string} type 
     * @param {string} name 
     * @param {string} defaultValue 
     */
    constructor (type, name, defaultValue)
    {
        super('DefinitionToken')
        this.type = type
        this.name = name
        this.defaultValue = defaultValue
    }
}