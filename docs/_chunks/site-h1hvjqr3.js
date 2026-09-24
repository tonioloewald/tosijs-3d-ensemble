import{Dz as n}from"./site-231618cv.js";import{TC as e}from"./site-qntg4d3x.js";var o="rgbdEncodePixelShader",t=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);}`;if(!e.ShadersStore[o])e.ShadersStore[o]=t;var d=[n];for(let r of d)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var s={name:o,shader:t};
export{s as yv};

//# debugId=BA82E81D1926826A64756E2164756E21
//# sourceMappingURL=site-h1hvjqr3.js.map
