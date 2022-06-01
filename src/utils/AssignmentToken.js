import CodeToken from "./CodeToken";

export default class AssignmentToken extends CodeToken
{
    /**
     * @type {string}
     */
    identifier
    /**
     * @type {string}
     */
    value

    constructor (identifier, value)
    {
        super('AssignmentToken')
        this.identifier = identifier
        this.value = value
    }
}