import{Bz as t}from"./site-chw2k88q.js";import{RC as e}from"./site-eq33q5cn.js";var o="extractHighlightsPixelShader",a=`#include<helperFunctions>
varying vec2 vUV;uniform sampler2D textureSampler;uniform float threshold;uniform float exposure;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=texture2D(textureSampler,vUV);float luma=dot(LuminanceEncodeApprox,gl_FragColor.rgb*exposure);gl_FragColor.rgb=step(threshold,luma)*gl_FragColor.rgb;}`;if(!e.ShadersStore[o])e.ShadersStore[o]=a;var l=[t];for(let r of l)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var s={name:o,shader:a};
export{s as al};

//# debugId=D4E4F61432D140A264756E2164756E21
//# sourceMappingURL=site-3pjgack8.js.map
