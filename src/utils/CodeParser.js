import CommentToken, { CommentTokenType } from "./CommentToken"
import FunctionDefinitionToken from "./FunctionDefinitionToken"
import IncludeToken from "./IncludeToken"
import ParserUtils from "./ParserUtils"
import StringUtils from "./StringUtils"
import DefinitionToken from "./DefinitionToken"
import ConditionalToken, { ConditionalTokenType } from "./ConditionalToken"
import ReturnToken from "./ReturnToken"
import FunctionCallToken from "./FunctionCallToken"
import AssignmentToken from "./AssignmentToken"
import LoopToken, { LoopTokenType } from "./LoopToken"
import CodeLineToken from "./CodeLineToken"
import LoopControlToken, { LoopControlTokenType } from "./LoopControlToken"
import IfNDefToken from "./IfNDefToken"
import DefineToken from "./DefineToken"
import TypedefToken from "./TypedefToken"
import StructDefineToken from "./StructDefineToken"

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
        while (StringUtils.startsWithSome(str, '!', '*', '-', '+')) str = str.substring(1)
        while (StringUtils.endsWithSome(str, '!', '*', '-', '+', ';')) str = str.substring(0, str.length - 1)

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

            if (this.code.startsWith(' ') || this.code.startsWith('\t') || this.code.startsWith('\n') || this.code.startsWith('\r'))
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
            else if (StringUtils.startsWithRegex(this.code, /#( )*include/i))
            {
                const startIndex = StringUtils.indexPast(this.code, 'include')
                const scope = this.code.substring(startIndex, this.code.indexOf('\n', startIndex)).trim()
                var filepath = scope.substring(scope).replace(/["<>]/gm, '')
                this.tokens.push(new IncludeToken(filepath.trim(), scope.includes('<')))
                read = this.code.indexOf('\n', this.code.indexOf(scope))
            }
            else if (StringUtils.startsWithRegex(this.code, /#( )*ifndef/i))
            {
                var scope = ParserUtils.extractScopeRegex(this.code, /#( )*ifndef/i, /#( )*endif/i)
                var define = scope.substring(0, scope.indexOf('\n')).trim()
                scope = scope.substring(StringUtils.indexPast(scope, define))
                this.tokens.push(new IfNDefToken(define, new CodeParser(scope).tokens))
                read = StringUtils.indexPastRegex(this.code, /#( )*endif/i, this.code.indexOf(scope))
            }
            else if (StringUtils.startsWithRegex(this.code, /#( )*define/i))
            {
                const define = this.code.substring(StringUtils.indexPastRegex(this.code, /#( )*define/i), this.code.indexOf('\n')).trim()
                this.tokens.push(new DefineToken(define))
                read = this.code.indexOf('\n')
            }
            else if (this.code.startsWith('typedef'))
            {
                const extracted = ParserUtils.extractScopeBody(this.code)
                const endIndex = this.code.indexOf(';', this.code.indexOf(extracted) + extracted.length - 1)
                const scope = this.code.substring(0, endIndex)
                const typeName = ParserUtils.getWords(scope).at(-1)
                const defined = scope.substring(StringUtils.indexPast(scope, 'typedef'), scope.lastIndexOf(typeName)).trim()
                this.tokens.push(new TypedefToken(new CodeParser(defined).tokens, typeName))
                read = endIndex
            }
            else if (this.code.startsWith('struct') && this.isBefore('{', ';'))
            {
                const name = this.getNextWord(1)
                const body = ParserUtils.extractScopeBody(this.code)
                this.tokens.push(new StructDefineToken(name, new CodeParser(body).tokens))
                read = StringUtils.indexPast(this.code, body) + 1

            }
            else if (this.code.startsWith('if') || this.code.startsWith('else'))
            {
                var type
                if (this.code.startsWith('if')) type = ConditionalTokenType.If
                else if (this.code.startsWith('else if')) type = ConditionalTokenType.ElseIf
                else if (this.code.startsWith('else')) type = ConditionalTokenType.Else
                
                var conditionText = ParserUtils.extractScope(this.code, '(', ')')
                var scope
                if (type != ConditionalTokenType.Else) scope =  this.code.substring(this.code.indexOf(conditionText) + conditionText.length + 1)
                else scope = this.code.substring('else'.length)
                var body = ParserUtils.extractScopeBody(scope)
                if (type.name == ConditionalTokenType.Else.name) conditionText = null

                this.tokens.push(new ConditionalToken(type, conditionText, new CodeParser(body).tokens))
                read = this.code.indexOf(body) + body.length
            }
            else if (this.code.startsWith('for') || this.code.startsWith('while'))
            {
                var type
                if (this.code.startsWith('for')) type = LoopTokenType.For
                else if (this.code.startsWith('while')) type = LoopTokenType.While
                
                var conditionText = ParserUtils.extractScope(this.code, '(', ')')
                var body = ParserUtils.extractScopeBody(this.code.substring(this.code.indexOf(conditionText) + conditionText.length + 1))

                this.tokens.push(new LoopToken(type, conditionText, new CodeParser(body).tokens))
                read = this.code.indexOf(body) + body.length
            }
            else if (StringUtils.startsWithSome(this.getNextWord(0), 'continue', 'break'))
            {
                var type
                if (this.getNextWord(0).startsWith('continue')) type = LoopControlTokenType.Continue
                else if (this.getNextWord(0).startsWith('break')) type = LoopControlTokenType.Break
                
                this.tokens.push(new LoopControlToken(type))
                read = this.code.indexOf(';')
            }
            else if (this.code.startsWith('return'))
            {
                let returns = this.code.substring('return'.length, this.code.indexOf(';')).trim()
                if (returns.startsWith('(') && returns.endsWith(')')) returns = returns.substring(1, returns.length - 1)
                this.tokens.push(new ReturnToken(returns))
                read = this.code.indexOf(';')
            }
            else if (StringUtils.isAlphabetical(this.code[0]) && StringUtils.isAlphabetical(this.code[this.code.indexOf('(') - 1]) && this.isBefore(this.getNextWord(1), '(')  && this.isBefore('(', ';') && this.isBefore('(', '='))
            {
                const {type, name, readUpTo} = ParserUtils.extractIdentifierDefinition(this.code.substring(0, this.code.indexOf('(')))
                const args = ParserUtils.extractScope(this.code, '(', ')').split(',').map(identifier =>
                {
                    const def = ParserUtils.extractIdentifierDefinition(identifier)
                    if (def) return new DefinitionToken(def.type, def.name, null)
                })
                
                const bodyText = ParserUtils.extractScope(this.code, '{', '}')
                const body = new CodeParser(bodyText)
                this.tokens.push(new FunctionDefinitionToken(type, name, args, body.tokens))
                read = this.code.indexOf(bodyText || ';') + bodyText.length
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
            else if ((this.isIdentifier(this.getNextWord(0)) && (this.isBefore(';', this.getNextWord(1)) || !this.getNextWord(1))) || this.code.indexOf(';') == -1)
            {
                var endScopeIndex = this.code.indexOf(';')
                if (endScopeIndex < 0) endScopeIndex = this.code.length
                const scope = this.code.substring(this.code.indexOf(this.getNextWord(0)), endScopeIndex)
                if (scope.trim())
                {
                    console.log(this.code.substring(0, 20), StringUtils.isFirstLetterAlpha(this.code))
                    this.tokens.push(new CodeLineToken(scope))
                }
                read = endScopeIndex
            }
            else if (StringUtils.isFirstLetterAlpha(this.code) && this.code.indexOf(';') > this.code.indexOf(this.getNextWord(1)))
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