import '@/styles/mobile-normalize.css'
import '@/styles/animate.css'
import '@/styles/transitions.css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/app'
import router from '@/router'
import store from '@/stores'
import theme from '@/theme'
import StringUtils from '@/utils/stringUtils'
import {InlineSvgPlugin} from 'vue-inline-svg';

window.modules =
{
    StringUtils
}

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(InlineSvgPlugin);

theme.applyTheme()

// These svg are used with <inline-svg> which takes some time to render svgs for the first time.
// Without preloading images, it gives a cringy feeling when svg are rendered,
// especially on mobiles where it's clearly visible that the elements are resized as the image contained into is loaded.
function buildApp ()
{
    window.app = new Vue({
        el: '#app',
        router,
        store,
        template: '<App />',
        components: { App },
    
        data ()
        {
            return {
            }
        },
    
        methods:
        {
        },
    
        created: onAppCreated,
        mounted: onAppMounted
    })
}

function onAppCreated ()
{
}

function onAppMounted ()
{
}

buildApp()