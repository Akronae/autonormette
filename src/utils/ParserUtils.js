import stringUtils from "./stringUtils"

export default class ParserUtils
{
    static getWords (code)
    {
        if (!code) return []
        return stringUtils.removeMultipleSpaces(code.replace(/\t/gm, ' ')).trim().split(' ')
    }

    static getNextWord (code, wordPos)
    {
        const words = this.getWords(code) || []
        if (wordPos > words.length - 1) return ''

        return words[wordPos]
    }

    /**
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
     * @param {string} code 
     * @returns 
     */
    static extractIdentifierDefinition (code)
    {
        var scope = code
        if (scope.includes(';'))
            scope = scope.substring(0, scope.indexOf(';'))
        if (scope.includes('(') && !scope.includes('='))
            scope = scope.substring(0, scope.indexOf('('))
        if (scope.includes('='))
            scope = scope.replace('=', ' = ')
        const words = this.getWords(scope)
        console.log(words)
        var defaultValue = null
        var type = ''
        var name = ''
        if (words.includes('='))
        {
            defaultValue = words.splice(words.indexOf('=') + 1).join(' ').trim()
            words.pop()
        }
        name = words.pop().trim()
        type = words.join(' ').trim()
        type += name.substring(name.indexOf('*'), name.lastIndexOf('*') + 1)
        name = name.replace(/\*/gm, '')
        const readUpTo = scope.length

        console.log({ type, name, defaultValue, readUpTo })
        return { type, name, defaultValue, readUpTo }
    }

    /**
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

    static isBefore (code, before, after)
    {
        if (code.indexOf(before) < 0) return false
        return code.indexOf(before) < code.indexOf(after) || code.indexOf(after) == -1
    }

    /**
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

    /**
     * @param {string} code 
     * @returns {string}
     */
    static extractScopeBody (code)
    {
        let body = ''
        if (this.isBefore(code, '{', ';'))
            body = ParserUtils.extractScope(code, '{', '}')
        else
            body = code.substring(code.indexOf(')') + 1, code.indexOf(';') + 1)
        
        if (!this.getNextWord(code, 1).startsWith('(')) body = code.substring(code.indexOf(this.getNextWord(code, 0)) + this.getNextWord(code, 0).length, code.indexOf(';') + 1).trim()
        return body
    }
}