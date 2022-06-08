import ArrayUtils from './ArrayUtils'
import AssignmentToken from './AssignmentToken'
import CodeLineToken from './CodeLineToken'
import CodeToken from './CodeToken'
import CommentToken, { CommentTokenType } from './CommentToken'
import ConditionalToken, { ConditionalTokenType } from './ConditionalToken'
import DefineToken from './DefineToken'
import DefinitionToken from './DefinitionToken'
import FunctionCallToken from './FunctionCallToken'
import FunctionDefinitionToken from './FunctionDefinitionToken'
import IfNDefToken from './IfNDefToken'
import IncludeToken from './IncludeToken'
import LoopControlToken, { LoopControlTokenType } from './LoopControlToken'
import LoopToken, { LoopTokenType } from './LoopToken'
import NewlineToken from './NewlineToken'
import ParserUtils from './ParserUtils'
import ReturnToken from './ReturnToken'
import StringUtils from './StringUtils'
import StructDefineToken from './StructDefineToken'
import TypedefToken from './TypedefToken'

export default class CodeWriter
{
    /** @type {CodeToken[]} */
    tokens
    /** @type {number} */
    identation
    /** @type {number} */
    processorIdentation
    /** @type {string} */
    identationChar
    /** @type {string} */
    processorIdentationChar
    /** @type {string} */
    str = ''

    constructor (tokens, identation = 0, processorIdentation = 0, identationChar = '\t', processorIdentationChar = ' ')
    {
        this.tokens = tokens.slice(0)
        this.identation = identation
        this.processorIdentation = processorIdentation
        this.identationChar = identationChar
        this.processorIdentationChar = processorIdentationChar
    }

    charCount (str, {excludeLastLinebreak = false} = {})
    {
        if (!str) return 0
        let count = 0
        for (let i = 0; i < str.length; i++)
        {
            if (i == str.length - 1 && excludeLastLinebreak && str[i] == '\n') continue
            if (str[i] == '\t') count += 4
            else count++
        }
        return count
    }

    /**
     * @param {string} text 
     */
    appendLine (text)
    {
        var idented
        if (text.startsWith('#')) idented = `#${this.processorIdentationChar.repeat(this.processorIdentation)}${text.substring(1)}\n`
        else idented = `${this.identationChar.repeat(this.identation)}${text}\n`

        const lines = [idented]
        // while (lines.some(l => this.charCount(l, {excludeLastLinebreak: true}) > 80))
        // {
        //     const overflow = lines.find(l => this.charCount(l, {excludeLastLinebreak: true}) > 80)
        //     console.log(overflow)
        //     const separatorIndex = StringUtils.lastIndexOf(overflow, [',', '->', '(', '-', ' '], 80)
        //     const keepSeparator =  overflow[separatorIndex] == ','
        //     const cutLine = overflow.substring(0, separatorIndex + keepSeparator)
        //     const newLine = overflow.substring(separatorIndex + keepSeparator).trim()
        //     lines.splice(lines.indexOf(overflow) + 1, 0, `${this.identationChar.repeat(this.identation + StringUtils.charCount(cutLine  , '('))}${newLine}\n`)
        //     lines[lines.indexOf(overflow)] = StringUtils.trimChars(cutLine, [' ']) + '\n'
        // }
        this.str += lines.join('')
    }

    /**
     * @param {CodeToken} parent 
     */
    splitDefaultAssignments (parent)
    {
        if (ArrayUtils.isEmpty(parent.children)) return
        
        var root = parent
        while (root.parent) root = root.parent

        for (let i = 0; i < parent.children.length; i++)
        {
            const token = parent.children[i]
            if (token instanceof DefinitionToken && token.defaultValue)
            {
                root.children.splice(root.children.length, 0, token)
                parent.children.splice(i, 1)
                parent.children.splice(i, 0, new AssignmentToken(token.name, '=', token.defaultValue))
                token.defaultValue = null
            }
            if (token.children.length > 0) this.splitDefaultAssignments(token)
        }
    }

    orderTokens ()
    {
        const tokens = this.tokens.slice(0)
        tokens.filter(t => t instanceof FunctionDefinitionToken).forEach(t => this.splitDefaultAssignments(t))

        const ordered = []
        ordered.push(...tokens.filter(t => t instanceof CommentToken))
        ordered.push(...tokens.filter(t => t instanceof IfNDefToken))
        ordered.push(...tokens.filter(t => t instanceof DefineToken))
        var includes = tokens.filter(t => t instanceof IncludeToken)
        includes.sort((a, b) => b.filePath.localeCompare(a.filePath) + b.isAbsolute * 1000)
        ordered.push(...includes)
        ordered.push(...tokens.filter(t => t instanceof TypedefToken))
        ordered.push(...tokens.filter(t => t instanceof FunctionDefinitionToken))
        ordered.push(...tokens.filter(t => t instanceof DefinitionToken))
        ordered.push(...tokens.filter(t => !ordered.includes(t)))
        this.tokens = ordered
    }

    toString ()
    {
        this.orderTokens()

        for (let i = 0; i < this.tokens.length; i++)
        {
            const token = this.tokens[i]
            const lastToken = i == 0 ? null : this.tokens[i - 1]
            
            if (lastToken)
            {
                if (token instanceof DefineToken && lastToken instanceof DefineToken == false)
                    this.str += '\n'
                if (token instanceof IncludeToken && lastToken instanceof IncludeToken == false)
                    this.str += '\n'
                if (token instanceof FunctionDefinitionToken && !(lastToken instanceof FunctionDefinitionToken && (lastToken.children.length == 0) == (token.children.length == 0)))
                    this.str += '\n'
                if (token instanceof DefinitionToken == false && lastToken instanceof DefinitionToken)
                    this.str += '\n'
                if (token instanceof TypedefToken)
                    this.str += '\n'
            }

            if (token instanceof CommentToken)
            {
                if (token.type == CommentTokenType.Singleline)
                    this.appendLine(`//${token.content}`)
                if (token.type == CommentTokenType.Multiline)
                    this.appendLine(`/*${token.content}*/`)
            }

            if (token instanceof IncludeToken)
            {
                var str = '#include '
                str += token.isAbsolute ? '<' : '"'
                str += token.filePath
                str += token.isAbsolute ? '>' : '"'
                this.appendLine(str)
            }

            if (token instanceof FunctionDefinitionToken)
            {
                const {type, name} = ParserUtils.swapIdentifierPointerStars(token.returnType, token.name)

                const longestTypeDef = this.tokens.filter(t => t instanceof FunctionDefinitionToken).sort((a, b) =>
                {
                    const aSwap = ParserUtils.swapIdentifierPointerStars(a.returnType, a.name)
                    const bSwap = ParserUtils.swapIdentifierPointerStars(b.returnType, b.name)
                    return bSwap.type.length - aSwap.type.length
                })[0]
                const longestType = ParserUtils.swapIdentifierPointerStars(longestTypeDef.returnType, longestTypeDef.name).type
                const diff = longestType.length - type.length
                const tabsNeeded = (diff - (type.length % 4)) / 4 + (1 * type.length % 4 != 0)
                var padding = '\t'.repeat(Math.max(1, Math.ceil(tabsNeeded)))

                const args = token.args.map(a =>
                {
                    const {type, name} = ParserUtils.swapIdentifierPointerStars(a.type, a.name)
                    return `${type} ${name}`.trim()
                }).join(', ')
                const body = new CodeWriter(token.children, this.identation + 1, this.processorIdentation).toString()

                this.appendLine(`${type}${padding}${name}(${args})${(!body ? ';' : '')}`)
                if (body)
                {
                    this.appendLine(`{`)
                    this.str += body
                    this.appendLine(`}`)
                }
            }

            if (token instanceof ConditionalToken)
            {
                const keywords =
                {
                    [ConditionalTokenType.If.name]: 'if',
                    [ConditionalTokenType.ElseIf.name]: 'else if',
                    [ConditionalTokenType.Else.name]: 'else',
                }

                let str = keywords[token.type.name]
                if (token.condition) str += ` (${token.condition})`
                this.appendLine(str)
                if (token.children.length == 1 && token.children[0].children.length == 0)
                    this.str += (new CodeWriter(token.children, this.identation + 1, this.processorIdentation).toString())
                else
                {
                    this.appendLine('{')
                    this.str += (new CodeWriter(token.children, this.identation + 1, this.processorIdentation).toString())
                    this.appendLine('}')
                }
            }

            if (token instanceof LoopToken)
            {
                const keywords =
                {
                    [LoopTokenType.For.name]: 'for',
                    [LoopTokenType.While.name]: 'while',
                }

                let str = keywords[token.type.name]
                if (token.condition) str += ` (${token.condition})`
                this.appendLine(str)
                if (token.children.length == 1 && token.children[0].children.length == 0)
                    this.str += (new CodeWriter(token.children, this.identation + 1, this.processorIdentation).toString())
                else
                {
                    this.appendLine('{')
                    this.str += (new CodeWriter(token.children, this.identation + 1, this.processorIdentation).toString())
                    this.appendLine('}')
                }
            }

            if (token instanceof LoopControlToken)
            {
                const keywords =
                {
                    [LoopControlTokenType.Continue.name]: 'continue',
                    [LoopControlTokenType.Break.name]: 'break',
                }

                this.appendLine(`${keywords[token.type.name]} ;`)
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
                const tabsNeeded = (diff - (type.length % 4)) / 4 + (1 * type.length % 4 != 0)
                var padding = '\t'.repeat(Math.max(1, Math.ceil(tabsNeeded)))

                this.appendLine(`${type}${padding}${name}${token.defaultValue ? (' = ' + token.defaultValue) : ''};`)
            }

            if (token instanceof FunctionCallToken)
            {
                this.appendLine(`${token.name}(${token.args});`)
            }

            if (token instanceof NewlineToken)
            {
                this.appendLine('')
            }

            if (token instanceof AssignmentToken)
            {
                this.appendLine(`${token.identifier} ${token.operator} ${token.value};`)
            }

            if (token instanceof CodeLineToken)
            {
                this.appendLine(`${token.code};`)
            }

            if (token instanceof IfNDefToken)
            {
                this.appendLine(`#ifndef ${token.define}`)
                this.str += new CodeWriter(token.children, this.identation, this.processorIdentation + 1).toString()
                this.appendLine(`\n#endif`)
            }

            if (token instanceof DefineToken)
            {
                this.appendLine(`#define ${token.define}`)
            }

            if (token instanceof TypedefToken)
            {
                var defined = new CodeWriter(token.children, token.identation, token.processorIdentation).toString().trim()
                if (defined.endsWith(';')) defined = defined.slice(0, -1)
                this.appendLine(`typedef ${defined} ${token.typeName};`)
            }

            if (token instanceof StructDefineToken)
            {
                this.appendLine(`struct ${token.name}`)
                this.appendLine('{')
                this.str += new CodeWriter(token.children, this.identation + 1, this.processorIdentation).toString()
                this.appendLine('}')
            }
        }

        return this.str
    }
}