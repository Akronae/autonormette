import CodeToken from './CodeToken';

export default class ReturnToken extends CodeToken
{
    /** @type {string} */
    returns

    /**
     * @param {string} returns 
     */
    constructor (returns)
    {
        super('ReturnToken')
        this.returns = returns
    }
}