function extend(obj: any, src: any) {
    for (const key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

function deepExtend(obj: any, src: any){
    for (const key in src) {
        if (src.hasOwnProperty(key)){
            if (typeof src[key] !== 'object'){
                obj[key] = src[key]
                continue;
            }
            deepExtend(obj[key], src[key])
        }
    }
    return obj;
}

export { extend, deepExtend }