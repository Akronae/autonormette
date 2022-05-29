import stringUtils from "./stringUtils"

export default class ParserUtils
{
    /**
     * 
     * @param {string} code 
     * @returns 
     */
    static extractIdentifierDefinition (code)
    {
        const split = code.split(' ')
        if (split.length < 2) return null
        var returnType = split[0].trim()
        var name = split[1].trim()
        if (name.indexOf(';') >= 0)
            name = name.substring(0, name.indexOf(';'))
        if (name.indexOf('(') >= 0)
            name = name.substring(0, name.indexOf('('))
        returnType += name.substring(name.indexOf('*'), name.lastIndexOf('*') + 1)
        name = name.replace(/\*/gm, '')

        return { returnType, name, readUpTo: code.indexOf(name) + name.length }
    }

    /**
     * 
     * @param {string} code 
     * @param {string[]} operators 
     */
    static includesBinaryOperator (code, operators)
    {
        code = code.replace(/ /gm, '').replace(/\n/gm, '')
        operators.forEach(op =>
        {
            //if (code.includes(op) && code.inde)
        })
    }
}