import{ie}from"./site-3khh9ern.js";import{i}from"./site-1yf4ncc8.js";var r="lodCubePixelShader",o=`precision highp float;
#ifndef USE_EXACT_SRGB_CONVERSIONS
#define USE_EXACT_SRGB_CONVERSIONS
#endif
#include<helperFunctions>
varying vec2 vUV;uniform samplerCube textureSampler;uniform float lod;uniform int gamma; 
void main(void)
{vec2 uv=vUV*2.0-1.0;
#ifdef POSITIVEX
gl_FragColor=textureCube(textureSampler,vec3(1.001,uv.y,uv.x),lod);
#endif
#ifdef NEGATIVEX
gl_FragColor=textureCube(textureSampler,vec3(-1.001,uv.y,uv.x),lod);
#endif
#ifdef POSITIVEY
gl_FragColor=textureCube(textureSampler,vec3(uv.y,1.001,uv.x),lod);
#endif
#ifdef NEGATIVEY
gl_FragColor=textureCube(textureSampler,vec3(uv.y,-1.001,uv.x),lod);
#endif
#ifdef POSITIVEZ
gl_FragColor=textureCube(textureSampler,vec3(uv,1.001),lod);
#endif
#ifdef NEGATIVEZ
gl_FragColor=textureCube(textureSampler,vec3(uv,-1.001),lod);
#endif
if (gamma==0) {gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(GammaEncodePowerApprox));} else if (gamma==2) {gl_FragColor.rgb=toGammaSpaceExact(gl_FragColor.rgb);}}
`;if(!i.ShadersStore[r])i.ShadersStore[r]=o;var l=[ie];for(let e of l)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var QR={name:r,shader:o};
export{QR};

//# debugId=67B9008830CF72D164756E2164756E21
//# sourceMappingURL=site-qwetbjee.js.map
