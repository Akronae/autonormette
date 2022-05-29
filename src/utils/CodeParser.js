import CommentToken, { CommentTokenType } from "./CommentToken"
import FunctionToken from "./FunctionToken"
import IncludeToken from "./IncludeToken"
import ParserUtils from "./ParserUtils"
import StringUtils from "./stringUtils"
import DefinitionToken from "./DefinitionToken"
import ConditionalToken, { ConditionalTokenType } from "./ConditionalToken"
import BinaryExpressionToken, { BinaryExpressionTokenType } from "./BinaryExpressionToken"
import cparse from '@/utils/cparse'

export default class CodeParser
{
    /**
     * @type {string}
     */
    code
    tokens = []

    constructor (code)
    {
        this.code = code
        this.parse()
    }

    getFunctionsDelcarations ()
    {
        var code = this.code.slice(0)
        const functions = []
        while (code)
        {
            let read = 1
            if (StringUtils.isAlphabetical(code[0]) && code.indexOf('(') > 0 && code.indexOf('(') < code.indexOf(';'))
            {
                const {returnType, name, readUpTo} = ParserUtils.extractIdentifierDefinition(code)
                const args = code.substring(code.indexOf('(') + 1, code.indexOf(')')).split(',').map(identifier =>
                {
                    const extracted = ParserUtils.extractIdentifierDefinition(identifier)
                    if (!extracted) return null
                    return new DefinitionToken(extracted.returnType, extracted.name, null)
                }).filter(a => a)
                const body = "new CodeParser(code.substring(code.indexOf('{')))"
                functions.push(new FunctionToken(returnType, name, args, body.tokens))
                read = code.indexOf('}')
            }
            code = code.substring(read)
        }
        return functions
    }

    parse ()
    {
        // var types = []
        // this.getFunctionsDelcarations().forEach(f =>
        // {
        //     types.push(f.returnType)
        //     if (f.args) types.push(...f.args.map(a => a.type))
        // })
        // types = Array.from(new Set(types))
        // types = types.map(t => t.replace(/\*/gm, ''))
        // console.log(types)
        // return this.tokens = cparse(this.code, {types})
        while (this.code)
        {
            let read = 1

            if (this.code.startsWith('/*'))
            {
                const commentEndIndex = this.code.indexOf('*/')
                this.tokens.push(new CommentToken(CommentTokenType.Multiline, this.code.substring(2, commentEndIndex)))
                read = commentEndIndex
            }
            else if (this.code.startsWith('//'))
            {
                const commentEndIndex = this.code.indexOf('\n')
                this.tokens.push(new CommentToken(CommentTokenType.Singleline, this.code.substring(2, commentEndIndex)))
                read = commentEndIndex
            }
            else if (this.code.startsWith('#include'))
            {
                const filePathBegin = this.code.indexOf('"') + 1
                const filePathEnd = this.code.indexOf('"', filePathBegin + 1)
                this.tokens.push(new IncludeToken(this.code.substring(filePathBegin, filePathEnd)))
                read = filePathEnd
            }
            else if (this.code.startsWith('if') || this.code.startsWith('else'))
            {
                var type
                if (this.code.startsWith('if')) type = ConditionalTokenType.If
                else if (this.code.startsWith('else if')) type = ConditionalTokenType.ElseIf
                else if (this.code.startsWith('else')) type = ConditionalTokenType.Else
                
                var body
                if (this.code.indexOf('{') >= 0 && this.code.indexOf('{') < this.code.indexOf(';'))
                    body = this.code.substring(this.code.indexOf('{') + 1, this.code.indexOf('}'))
                else
                    body = this.code.substring(this.code.indexOf(')') + 1, this.code.indexOf(';') + 1)
                body = body.trim()
                if (body.startsWith('\n')) body = body.replace('\n')
                body = body.trim()

                var conditionText = this.code.substring(this.code.indexOf('(') + 1, this.code.indexOf(')'))

                this.tokens.push(new ConditionalToken(type, conditionText, body))
                read = this.code.indexOf(';')
            }
            else if (this.code.startsWith('return'))
            {
                read = this.code.indexOf(';')
            }
            else if (StringUtils.isAlphabetical(this.code[0]) && this.code.indexOf('(') < this.code.indexOf(';'))
            {
                const {returnType, name, readUpTo} = ParserUtils.extractIdentifierDefinition(this.code)
                const args = this.code.substring(this.code.indexOf('(') + 1, this.code.indexOf(')')).split(',').map(identifier =>
                {
                    const {returnType, name, readUpTo} = ParserUtils.extractIdentifierDefinition(identifier)
                    return new DefinitionToken(returnType, name, null)
                })
                const body = new CodeParser(this.code.substring(this.code.indexOf('{')))
                this.tokens.push(new FunctionToken(returnType, name, args, body.tokens))
                read = this.code.indexOf('}')
            }
            this.code = this.code.substring(read)
        }
    }
}