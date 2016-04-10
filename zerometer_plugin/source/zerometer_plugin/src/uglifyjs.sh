#!/bin/sh
#
# This file is used to compress js files.
# create by Allen Heavey. £ÀMDGeeker
# 2013/02/01
# 
# 

function init(){
    local par=$@
    local parentDir=${par%%/*}
    local utilJS="/util.js"
    local configJS="/config.js"
    local plugin_contentJS="/plugin_content.js"
    
    uglifyjs ${parentDir}${utilJS} -c -m --comments /[@=]/ -o ${parentDir}${utilJS}
    uglifyjs ${parentDir}${configJS} -c -m --comments /[@=]/ -o ${parentDir}${configJS}
    uglifyjs ${parentDir}${plugin_contentJS} -c -m --comments /[@=]/ -o ${parentDir}${plugin_contentJS}
}
 
function compressJS(){
    #local par=$@
    #local parentDir=${par%%/*}
    #local configJS="/config.js"
    #local plugin_contentJS="/plugin_content.js"
    #local jQueryJS="/jquery-1.11.0.min.js" 
        
    #uglifyjs ${parentDir}${jQueryJS} ${parentDir}${configJS} ${parentDir}${plugin_contentJS} $1 -c -m --mangle-props --comments /[@=]/ -o $1
    #--mangle-props
    #uglifyjs ${parentDir}${configJS} $1 ${parentDir}${plugin_contentJS} -c -m --comments /[@=]/ -o $1
    
    echo $1
    uglifyjs $1 -c -m --comments /[@=]/ -o $1
    #cat ${parentDir}${jQueryJS} >> $1
}
 
function compress() {
    local par=$1
    local split="/"
    if [ -f $par ] && [ -r $par ] && [ "${par##*.}" == "js" ] && [[ $par == *_Xcontent* ]]; then
        compressJS $par
    elif [ -d $par ]; then
        for i in `ls $par`
        do
            local j=${par}${split}${i}
            #test -d $j && echo "dir $j " || echo "file $j"
            compress $j
            unset j
        done
        unset i
    fi
 
}

for var in $@
do
    path=${var}
    init $path
    compress $path
done
