import validate from"./validate.js";for(var byteToHex=[],i=0;i<256;++i)byteToHex.push((i+256).toString(16).substr(1));function stringify(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,o=(byteToHex[e[t+0]]+byteToHex[e[t+1]]+byteToHex[e[t+2]]+byteToHex[e[t+3]]+"-"+byteToHex[e[t+4]]+byteToHex[e[t+5]]+"-"+byteToHex[e[t+6]]+byteToHex[e[t+7]]+"-"+byteToHex[e[t+8]]+byteToHex[e[t+9]]+"-"+byteToHex[e[t+10]]+byteToHex[e[t+11]]+byteToHex[e[t+12]]+byteToHex[e[t+13]]+byteToHex[e[t+14]]+byteToHex[e[t+15]]).toLowerCase();if(!validate(o))throw TypeError("Stringified UUID is invalid");return o}export default stringify;