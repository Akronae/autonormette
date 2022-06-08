<script>
import Button from '@/components/Button'
import sample_code from '@/assets/sample_code.txt'
import CodeParser from '@/utils/CodeParser'
import CodeWriter from '@/utils/CodeWriter'
import JSONUtils from '@/utils/JSONUtils'


export default
{
    name: 'home',

    render () 
    {
        return (
            <div id='home-view'>
                <div class='row'>
                    <div>
                        <textarea cols="140" rows="30" v-model={this.code}></textarea>
                        <textarea cols="140" rows="30" v-model={this.parsed}></textarea>
                    </div>
                    <textarea cols="200" rows="60" v-model={this.formatted}></textarea>
                </div>
            </div>
        )
    },

    data () 
    {
        return {
            code: '',
            parsed: '',
            formatted: ''
        }
    },

    computed:
    {
    },

    watch:
    {
        code ()
        {
            const parser = new CodeParser(this.code)
            this.parsed = JSON.stringify(parser.tokens, JSONUtils.getCircularReplacer(), 2)
            console.log(parser.tokens)
            this.formatted = new CodeWriter(parser.tokens).toString()
        }
    },

    mounted ()
    {
        this.code = sample_code
    },

    methods:
    {
    },

    components:
    {
        Button
    }
}
</script>

<style lang='less'>
@import '~@/styles/main.less';

#home-view
{
    --margin: 0 5vw;
    .OnTablet({ --margin: 0 10vw; });
    .OnDesktop({ --margin: 0 20vw; });
    padding: 10px;

    textarea
    {
        border: gray solid 1px;
        padding: 10px;
        font-family: monospace;
    }

    .row
    {
        display: flex;
        flex-direction: row;
    }
}
</style>
