import CommentToken, { CommentTokenType } from './CommentToken'
import ConditionalToken, { ConditionalTokenType } from './ConditionalToken'
import DefinitionToken from './DefinitionToken'
import FunctionCallToken from './FunctionCallToken'
import FunctionDefinitionToken from './FunctionDefinitionToken'
import IncludeToken from './IncludeToken'
import ParserUtils from './ParserUtils'
import ReturnToken from './ReturnToken'
import stringUtils from './stringUtils'

export default class CodeWriter
{
    /** @type {CodeToken[]} */
    tokens
    /** @type {number} */
    identation
    /** @type {string} */
    identationChar
    /** @type {string} */
    str = ''

    constructor (tokens, identation = 0, identationChar = '\t')
    {
        this.tokens = tokens.slice(0)
        this.identation = identation
        this.identationChar = identationChar
    }

    appendLine (text)
    {
        this.str += `${this.identationChar.repeat(this.identation)}${text}\n`
    }

    toString ()
    {
        for (let i = 0; i < this.tokens.length; i++)
        {
            const token = this.tokens[i]

            if (token instanceof CommentToken)
            {
                if (token.type == CommentTokenType.Singleline)
                    this.appendLine(`//${token.content}`)
                if (token.type == CommentTokenType.Multiline)
                    this.appendLine(`/*${token.content}*/`)
            }

            if (token instanceof IncludeToken)
            {
                this.appendLine(`#include "${token.filePath}";`)
            }

            if (token instanceof FunctionDefinitionToken)
            {
                const {type, name} = ParserUtils.swapIdentifierPointerStars(token.returnType, token.name)
                const args = token.args.map(a =>
                {
                    const {type, name} = ParserUtils.swapIdentifierPointerStars(a.type, a.name)
                    return `${type} ${name}`
                }).join(', ')
                const body = new CodeWriter(token.body, this.identation + 1).toString()

                this.appendLine(`${type}\t${name}(${args})`)
                this.appendLine(`{`)
                this.str += body
                this.appendLine(`}`)
            }

            if (token instanceof ConditionalToken)
            {
                const keywords =
                {
                    [ConditionalTokenType.If.name]: 'if',
                    [ConditionalTokenType.ElseIf.name]: 'else if',
                    [ConditionalTokenType.Else.name]: 'else',
                }

                this.appendLine(`${keywords[token.type.name]} (${token.condition})`)
                if (token.body.length == 1)
                    this.str += (new CodeWriter(token.body, this.identation + 1).toString())
                else
                {
                    this.appendLine('{')
                    this.str += (new CodeWriter(token.body, this.identation + 1).toString())
                    this.appendLine('}')
                }
            }

            if (token instanceof ReturnToken)
            {
                this.appendLine(`return (${token.returns});`)
            }

            if (token instanceof DefinitionToken)
            {
                const {type, name} = ParserUtils.swapIdentifierPointerStars(token.type, token.name)
                const longestTypeDef = this.tokens.filter(t => t instanceof DefinitionToken).sort((a, b) =>
                {
                    const aSwap = ParserUtils.swapIdentifierPointerStars(a.type, a.name)
                    const bSwap = ParserUtils.swapIdentifierPointerStars(b.type, b.name)
                    return bSwap.type.length - aSwap.type.length
                })[0]
                const longestType = ParserUtils.swapIdentifierPointerStars(longestTypeDef.type, longestTypeDef.name).type
                const diff = longestType.length - type.length
                var padding = '\t'.repeat(diff / 4)
                if (type == longestType) padding = '\t'

                this.appendLine(`${type}${padding}${name}${token.defaultValue ? (' = ' + token.defaultValue) : ''};`)
            }

            if (token instanceof FunctionCallToken)
            {
                this.appendLine(`${token.name}(${token.args});`)
            }
        }

        return this.str
    }
}