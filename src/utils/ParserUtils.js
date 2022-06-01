import stringUtils from "./stringUtils"

export default class ParserUtils
{
    static getNextWord (code, wordPos)
    {
        if (!code) return null
        const words = stringUtils.removeMultipleSpaces(code.replace(/\t/gm, '')).split(' ')
        if (wordPos > words.length - 1) return null

        return words[wordPos]
    }

    /**
     * 
     * @param {string} type 
     * @param {string} name 
     */
    static swapIdentifierPointerStars (type, name)
    {
        var newName = name.slice(0)
        while (newName.startsWith('*')) newName = newName.substring(1)
        
        while(type.endsWith('*'))
        {
            type = type.substring(0, type.length - 1)
            newName = '*' + newName
        }
        while (name.startsWith('*'))
        {
            name = name.substring(1)
            type = type + '*'
        }

        return {type, name: newName}
    }

    /**
     * 
     * @param {string} code 
     * @returns 
     */
    static extractIdentifierDefinition (code)
    {
        if (!this.getNextWord(code, 1)) return null
        var type = this.getNextWord(code, 0)
        var name = this.getNextWord(code, 1)
        if (name.indexOf(';') >= 0)
            name = name.substring(0, name.indexOf(';'))
        if (name.indexOf('(') >= 0)
            name = name.substring(0, name.indexOf('('))
        type += name.substring(name.indexOf('*'), name.lastIndexOf('*') + 1)
        name = name.replace(/\*/gm, '')
        if (name.includes(';')) name = name.substring(0, name.indexOf(';'))
        let defaultValue = code.indexOf('=') < code.indexOf(';') ? code.substring(code.indexOf('=') + 1, code.indexOf(';')).trim() : null
        const readUpTo = defaultValue ? code.indexOf(';') + 1 : code.indexOf(name) + name.length

        return { type, name, defaultValue, readUpTo }
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

    /**
     * 
     * @param {string} beginSymbol 
     * @param {string} endSymbol 
     * @param {string} code 
     * @returns {string}
     */
    static extractScope (code, beginSymbol, endSymbol)
    {
        let depth = 0;
        let i = 0
        let original = code.slice(0)
        code = code.substring(code.indexOf(beginSymbol))
        while (code)
        {
            if (code.startsWith(beginSymbol))
                depth++
            if (code.startsWith(endSymbol))
                depth--
            if (depth == 0)
                return original.substring(original.indexOf(beginSymbol) + 1, original.indexOf(beginSymbol) + i)
            code = code.substring(1)
            i++
        }
    }
}