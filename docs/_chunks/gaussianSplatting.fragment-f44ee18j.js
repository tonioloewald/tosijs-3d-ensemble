import{uz as f}from"./site-09ma2t46.js";import{vz as c}from"./site-2xahtbwr.js";import{wz as g}from"./site-njq9fpyp.js";import{Ez as l}from"./site-qn42tyww.js";import{Tz as r}from"./site-ym4sz14a.js";import{Uz as t}from"./site-ky8cdnt3.js";import{Vz as i}from"./site-fypy0ssm.js";import{Wz as n}from"./site-9re6xjgb.js";import{RC as a}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="gaussianSplattingPixelShader",d=`#include<clipPlaneFragmentDeclaration>
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

//# debugId=D30042CAE30C76C064756E2164756E21
//# sourceMappingURL=gaussianSplatting.fragment-f44ee18j.js.map
