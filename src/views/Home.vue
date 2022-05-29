<script>
import Button from '@/components/Button'
import sample_code from '@/assets/sample_code.txt'
import CodeParser from '@/utils/CodeParser'


export default
{
    name: 'home',

    render () 
    {
        return (
            <div id='home-view'>
                <textarea cols="140" rows="30" v-model={this.parsed}></textarea>
                <textarea cols="140" rows="30" v-model={this.code}></textarea>
            </div>
        )
    },

    data () 
    {
        return {
            code: '',
            parsed: ''
        }
    },

    computed:
    {
    },

    watch:
    {
        code ()
        {
            this.parsed = JSON.stringify(new CodeParser(this.code).tokens, null, 2)
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
}
</style>
