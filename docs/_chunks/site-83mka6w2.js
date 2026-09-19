import{Bz as n}from"./site-chw2k88q.js";import{RC as e}from"./site-eq33q5cn.js";var o="rgbdDecodePixelShader",t=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=vec4(fromRGBD(texture2D(textureSampler,vUV)),1.0);}`;if(!e.ShadersStore[o])e.ShadersStore[o]=t;var d=[n];for(let r of d)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var s={name:o,shader:t};
export{s as vv};

//# debugId=51ED4E111FB3470D64756E2164756E21
//# sourceMappingURL=site-83mka6w2.js.map
