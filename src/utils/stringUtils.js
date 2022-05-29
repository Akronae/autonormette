const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const NUMERALS = '0123456789'
const EMPTY = ''

function toKebabCase (str)
{
    const result = str.replace(
        /([A-Z\u00C0-\u00D6\u00D8-\u00DE])|([0-9]+)/g,
        match => '-' + match.toLowerCase()
    )
      
    return (str[0] === str[0].toUpperCase())
        ? result.substring(1)
        : result
}

function isEmptyString (str)
{
    if (str == undefined || str == null) return true

    const noSpaces = str.toString().replace(/ /g, '')

    return noSpaces == ''
}

function removeHtmlTags (str, escapeNewLineTags, specificTag)
{
    if (!str) return ''
    
    if (!escapeNewLineTags) escapeNewLineTags = false
    if (!specificTag) specificTag = ''

    if (escapeNewLineTags)
    {
        str = str.replace(new RegExp(`(</(span|p|div)>)`, 'g'), '\n')
        str = str.replace(new RegExp(`(<br ?/?>)`, 'g'), '\n')
    }

    if (!isEmptyString(specificTag))
    {
        return str.replace(new RegExp(`(</?${specificTag}>)`, 'g'), '')
    }

    return str.replace(/<[^>]*>/g, '')
}

function isValidEmail (email)
{
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    return reg.test(String(email).toLowerCase())
}

function getFrenchPhoneNumbersInString (str)
{
    const reg = /(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})/g
    
    return str.match(reg) || []
}

function getUrlsInString (str, protocol)
{
    if (!protocol) protocol = '.*'

    const regStr = `(${protocol}:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})`

    const urls = []
    for (let match of str.matchAll(new RegExp(regStr, 'ig'))) urls.push(removeHtmlTags(match[0]))

    return urls
}

function getEmailsInString (str)
{
    return str.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
}

function getStringHash (str)
{
    var hash = 0, chr

    for (let i = 0; i < this.length; i++)
    {
        chr = this.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0 // Convert to 32bit integer
    }
    
    return hash
}

function removeAccents (str)
{
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function generateUuid ()
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

function lineCount (str)
{
    return str.split(/\r\n|\r|\n/).length
}

function isOverflowing (str, {chars, lines} = {})
{
    str = removeHtmlTags(str, true)

    return str.length > chars || lineCount(str) > lines
}

function trim (str, {chars, lines} = {})
{
    str = removeHtmlTags(str, true)
    
    if (!isOverflowing(str, {chars, lines})) return str

    return str
        .substring(0, chars)
        .split('\n').slice(0, lines)
        .join('\n') + '…'
}

/**
 * Insert `toInsert` every `every` char into `str`.
 * @param {String|number} str 
 * @param {Number} every
 * @param {String} toInsert
 */
function insertEvery (str, every, toInsert, {startFromEnd = false} = {})
{
    str = (str || '').toString()
    if (startFromEnd)
    {
        str = str.split('').reverse().join('')
    }

    var v = str.replace(/[^\dA-Z]/g, ''),
        reg = new RegExp(`.{${every}}`, 'g')

    var inserted = v.replace(reg, function (a)
    {
        return a + toInsert
    }).replace(/[^0-9]+$/, '')

    if (startFromEnd)
    {
        inserted = inserted.split('').reverse().join('')
    }

    return inserted
}

function formatPhoneNumber (str)
{
    str = str.replace(/\D+/g, '')
    str = insertEvery(str.substr(0, 10), 2, ' ')

    return str
}

function extractPhoneNumbers (str)
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

function formatAddress (str)
{
    const zipCodeMatch = str.match(/( |,| ,)([0-9]{5} [A-z])/gm)
    if (!zipCodeMatch) return str

    return str.replace(zipCodeMatch[0], '\n' + zipCodeMatch[0].substr(1).trim()).replace(/,/gm, '')
}

function isAlphabetical (str) {
    var code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };

  /**
   * 
   * @param {string} str 
   * @param {string[]} any 
   * @returns {string}
   */
function includesAny (str, any)
{
    any.forEach(a =>
    {
        if (str.includes(a)) return a
    })
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function removeMultipleSpaces (str)
{
    return str.replace(/ +(?= )/g,'')
}

/**
 * 
 * @param {string} str 
 * @param {string[]} any 
 */
function startsWithAny (str, any)
{
    any.forEach(a =>
    {
        if (str.startsWith(a)) return a
    })
}

export default { ALPHABET, NUMERALS, EMPTY, toKebabCase, isEmptyString, removeHtmlTags, isValidEmail, getFrenchPhoneNumbersInString,
    getUrlsInString, getEmailsInString, getStringHash, removeAccents, generateUuid, lineCount, isOverflowing, trim, insertEvery,
    formatPhoneNumber, extractPhoneNumbers, formatAddress, isAlphabetical, includesAny, removeMultipleSpaces, startsWithAny }