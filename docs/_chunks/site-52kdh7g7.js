import{ie}from"./site-3khh9ern.js";import{i}from"./site-1yf4ncc8.js";var r="lodPixelShader",o=`precision highp float;
#ifndef USE_EXACT_SRGB_CONVERSIONS
#define USE_EXACT_SRGB_CONVERSIONS
#endif
#include<helperFunctions>
varying vec2 vUV;uniform sampler2D textureSampler;uniform float lod;uniform vec2 texSize;uniform int gamma; 
void main(void)
{ivec2 textureDimensions=textureSize(textureSampler,0);gl_FragColor=texelFetch(textureSampler,ivec2(vUV*vec2(textureDimensions)),int(lod));if (gamma==0) {gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(GammaEncodePowerApprox));} else if (gamma==2) {gl_FragColor.rgb=toGammaSpaceExact(gl_FragColor.rgb);}}
`;if(!i.ShadersStore[r])i.ShadersStore[r]=o;var a=[ie];for(let e of a)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var MR={name:r,shader:o};
export{MR};

//# debugId=6B5E8AD4AA1A227C64756E2164756E21
//# sourceMappingURL=site-52kdh7g7.js.map
