import StringUtils from "./StringUtils"

export default class ParserUtils
{
    static cleanSpaces (code)
    {
        return StringUtils.removeMultipleSpaces(code.replace(/\t/gm, ' ')).trim()
    }

    /**
     * 
     * @param {string} code 
     * @returns {Array<string>}
     */
    static getWords (code)
    {
        if (!code) return []
        return this.cleanSpaces(code).split(' ')
    }

    /**
     * @param {string} code 
     * @param {number} wordPos 
     * @returns {string}
     */
    static getNextWord (code, wordPos)
    {
        const words = this.getWords(code) || []
        if (wordPos > words.length - 1) return ''

        return words[wordPos]
    }

    /**
     * @param {string} type 
     * @param {string} name 
     * @param {boolean} fromNameToType 
     */
    static swapIdentifierPointerStars (type, name, fromNameToType)
    {
        if (fromNameToType)
        {
            while (name.startsWith('*'))
            {
                name = name.substring(1)
                type = type + '*'
            }
        }
        else
        {
            while(type.endsWith('*'))
            {
                type = type.substring(0, type.length - 1)
                name = '*' + name
            }
        }
        
        type = type.replace(/ \*/gm, '*')
        name = name.replace(/ \*/gm, '*')
        return {type, name}
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
        else if (scope.includes('(*') && scope.indexOf('(*') == scope.indexOf('('))
            scope = scope.substring(0, scope.lastIndexOf(')') + 1)
        else if (scope.includes('(') && !scope.includes('='))
            scope = scope.substring(0, scope.indexOf('('))
        
        if (scope.includes('='))
            scope = scope.replace('=', ' = ')
        
        const words = this.getWords(scope)
        var defaultValue = null
        var type = ''
        var name = ''
        if (words.includes('='))
        {
            defaultValue = words.splice(words.indexOf('=') + 1).join(' ').trim()
            words.pop()
        }
        name = words.pop()
        type = words.join(' ')

        if (scope.includes('(*'))
        {
            type = scope.substring(0, scope.indexOf('(*'))
            name = scope.substring(scope.indexOf('(*'))
        }

        const swap = this.swapIdentifierPointerStars(type, name, true)
        type = swap.type
        name = swap.name

        type = StringUtils.replaceAll(type, '\t', '')
        if (name.includes('=')) name = name.substring(0, name.indexOf('='))

        type = type.trim()
        name = name.trim()

        const readUpTo = scope.length

        return { type, name, defaultValue, readUpTo }
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
                return original.substring(StringUtils.indexPast(original, beginSymbol), original.indexOf(beginSymbol) + i)
            code = code.substring(1)
            i++
        }
    }

    /**
     * @param {string} code 
     * @param {RegExp} beginSymbol 
     * @param {RegExp} endSymbol 
     * @returns {string}
     */
    static extractScopeRegex (code, beginSymbol, endSymbol)
    {
        let depth = 0;
        let i = 0
        let original = code.slice(0)
        code = code.substring(StringUtils.indexOfRegex(code, beginSymbol))
        var rtrn = ''
        while (code)
        {
            if (StringUtils.startsWithRegex(code, beginSymbol))
                depth++
            if (StringUtils.startsWithRegex(code, endSymbol))
                depth--
            if (depth == 0)
                return original.substring(StringUtils.indexPastRegex(original, beginSymbol), StringUtils.indexOfRegex(original, beginSymbol) + i)
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
            body = code.substring(0, code.indexOf(';') + 1)
        
        return body
    }
}