const twColors = require("tailwindcss/colors");

module.exports = { 
    mode:"jit",
    content: [
        './test/**/*.{js,ts,tsx}',
        './src/**/*.{ts,tsx}',
        './test/zIndex.html',

        "./node_modules/react-router/dist/*.js", // react-router
    ],       
    theme: {       
        extend : {           
            colors : {
                gray: twColors.slate,
                orange: twColors.orange,
                cyan: twColors.cyan,
                teal: twColors.teal,
                indigo: twColors.indigo,

                primary:twColors.blue,
            }
        }
        /*
        fontSize: {
            xs: ['0.65rem', { lineHeight: '0.875rem' }],
            sm: ['0.75rem', { lineHeight: '0.975rem' }],
            base: ['0.875rem', { lineHeight: '1.2rem' }],
            lg: ['1rem', { lineHeight: '1.5rem' }],
            xl: ['1.125rem', { lineHeight: '1.75rem' }],
            '2xl': ['1.25rem', { lineHeight: '1.75rem' }],
            '3xl': ['1.5rem', { lineHeight: '2rem' }],
            '4xl': ['1.875rem', { lineHeight: '2.25rem' }],
            '5xl': ['2.25rem', { lineHeight: '2.5rem' }],
            '6xl': ['3rem', { lineHeight: '1' }],
            '7xl': ['3.75rem', { lineHeight: '1' }],
            '8xl': ['4.5rem', { lineHeight: '1' }],
            '9xl': ['6rem', { lineHeight: '1' }],
            '10xl': ['8rem', { lineHeight: '1' }],
        },        
        */
    },
    variants: {
        extend: {},
        width: ["responsive", "hover", "focus"]
    },
    plugins: [
        require("./web.dev/tw.plugin.dev.base"), // dev base style 
        require("./web.dev/tw.plugin.dev.nav"), // dev nav style 
        require("./web.dev/tw.plugin.dev.inputTanggal"), // dev input tanggal
    ],
}