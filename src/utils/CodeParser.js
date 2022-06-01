import CommentToken, { CommentTokenType } from "./CommentToken"
import FunctionDefinitionToken from "./FunctionDefinitionToken"
import IncludeToken from "./IncludeToken"
import ParserUtils from "./ParserUtils"
import StringUtils from "./stringUtils"
import DefinitionToken from "./DefinitionToken"
import ConditionalToken, { ConditionalTokenType } from "./ConditionalToken"
import ReturnToken from "./ReturnToken"
import FunctionCallToken from "./FunctionCallToken"
import AssignmentToken from "./AssignmentToken"
import LoopToken, { LoopTokenType } from "./LoopToken"
import CodeLineToken from "./CodeLineToken"

export default class CodeParser
{
    /**
     * @type {string}
     */
    code
    tokens = []

    constructor (code)
    {
        // this.code = StringUtils.removeMultipleSpaces(code.replace(/\t/gm, ''))
        this.code = code
        this.parse()
    }

    getNextWord (wordPos)
    {
        return ParserUtils.getNextWord(this.code, wordPos)
    }

    isIdentifier (str)
    {
        str = str.trim(str)
        while (StringUtils.startsWithAny(str, ['*', '-', '+'])) str = str.substring(1)
        while (StringUtils.endsWithAny(str, ['*', '-', '+'])) str = str.substring(0, str.length - 2)

        return StringUtils.isAlphabetical(str[0])
    }

    isBefore (before, after)
    {
        return ParserUtils.isBefore(this.code, before, after)
    }

    parse ()
    {
        while (this.code)
        {
            let read = 0

                if (this.code.startsWith(' '))
            {
                read = 1
            }
            else if (this.code.startsWith('/*'))
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
                const scope = this.code.substring(this.code.indexOf(' '), this.code.indexOf('\n'))
                var filepath = scope.substring(scope).replace(/["<>]/gm, '')
                this.tokens.push(new IncludeToken(filepath.trim(), scope.includes('<')))
                read = this.code.indexOf('\n')
            }
            else if (this.code.startsWith('if') || this.code.startsWith('else'))
            {
                var type
                if (this.code.startsWith('if')) type = ConditionalTokenType.If
                else if (this.code.startsWith('else if')) type = ConditionalTokenType.ElseIf
                else if (this.code.startsWith('else')) type = ConditionalTokenType.Else
                
                var body = ParserUtils.extractScopeBody(this.code)
                var conditionText = ParserUtils.extractScope(this.code, '(', ')')

                if (type.name == ConditionalTokenType.Else.name) conditionText = null

                this.tokens.push(new ConditionalToken(type, conditionText, new CodeParser(body).tokens))
                read = this.code.indexOf(body) + body.length
            }
            else if (this.code.startsWith('for') || this.code.startsWith('while'))
            {
                var type
                if (this.code.startsWith('for')) type = LoopTokenType.For
                else if (this.code.startsWith('while')) type = LoopTokenType.While
                
                var body = ParserUtils.extractScopeBody(this.code)
                var conditionText = ParserUtils.extractScope(this.code, '(', ')')

                this.tokens.push(new LoopToken(type, conditionText, new CodeParser(body).tokens))
                read = this.code.indexOf(body) + body.length
            }
            else if (this.code.startsWith('return'))
            {
                let returns = this.code.substring('return'.length, this.code.indexOf(';')).trim()
                if (returns.startsWith('(') && returns.endsWith(')')) returns = returns.substring(1, returns.length - 1)
                this.tokens.push(new ReturnToken(returns))
                read = this.code.indexOf(';')
            }
            else if (StringUtils.isAlphabetical(this.code[0]) && this.isBefore(this.getNextWord(1), '(')  && this.isBefore('(', ';') && this.isBefore('(', '='))
            {
                const {type, name, readUpTo} = ParserUtils.extractIdentifierDefinition(this.code)
                const args = ParserUtils.extractScope(this.code, '(', ')').split(',').map(identifier =>
                {
                    const def = ParserUtils.extractIdentifierDefinition(identifier)
                    if (def) return new DefinitionToken(def.type, def.name, null)
                })
                
                const bodyText = ParserUtils.extractScope(this.code, '{', '}')
                const body = new CodeParser(bodyText)
                this.tokens.push(new FunctionDefinitionToken(type, name, args, body.tokens))
                read = this.code.indexOf(bodyText) + bodyText.length
            }
            else if (StringUtils.isFirstLetterAlpha(this.code) && this.getNextWord(0).includes('('))
            {
                const name = this.code.substring(0, this.code.indexOf('('))
                const args = ParserUtils.extractScope(this.code, '(', ')')

                this.tokens.push(new FunctionCallToken(name, args))
                read = this.code.indexOf(');') + 2
            }
            else if (this.isIdentifier(this.getNextWord(0)) && this.getNextWord(1).includes('=') && this.isBefore('=', ';'))
            {
                const operator = this.code.match(/[+-\/*]?=/gm)[0]
                this.tokens.push(new AssignmentToken(this.getNextWord(0), operator, this.code.substring(this.code.indexOf('=') + 1, this.code.indexOf(';')).trim()))
                read = this.code.indexOf(';')
            }
            else if (this.isIdentifier(this.getNextWord(0)) && (this.isBefore(';', this.getNextWord(1)) || !this.getNextWord(1)))
            {
                const scope = this.code.substring(this.code.indexOf(this.getNextWord(0)), this.code.indexOf(';'))
                this.tokens.push(new CodeLineToken(scope))
                read = this.code.indexOf(';') + 1
            }
            else if (StringUtils.isFirstLetterAlpha(this.code) && this.isIdentifier(this.getNextWord(1)) && this.code.indexOf(';') > this.code.indexOf(this.getNextWord(1)))
            {
                const {type, name, defaultValue, readUpTo} = ParserUtils.extractIdentifierDefinition(this.code)
                this.tokens.push(new DefinitionToken(type, name, defaultValue))
                read = readUpTo
            }

            if (read < 1) read = 1
            this.code = this.code.substring(read)
        }
    }
}