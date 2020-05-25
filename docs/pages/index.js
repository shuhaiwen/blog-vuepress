const fs = require('fs')
const path = require('path')

var curDir = path.resolve('.');
console.log(curDir);
var allFile = [];
let bFlag = false;

function getArray(title, files) {
    return {
        title: title,
        collapsable: true,
        children: files
    }
}
function getFirstLayerFolderSync(dir) {
    let floder=[];
    let dirs = fs.readdirSync(dir);
    dirs.forEach(function (fileName) {
        let fileDir = path.join(dir, fileName);
        let stats = fs.statSync(fileDir);
        if (stats.isFile()) {

        } else if (stats.isDirectory()) {
            floder.push(fileDir);
            console.log(fileDir);
        }
    });
    return floder;
}
function getAllFilesSync(dir) {
    let allFile=[];
    let dirs = fs.readdirSync(dir);
    dirs.forEach(function (fileName) {
        let fileDir = path.join(dir, fileName);
        let stats = fs.statSync(fileDir);
        
        if (stats.isFile()) {
            let extname=path.extname(fileDir).toLowerCase();
            if(path.basename(fileDir).toUpperCase().search('README')<0){
                if(extname=='.md'||extname=='.html'){
                    // console.log(fileDir);
                     allFile.push(fileDir);
                 } 
            }
            else{
               
            }
           
        } else if (stats.isDirectory()) {
            getAllFilesSync(fileDir);
        }
    })
    return allFile;
}
function getSubString(searchStr,orignStr){
    return orignStr.substr(searchStr.length+1);
}
function getSideBarInfo(curDir) {
    curDir=path.resolve(curDir);   
    let dirs = getFirstLayerFolderSync(curDir);
    let ret = [];
    
    for (const dir of dirs) {
        let files =getAllFilesSync(dir);
        for (let index = 0; index < files.length; index++) {
            files[index]=getSubString(curDir,files[index]);
            files[index]=files[index].replace(/\\/g,'/');
            console.log(files[index]);
        }
        if(files.length>0){
            ret.push(getArray(path.basename(dir), files));
        }      
    }
    return ret;
}
module.exports= getSideBarInfo;



