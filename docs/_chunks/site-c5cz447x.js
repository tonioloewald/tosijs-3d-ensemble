import{Bz as n}from"./site-chw2k88q.js";import{RC as e}from"./site-eq33q5cn.js";var o="rgbdEncodePixelShader",t=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);}`;if(!e.ShadersStore[o])e.ShadersStore[o]=t;var d=[n];for(let r of d)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var s={name:o,shader:t};
export{s as wv};

//# debugId=FC05359EFA4E9D7764756E2164756E21
//# sourceMappingURL=site-c5cz447x.js.map
