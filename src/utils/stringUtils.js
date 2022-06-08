import ArrayUtils from '@/utils/ArrayUtils'

export default class StringUtils
{
    static ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
    static NUMERALS = '0123456789'
    static EMPTY = ''

    static toKebabCase (str)
    {
        const result = str.replace(
            /([A-Z\u00C0-\u00D6\u00D8-\u00DE])|([0-9]+)/g,
            match => '-' + match.toLowerCase()
        )

        return (str[0] === str[0].toUpperCase())
            ? result.substring(1)
            : result
    }

    static isEmptyString (str)
    {
        if (str == undefined || str == null) return true

        const noSpaces = str.toString().replace(/ /g, '')

        return noSpaces == ''
    }

    static removeHtmlTags (str, escapeNewLineTags, specificTag)
    {
        if (!str) return ''

        if (!escapeNewLineTags) escapeNewLineTags = false
        if (!specificTag) specificTag = ''

        if (escapeNewLineTags)
        {
            str = str.replace(new RegExp(`(</(span|p|div)>)`, 'g'), '\n')
            str = str.replace(new RegExp(`(<br ?/?>)`, 'g'), '\n')
        }

        if (!this.isEmptyString(specificTag))
        {
            return str.replace(new RegExp(`(</?${specificTag}>)`, 'g'), '')
        }

        return str.replace(/<[^>]*>/g, '')
    }

    static isValidEmail (email)
    {
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        return reg.test(String(email).toLowerCase())
    }

    static getFrenchPhoneNumbersInString (str)
    {
        const reg = /(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})/g

        return str.match(reg) || []
    }

    static getUrlsInString (str, protocol)
    {
        if (!protocol) protocol = '.*'

        const regStr = `(${protocol}:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})`

        const urls = []
        for (let match of str.matchAll(new RegExp(regStr, 'ig'))) urls.push(this.removeHtmlTags(match[0]))

        return urls
    }

    static getEmailsInString (str)
    {
        return str.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
    }

    static getStringHash (str)
    {
        var hash = 0, chr

        for (let i = 0; i < this.length; i++)
        {
            chr = str.charCodeAt(i)
            hash = ((hash << 5) - hash) + chr
            hash |= 0 // Convert to 32bit integer
        }

        return hash
    }

    /**
     *
     * @param {string} str
     * @returns {string}
     */
    static removeAccents (str)
    {
        if (!str) return ''
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }

    static hasAccents (str)
    {
        if (!str) return false
        return str.normalize('NFD').match(/[\u0300-\u036f]/g, '')
    }

    static generateUuid ()
    {
        var d = new Date().getTime()
        var d2 = (performance && performance.now && (performance.now()*1000)) || 0

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
        {
            var r = Math.random() * 16
            if(d > 0)
            {
                r = (d + r)%16 | 0
                d = Math.floor(d/16)
            }
            else
            {
                r = (d2 + r)%16 | 0
                d2 = Math.floor(d2/16)
            }

            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
    }

    static lineCount (str)
    {
        return str.split(/\r\n|\r|\n/).length
    }

    /**
     * Insert `toInsert` every `every` char into `str`.
     * @param {String|number} str
     * @param {Number} every
     * @param {String} toInsert
     */
    static insertEvery (str, every, toInsert, {startFromEnd = false} = {})
    {
        str = (str || '').toString()
        if (startFromEnd)
        {
            str = str.split('').reverse().join('')
        }

        var v = str.replace(/[^\dA-Z]/g, ''),
            reg = new RegExp(`.{${every}}`, 'g')

        var inserted = v.replace(reg, a => a + toInsert).replace(/[^0-9]+$/, '')

        if (startFromEnd)
        {
            inserted = inserted.split('').reverse().join('')
        }

        return inserted
    }

    static formatPhoneNumber (str)
    {
        str = str.replace(/\D+/g, '')
        str = this.insertEvery(str.substr(0, 10), 2, ' ')

        return str
    }

    static extractPhoneNumbers (str)
    {
        str = str.replace(/\D+/g, '')
        const strs = []
        let i = 0
        while (i + 10 <= str.length)
        {
            strs.push(str.substr(i, i + 10))
            i+= 10
        }

        return strs
    }

    static formatAddress (str)
    {
        const zipCodeMatch = str.match(/( |,| ,)([0-9]{5} [A-z])/gm)
        if (!zipCodeMatch) return str

        return str.replace(zipCodeMatch[0], '\n' + zipCodeMatch[0].substr(1).trim()).replace(/,/gm, '')
    }

    static keepAlphanumerics (str)
    {
        return str.replace(/\W/g, '')
    }

        /**
     * @param {string} str
     * @param {string} search
     * @param {string} replace
     * @returns {string}
     */
    static replaceLast (str, search, replace)
    {
        return str.replace(new RegExp(search + '$'), replace);
    }

    /**
     * @param {string} str
     * @param {string} replace
     * @returns {string}
     */
    static replaceLastLetter (str, replace)
    {
        return str.substring(0, str.length - 1) + replace
    }

    /**
     * @param {string} str
     * @param  {...string} all
     */
    static includesEvery (str, ...all)
    {
        return all.every(item => str.includes(item))
    }

    /**
     * @param {string} str
     * @param  {...string} all
     */
    static includesSome (str, ...all)
    {
        return all.some(item => str.includes(item))
    }

    /**
     * @param {string} str
     * @param  {...string} all
     */
    static equalsSome (str, ...all)
    {
        return all.some(item => str == item)
    }

    /**
     * @param {string} str
     * @param  {...string} all
     * @returns {boolean}
     */
    static endsWithSome (str, ...all)
    {
        if (!str || ArrayUtils.isEmpty(all)) return false
        return all.some(item => str.endsWith(item))
    }

    /**
     * @param {string} str
     * @param  {...string} all
     * @returns {boolean}
     */
    static startsWithSome (str, ...all)
    {
        if (!str || ArrayUtils.isEmpty(all)) return false
        return all.some(item => str.startsWith(item))
    }

    static indexOfAny (str, ...any)
    {
        return str.split('').findIndex(item => any.includes(item))
    }

    /**
     * @param {string} string
     * @returns {string}
     */
    static escapeRegExp (string)
    {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    /**
     *
     * @param {string} str
     * @param {string} find
     * @param {string} replace
     * @returns
     */
    static replaceAll(str, find, replace)
    {
        return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    }

    /**
     * @param {string} str
     * @param {string[]} any
     * @param {string} replacement
     * @returns {string}
     */
    static replaceAny (str, any, replacement)
    {
        for (const a of any) str = this.replaceAll(str, a, replacement)
        return str
    }

    /**
     * @param {string} str
     * @param {...string} any
     * @returns {string}
     */
    static deleteAny (str, ...any)
    {
        return this.replaceAny(str, any, StringUtils.EMPTY)
    }

    static isAlphabetical (str)
    {
        if (!str) return false
        return /^[a-zA-Z]+$/.test(str)
    }

    static isAlphanumeric (str)
    {
        if (!str) return false
        return /^[a-zA-Z0-9]+$/.test(str)
    }

    static isFirstLetterAlpha (str)
    {
        if (!str) return false
        return this.isAlphabetical(str[0])
    }

    static removeMultipleSpaces (str)
    {
        return str.replace(/\s+/g, ' ')
    }

    /**
     * @param {string} string 
     * @param {RegExp|Array|string} search 
     * @param {number} offset 
     * @returns {number}
     */
    static lastIndexOf (string, search, offset)
    {
        if (search instanceof RegExp) return this.lastIndexOfRegex(string, search, offset)
        if (Array.isArray(search)) return this.arrLastIndexOf(string, search, offset)
        if (search instanceof string) return string.lastIndexOf(search, offset)
    }

    /**
     * @param {string} string 
     * @param {RegExp} regex 
     * @param {number} startpos 
     * @returns {number}
     */
    static indexOfRegex(string, regex, startpos)
    {
        var indexOf = string.substring(startpos || 0).search(regex);
        return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }
    
    static arrLastIndexOf (string, search, offset)
    {
        for (const item of search)
        {
            const index = string.lastIndexOf(item, offset)
            if (index >= 0) return index
        }
        return -1
    }

    /**
     * @param {string} string 
     * @param {RegExp} regex 
     * @param {number} startpos 
     * @returns {number}
     */
    static lastIndexOfRegex(string, regex, startpos)
    {
        regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
        if(typeof (startpos) == "undefined") {
            startpos = string.length;
        } else if(startpos < 0) {
            startpos = 0;
        }
        var stringToWorkWith = string.substring(0, startpos + 1);
        var lastIndexOf = -1;
        var nextStop = 0;
        var result
        while((result = regex.exec(stringToWorkWith)) != null) {
            lastIndexOf = result.index;
            regex.lastIndex = ++nextStop;
        }
        return lastIndexOf;
    }

    /**
     * @param {string} str 
     * @param {string[]} chars 
     * @returns {string}
     */
    static trimChars (str, chars)
    {
        while (this.startsWithSome(str, chars)) str = str.substring(1)
        while (this.endsWithSome(str, chars)) str = str.substring(0, str.length - 1)
        return str
    }

    /**
     * @param {string} str 
     * @param {string} char 
     * @returns {number}
     */
    static charCount (str, char)
    {
        return str.split(char).length - 1
    }

    /**
     * @param {string} str 
     * @param {string} search 
     * @returns {number}
     */
    static indexPast (str, search)
    {
        return str.indexOf(search) + search.length
    }
    /**
     * @param {string} str 
     * @param {RegExp} search 
     * @returns {number}
     */
    static indexPastRegex (str, search, offset = 0)
    {
        const match = search.exec(str.substring(offset))
        if (!match || !match.at(0)) return -1
        return offset + match.index + match.at(0).length
    }
    /**
     * @param {string} str 
     * @param {RegExp} search 
     * @returns {boolean}
     */
    static startsWithRegex (str, search, {caseSensitive = true} = {})
    {
        var source = search.source
        if (!source.startsWith('^')) source = '^' + source
        var flags = search.flags
        if (!caseSensitive && !flags.includes('i')) flags += 'i'
        var reg = new RegExp(source, flags)
        return reg.test(str)
    }

    /**
     * @param {string} str 
     * @param {RegExp} search 
     * @returns {boolean}
     */
    static endsWithRegex (str, search, {caseSensitive = true} = {})
    {
        var source = search.source
        if (!source.endsWith('$')) source = source + '$'
        var flags = search.flags
        if (!caseSensitive && !flags.includes('i')) flags += 'i'
        var reg = new RegExp(source, flags)
        return reg.test(str)
    }
}