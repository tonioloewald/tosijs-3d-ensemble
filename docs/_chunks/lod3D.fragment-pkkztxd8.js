import{ie}from"./site-3khh9ern.js";import{i}from"./site-1yf4ncc8.js";var r="lod3DPixelShader",o=`precision highp float;precision highp sampler3D;
#ifndef USE_EXACT_SRGB_CONVERSIONS
#define USE_EXACT_SRGB_CONVERSIONS
#endif
#include<helperFunctions>
varying vec2 vUV;uniform sampler3D textureSampler;uniform float lod;uniform float slice;uniform int gamma; 
void main(void)
{ivec3 textureCoordinates=ivec3(vUV*vec2(textureSize(textureSampler,0).xy),int(slice));gl_FragColor=texelFetch(textureSampler,textureCoordinates,int(lod));if (gamma==0) {gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(GammaEncodePowerApprox));} else if (gamma==2) {gl_FragColor.rgb=toGammaSpaceExact(gl_FragColor.rgb);}}
`;if(!i.ShadersStore[r])i.ShadersStore[r]=o;var a=[ie];for(let e of a)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;

//# debugId=1DE2E9504EACC54C64756E2164756E21
//# sourceMappingURL=lod3D.fragment-pkkztxd8.js.map
