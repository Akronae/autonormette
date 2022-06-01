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
    operator
    /**
     * @type {string}
     */
    value

    constructor (identifier, operator, value)
    {
        super('AssignmentToken')
        this.identifier = identifier
        this.operator = operator
        this.value = value
    }
}