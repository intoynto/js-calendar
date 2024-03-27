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

        const rules=[];

        rules.push({
            cl:'.InputTanggalBox',
            st:{
                'position':'relative',
                'border':`solid ${borderWidth['DEFAULT']} ${colors('gray.400')}`,
                'border-radius':`${borderRadius['DEFAULT']}`,
                'padding-left':defSpacingX,
                'width':'150px',
            },
        });

        rules.push({
            cl:'.InputTanggalBox .box_ymd',
            st:{
                'display':'flex',
                'flex-wrap':'nowrap',
                'gap':spacing['0.5'],  
                'align-items':'center',
                'position':'absolute',
                'top':'50%',
                'transform':'translateY(-50%)',
                'opacity':'1',
                'input':{
                    'border':'transparent !important',
                    'background-color':'transparent',
                    'text-align':'center',
                    'font-weight':'600',
                    'padding-left':'0 !important',
                    'padding-right':'0 !important',
                },
                'input:focus':{
                    'outline':'none !important',
                    'border':'transparent !important',
                    'box-shadow':'none !important',
                },
                '.d':{ 'color':colors('red.500'), },
                '.m':{ 'color':colors('green.600'), },
                '.y':{ 'color':colors('gray.500'), },
            },
        });

        // drop down calendar
        rules.push({
            cl:'.InputTanggalDropDown',
            st:{
                'position':'absolute',
                'z-index':'1',
                'padding-top':'10px',
                'opacity':'0',
                'visibility':'hidden',
            },
        });

        // focus
        rules.push({
            cl:'.InputTanggal.focus',
            st:{
                '.box_display':{
                    'opacity':'1',
                },
                '.box_ymd':{
                    'opacity':'1',
                },
                '.InputTanggalDropDown':{
                    'opacity':'1',
                    'visibility':'visible',
                }
            },
        });
        
        // popup
        rules.push({
            cl:'.InputTanggalPopup',
            st:{
                'background-color':'#fff',
                'box-shadow':`0 6px 10px 3px ${rgba('gray.500',0.75)}`,
                'border-radius':borderRadius['DEFAULT'],
                '.wrap_state':{
                    'display':'flex',
                },
                '.wrap_days, .wrap_dates, .wrap_months, .wrap_years':{
                    'display':'grid',
                    'grid-template-columns': 'repeat(7, minmax(0, 1fr))',
                    'gap':spacing['1'],
                    '&.hide':{
                        'display':'none',
                    },
                },
            },
        });

        // popup wrap state style
        rules.push({
            cl:'.InputTanggalPopup .wrap_state',
            st:{
                'display':'flex',
                'align-items':'center',
                'justify-content':'space-between',
                'button':{
                    'display':'inline-block',
                    'padding':'0 10px',
                    'border':'none',
                    'display':'flex',
                    'align-items':'center',
                    'border-radius':borderRadius['DEFAULT'],
                    '&:hover':{
                       'background-color':`${colors('gray.300')}`,
                    },
                    '&:focus,&:active':{
                        'background-color':`${colors('gray.200')}`,
                    },
                },
            },
        });

        // popup wrap
        rules.push({
            cl:'.InputTanggalWrap',
            st:{
                'min-width':'300px',
                'padding':'10px 10px',
                'display':'grid',
                'gap':spacing['2.5'],
            },
        });

        // popup wrap days
        rules.push({
            cl:'.InputTanggalWrap .wrap_days',
            st:{
                'font-size':'11px',
                'text-align':'center',
                'color':colors('gray.400'),
            },
        });

        // popup wrap item
        rules.push({
            cl:'.InputTanggalWrap .wrap_item',
            st:{
                'cursor':'pointer',
                'display':'flex',
                'align-items':'center',
                'justify-content':'center',
                'border-radius':borderRadius['DEFAULT'],
                'color':colors('gray.600'),
                '&.minggu':{
                    'color':colors('red.500'),
                },
                '&.sabtu':{
                    'color':colors('blue.500'),
                },
                '&.jumat':{
                    'color':colors('green.700'),
                },
                '&:hover':{
                    'background-color':colors('gray.300'),
                    'color':colors('gray.800'),
                },
                '> span ':{
                    'display':'inline-block',
                    'padding-left':'2px',
                    'padding-right':'2px',
                },
            },
        });
        // popup wrap item similar
        rules.push({
            cl:'.InputTanggalWrap .wrap_item.active',
            st:{
                'background-color':colors('gray.300'),
            },
        });

        // popup wrap item selected
        rules.push({
            cl:'.InputTanggalWrap .wrap_item.selected',
            st:{
                'background-color':colors('blue.500'),
                'color':'#fff',
            },
        });
        // popup wrap item disabled
        rules.push({
            cl:'.InputTanggalWrap .wrap_item.disabled',
            st:{
                'background-color':'transparent',
                'color':colors('gray.300'),
                'cursor':'no-drop',
            },
        });
        // popup wrap years, wrap monts
        rules.push({
            cl:'.InputTanggalWrap .wrap_years .wrap_item, .InputTanggalWrap .wrap_months .wrap_item',
            st:{
                'font-size':'14px',
            },
        });


        const getStrategyRules = (strategy) => rules
                            .map((rule) => {
                                if(rule[strategy])
                                {
                                    return { [rule[strategy]]: rule.st }
                                }

                                return null;
                                //if (rule[strategy] === null) return null
                                //return { [rule[strategy]]: rule.styles }
                            })
                            .filter(Boolean); 

        addComponents(getStrategyRules("cl"));
    }
});

module.exports = forms