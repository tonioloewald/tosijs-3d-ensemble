import{Dz as a}from"./site-231618cv.js";import{TC as e}from"./site-qntg4d3x.js";var o="grainPixelShader",n=`#include<helperFunctions>
uniform sampler2D textureSampler; 
uniform float intensity;uniform float animatedSeed;varying vec2 vUV;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(textureSampler,vUV);vec2 seed=vUV*(animatedSeed);float grain=dither(seed,intensity);float lum=getLuminance(gl_FragColor.rgb);float grainAmount=(cos(-PI+(lum*PI*2.))+1.)/2.;gl_FragColor.rgb+=grain*grainAmount;gl_FragColor.rgb=max(gl_FragColor.rgb,0.0);}`;if(!e.ShadersStore[o])e.ShadersStore[o]=n;var t=[a];for(let r of t)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var d={name:o,shader:n};
export{d as Qk};

//# debugId=44F7AA02FAEB8D9064756E2164756E21
//# sourceMappingURL=site-0cvdg3b1.js.map
