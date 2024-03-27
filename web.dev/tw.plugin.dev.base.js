const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');
const { borderWidth, borderRadius, spacing } = defaultTheme;
const tinyColor=require("tinycolor2");

function rgb(color)
{
    const c=tinyColor(color).toRgb();
    const {r,g,b}=c;
    return `${[r,g,b].join(",")}`;
}

const forms=plugin.withOptions(function()
{
    return function ({addBase,addComponents,addUtilities,theme})
    {       
        const resolveFontSize=function(nm)
        {
            return theme("fontSize")[nm][0];
        };

        const resolveLineHeight=function(nm){
            return theme("fontSize")[nm][1].lineHeight;
        };

        const textSize=function(nm){
            return {
                'font-size':theme("fontSize")[nm][0],
                'line-height':theme("fontSize")[nm][1].lineHeight,                
            };
        };

        const colors=function(nm){
            return theme(`colors.${nm}`);
        };

        const rgba=function(nm=null,opacity){
            const color=colors(nm);
            if(opacity>=1)
            {
                return color;
            }
            const {r,g,b}=tinyColor(color).toRgb();
            return `rgba(${[r,g,b,opacity].join(',')})`;
        };

        const defSpacingX=spacing['1.5'];
        const defSpacingY=spacing['2'];
        const defBorderRadius=borderRadius.DEFAULT;
        const defColor=rgb(theme('colors.gray.400'));
        const defColorFocus=rgb(theme('colors.primary.500'));
        const bases= {
            'html,body':{
                ...textSize("base"),
            },
            'a':{
                'cursor':'pointer',
                'color':colors('primary.500'),
                '&:hover':{
                    'color':colors('primary.600'),
                },
            },
        };

        const argInputs=['input[type="text"]'];
        const inputDefaults=argInputs.join(' ');


        const rules=[
            {    
                class:inputDefaults,
                styles:{
                    '--bd-color':colors('gray.500'),
                    '--sd-color':colors('gray.400'),
                    'appearance':'none',
                    'padding':`${spacing['1']}`,
                    'border':`solid ${borderWidth['DEFAULT']} var(--bd-color)`,
                    'border-radius':`${borderRadius['DEFAULT']}`,
                    '&:focus':{
                        'outline':'none',
                        'box-shadow':`0 0 0 3px ${rgba('gray.400',0.5)}`,
                    },
                },
            }
        ];


        const getStrategyRules = (strategy) => rules
                            .map((rule) => {
                                if(rule[strategy])
                                {
                                    return { [rule[strategy]]: rule.styles }
                                }

                                return null;
                                //if (rule[strategy] === null) return null
                                //return { [rule[strategy]]: rule.styles }
                            })
                            .filter(Boolean); 

        addComponents(getStrategyRules("class"));
    }
});

module.exports = forms