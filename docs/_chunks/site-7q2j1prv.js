import{ie}from"./site-3khh9ern.js";import{i}from"./site-1yf4ncc8.js";var r="rgbdEncodePixelShader",o=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);}`;if(!i.ShadersStore[r])i.ShadersStore[r]=o;var n=[ie];for(let e of n)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var CA={name:r,shader:o};
export{CA};

//# debugId=25CEDCCFCB3F35BC64756E2164756E21
//# sourceMappingURL=site-7q2j1prv.js.map
