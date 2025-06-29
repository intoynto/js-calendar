const path=require("path");
const TerserWebpackPlugin=require("terser-webpack-plugin");
const clean=require("./web.dev/clean");
const webpack=require("webpack");

module.exports=function(env,args)
{
    clean.doRemoveFolder("./dist");// remove dir
    const isProd=args && args.mode && args.mode==="production"?true:false;
    
    const dev={
        MODUL_NAME:'InputTanggal', // class Component
        DECLARE_MODUL_NAME:"intoy-calendar",
    };

    const entry={};
    entry[`${dev.MODUL_NAME}`]=path.resolve(__dirname,"src/index.tsx");

    console.log("======= Webpack mode. Prod = ",isProd);
    console.log('======= ENTRY =========');
    console.log(entry);

    const conf={
        mode:"production",
        entry,
        output:{
            chunkFilename: '[name].js',
            filename: 'index.js', // nama sesuikan dengan main pada package.json
            libraryTarget: 'umd',
            library: `${dev.MODUL_NAME}`,
            umdNamedDefine: true,

            clean: true, // dir
        },
        devtool:'source-map',
        resolve: { 
            extensions: [".ts",".tsx",".js",".jsx"],
            alias:{
                "react": "preact/compat",
                "react-dom": "preact/compat"
            } 
        },
        externals:{
            "react":"react",
            "react-dom":"react-dom",
            //"moment":"moment",
        },    
        module:{},
        optimization:{
            minimize:true,
            minimizer:[],
        },        
        plugins:[],
    };

    const rules=[];

    // rules ts,tsx,js,jsx
    rules.push({
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /(node_module|dist)/,
        use:[
                {
                    loader:"babel-loader",
                    options:{
                        presets:[
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                        plugins:[
                            "@babel/plugin-syntax-dynamic-import", // already include in @babel/preset-env work without yarn add

                            "@babel/plugin-transform-class-properties",
                            "@babel/plugin-transform-object-rest-spread", // already include in @babel/preset-env work without yarn add

                            "@babel/plugin-transform-runtime", // use tarnsform runtime (async  / await) work without yarn add
                            "babel-plugin-transform-react-remove-prop-types" 
                        ],
                    },
                },
                {
                    loader: 'ts-loader',
                },
        ]
    });   

    conf.module.rules=rules;
    
    conf.optimization.minimizer.push(
        new TerserWebpackPlugin({    
            terserOptions:{
                format:{
                    comments:false,
                }
            },            
            extractComments:false,                
        })
    );

    if(isProd)
    {
        conf.plugins.push(
            // Include only English, Indonesia locales
            //new webpack.ContextReplacementPlugin(/moment[/\\]locale$/,/^\.\/(en|id)$/)
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /id/)
        );
    }

    return conf;
}