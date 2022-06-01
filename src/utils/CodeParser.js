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
        while (str[0] == '*') str = str.substring(1)

        return StringUtils.isAlphabetical(str[0])
    }

    isBefore (before, after)
    {
        if (this.code.indexOf(before) < 0) return false
        return this.code.indexOf(before) < this.code.indexOf(after) || this.code.indexOf(after) == -1
    }

    parse ()
    {
        while (this.code)
        {
            let read = 1

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
            else if (this.code.startsWith('#include') && this.isBefore('"', ';'))
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
                if (this.isBefore('{', ';'))
                    body = this.code.substring(this.code.indexOf('{') + 1, this.code.indexOf('}'))
                else
                    body = this.code.substring(this.code.indexOf(')') + 1, this.code.indexOf(';') + 1)

                var conditionText = this.code.substring(this.code.indexOf('(') + 1, this.code.indexOf(')'))

                this.tokens.push(new ConditionalToken(type, conditionText, new CodeParser(body).tokens))
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
                this.tokens.push(new AssignmentToken(this.getNextWord(0), this.code.substring(this.code.indexOf('=') + 1, this.code.indexOf(';')).trim()))
                read = this.code.indexOf(';')
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