const JCG = require("./src/runner");
const fs = require('fs');
const v8 = require('v8')
const { setTimeout } = require("timers/promises");
const SUPPORTED_VERSIONS = [
   // 3,
 //   5,
 //   6, // 2015
 //   7, // 2016
 //   8, // 2017
 //   9, // 2018
 //   10, // 2019
 //   11, // 2020
 //   12, // 2021
    13, // 2022
    14 // 2023
];
const npmListFilePath = 'D:\\jsProject\\npm.txt'
const failFileName = './errProject.txt';
async function addFailPkgToFile(name){
    fs.appendFileSync(failFileName,name+'\n',function(err) {
        if(err) {
            console.log("Pkg:"+name+"is fail!");
            console.log(err);
        }
      });
}

async function getJCG(path,name){
    
    var outFileName = path + name + '/out-'+name+'.json';
    console.log(outFileName)
    const args =  
    {
        strategy : 'ONESHOT',
        cg : true,
        output : [outFileName],
    };
    // console.log(args['strategy'])
    var allVerFail=true;
    for(var i = SUPPORTED_VERSIONS.length -1 ;i >= 0 ;i--){
    //for(var i = 4 ;i <= 4;i++){
        var stop = true;
        try{
            args.ecmaVersion = SUPPORTED_VERSIONS[i];
            // args['ecmaVersion']
            JCG.setArgs(args);        
            // # Optional, specify a list of arguments
            // JCG.setFiles(['C:/Users/qingo/frontend-project/sass-loader/sass-loader']);
            JCG.setFiles([path+name]);          
            // # List of files or directories to analyze
            // JCG.setFilter(['-test[^\.]*.js', '+test576.js']); 
            // # Optional, please see "Filter file format" section for details
            // JCG.setConsoleOutput(true);                     
            // # Optional, the console output can be turned off.
            JCG.build();
            //setTimeout(getJCG,0);
        } catch(e){
            console.log('err------------------ecmaVersion : '+ SUPPORTED_VERSIONS[i])
            console.log(e)
            stop=false;
        } 
        if(stop){
            console.log('ok............ecmaVersion : '+ SUPPORTED_VERSIONS[i])
            allVerFail=false
            break;
        }
    }
    if(allVerFail)
        await addFailPkgToFile(name)
}
console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))
var filePathPrefix = 'D:/js项目/unCompress/'
fs.readFile(npmListFilePath,'utf8',async function(err,dataStr){
    if(err){
        return console.log('读取npm list文件失败！'+err.message)
    }
    st = dataStr.split('\n' )
    for(var i = 97 ;i<98;i++){
        // var name = st[i].substring(0,st[i].length-1);
        console.log(process.memoryUsage())
        var name = "prettier";
        var realName = name; 
        if(name[0] == '@'){
            // console.log(name);
            var index = name.indexOf('/');
            var prename = name.substring(1,index);
            var subname = name.substring(index+1,name.length);
            // console.log(name);
            //  console.log("prename = " + prename);
            realName = prename+'-'+subname;
        }
        try{
            await getJCG(filePathPrefix,realName);
        }catch(e){
            console.log(e)
        }
        
    }
})