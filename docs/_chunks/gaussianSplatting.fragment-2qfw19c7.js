import{wz as f}from"./site-mdjw4wfj.js";import{xz as c}from"./site-7a1331x1.js";import{yz as g}from"./site-cd6d8e0s.js";import{Gz as l}from"./site-5396gbjx.js";import{Vz as r}from"./site-bdxc68pn.js";import{Wz as t}from"./site-dhab8phj.js";import{Xz as i}from"./site-4a1hf6nf.js";import{Yz as n}from"./site-qy8vh6e0.js";import{TC as a}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var o="gaussianSplattingPixelShader",d=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#ifdef GPUPICKER_DEPTH
layout(location=0) out highp vec4 glFragData[2];
#endif
#ifdef GPUPICKER_PACK_DEPTH
#include<packingFunctions>
#endif
varying vec4 vColor;varying vec2 vPosition;
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<gaussianSplattingFragmentDeclaration>
void main () {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec4 finalColor=gaussianColor(vColor);
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef GPUPICKER_DEPTH
glFragData[0]=finalColor;
#ifdef GPUPICKER_PACK_DEPTH
glFragData[1]=pack(gl_FragCoord.z);
#else
glFragData[1]=vec4(gl_FragCoord.z,0.0,0.0,1.0);
#endif
#else
gl_FragColor=finalColor;
#endif
#define CUSTOM_FRAGMENT_MAIN_END
}
`;if(!a.ShadersStore[o])a.ShadersStore[o]=d;var m=[n,l,r,c,g,t,f,i];for(let e of m)if(!a.IncludesShadersStore[e.name])a.IncludesShadersStore[e.name]=e.shader;var E={name:o,shader:d};export{E as gaussianSplattingPixelShader};

//# debugId=E87F2626B93A98AE64756E2164756E21
//# sourceMappingURL=gaussianSplatting.fragment-2qfw19c7.js.map
