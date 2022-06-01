import CodeToken from './CodeToken';
import DefinitionToken from './DefinitionToken';

export default class FunctionCallToken extends CodeToken
{
    /** @type {string} */
    name
    /** @type {string[]} */
    args

    /**
     * 
     * @param {string} name 
     * @param {string[]} args 
     */
    constructor (name, args)
    {
        super('FunctionCallToken')
        this.name = name
        this.args = args
    }
}