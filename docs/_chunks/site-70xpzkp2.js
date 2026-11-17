import{ie}from"./site-3khh9ern.js";import{i}from"./site-1yf4ncc8.js";var r="rgbdDecodePixelShader",o=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=vec4(fromRGBD(texture2D(textureSampler,vUV)),1.0);}`;if(!i.ShadersStore[r])i.ShadersStore[r]=o;var n=[ie];for(let e of n)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var TA={name:r,shader:o};
export{TA};

//# debugId=80C61D8A83A4108964756E2164756E21
//# sourceMappingURL=site-70xpzkp2.js.map
