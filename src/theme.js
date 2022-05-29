import String from '@/utils/stringUtils'
import DOMUtils from '@/utils/DOMUtils'

function shadeColor (color, percent)
{
    var R = parseInt(color.substring(1, 3), 16)
    var G = parseInt(color.substring(3, 5), 16)
    var B = parseInt(color.substring(5, 7), 16)

    R = parseInt(R * (100 + percent) / 100)
    G = parseInt(G * (100 + percent) / 100)
    B = parseInt(B * (100 + percent) / 100)

    R = (R < 255) ? R : 255
    G = (G < 255) ? G : 255
    B = (B < 255) ? B : 255

    var RR = ((R.toString(16).length == 1) ? '0' + R.toString(16) : R.toString(16))
    var GG = ((G.toString(16).length == 1) ? '0' + G.toString(16) : G.toString(16))
    var BB = ((B.toString(16).length == 1) ? '0' + B.toString(16) : B.toString(16))

    return '#' + RR + GG + BB
}

export default
{
    properties:
    {
        accentColor: '#776ff9',
        accentColorLight: '#857dfa',
        secondaryColor: '#f6f6f6',
        backgroundColor: '#36393F',
        textColor: '#ffffff',
        textColorLight: '#686a6d',
        textColorExtraLight: '#909399',
        borderColor: '#e8e9ed',
        borderColorStrong: '#e0e0e1',
        borderColorExtraStrong: '#d3d3d3',
        borderColorLight: '#0000000a',
        borderColorExtraLight: '#00000008',
        borderColorMegaLight: '#00000006',
        dangerColor: '#E94E3C',
        successColor: '#00B47B',
        contentBackgroundColor: '#282C34',
        get accentColorLight15Percent() { return shadeColor(this.accentColor, 15) },
        get accentColorLight30Percent() { return shadeColor(this.accentColor, 30) },
        get accentColorLight50Percent() { return shadeColor(this.accentColor, 50) },
        get accentColorLight70Percent() { return shadeColor(this.accentColor, 70) },
        get accentColorLight100Percent() { return shadeColor(this.accentColor, 100) },
        get accentColorDark() { return shadeColor(this.accentColor, -20) },
        get selectionColor() { return this.accentColor + '20' },
        get accentColor10Percent() { return this.accentColor + '10' },
        get accentColor30Percent() { return this.accentColor + '30' },
        get accentColor60Percent() { return this.accentColor + '60' },
        get accentColor90Percent() { return this.accentColor + '90' },
        verticalMenuWidth: '15vw',
        verticalMenuMarginLeft: '2vw',
        verticalMenuBorderRadius: '10px',
        get verticalMenuTotalVerticalSpace() { return `calc(${this.verticalMenuWidth} + ${this.verticalMenuMarginLeft})` },
        get horizontalMenuHeight()
        {
            return DOMUtils.getMatchingMediaName() == 'mobile' ? '8vh' : '6vh'
        },
        screenXsMin: '480px',
        screenSmMin: '768px',
        screenMdMin: '992px',
        screenLgMin: '1200px',
        keyboardHeight: '40vh',
    },

    applyTheme ()
    {
        console.log('Applying theme to document')

        for (const property in this.properties)
        {
            document.documentElement.style.setProperty(`--theme-${String.toKebabCase(property)}`, this.properties[property])
        }
    },

    shadeColor
}
