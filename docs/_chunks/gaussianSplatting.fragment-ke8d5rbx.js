import{Oe,Ae}from"./site-ee0fs4cs.js";import{X}from"./site-z6szqkpd.js";import{rt,ot}from"./site-m57amydx.js";import{Xs,of}from"./site-72dstqtm.js";import{tt}from"./site-d2wa5zzv.js";import{i}from"./site-1yf4ncc8.js";var e="gaussianSplattingPixelShader",o=`#include<clipPlaneFragmentDeclaration>
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
`;if(!i.ShadersStore[e])i.ShadersStore[e]=o;var n=[Oe,X,rt,Xs,tt,ot,of,Ae];for(let a of n)if(!i.IncludesShadersStore[a.name])i.IncludesShadersStore[a.name]=a.shader;var F={name:e,shader:o};export{F as gaussianSplattingPixelShader};

//# debugId=F6CB1CB37133791064756E2164756E21
//# sourceMappingURL=gaussianSplatting.fragment-ke8d5rbx.js.map
