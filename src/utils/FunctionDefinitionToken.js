import CodeToken from "./CodeToken";
import DefinitionToken from "./DefinitionToken";

export default class FunctionDefinitionToken extends CodeToken
{
    /** @type {string} */
    returnType
    /** @type {string} */
    name
    /** @type {DefinitionToken[]} */
    args = []

    /**
     * 
     * @param {string} returnType 
     * @param {string} name 
     * @param {DefinitionToken[]} args
     * @param {CodeToken[]} body 
     */
    constructor (returnType, name, args, body)
    {
        super('FunctionDefinitionToken')
        this.returnType = returnType
        this.name = name
        this.args = args
        this.children = body
    }
}