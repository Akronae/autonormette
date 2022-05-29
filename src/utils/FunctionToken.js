import CodeToken from "./CodeToken";
import DefinitionToken from "./DefinitionToken";

export default class FunctionToken extends CodeToken
{
    /** @type {string} */
    returnType
    /** @type {string} */
    name
    /** @type {DefinitionToken[]} */
    args = []
    /**
     * @type {CodeToken[]}
     */
    body

    /**
     * 
     * @param {string} returnType 
     * @param {string} name 
     * @param {DefinitionToken[]} args
     * @param {CodeToken[]} body 
     */
    constructor (returnType, name, args, body)
    {
        super('FunctionToken')
        this.returnType = returnType
        this.name = name
        this.args = args
        this.body = body
    }
}