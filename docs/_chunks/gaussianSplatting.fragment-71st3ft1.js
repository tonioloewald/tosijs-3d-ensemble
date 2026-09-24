import{uz as m}from"./site-7scp24az.js";import{vz as g}from"./site-531vkf5e.js";import{QA as l}from"./site-0ma0ypye.js";import{UA as f}from"./site-pxptatb5.js";import{mB as r}from"./site-9kgzghsy.js";import{nB as o}from"./site-qyq8ndc8.js";import{oB as i}from"./site-2e2f7cy5.js";import{pB as t}from"./site-1nhd90ma.js";import{TC as n}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var a="gaussianSplattingPixelShader",s=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#ifdef GPUPICKER_PACK_DEPTH
#include<packingFunctions>
#endif
varying vColor: vec4f;varying vPosition: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<gaussianSplattingFragmentDeclaration>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var finalColor: vec4f=gaussianColor(input.vColor,input.vPosition);
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef GPUPICKER_DEPTH
fragmentOutputs.fragData0=finalColor;
#ifdef GPUPICKER_PACK_DEPTH
fragmentOutputs.fragData1=pack(fragmentInputs.position.z);
#else
fragmentOutputs.fragData1=vec4f(fragmentInputs.position.z,0.0,0.0,1.0);
#endif
#else
fragmentOutputs.color=finalColor;
#endif
#define CUSTOM_FRAGMENT_MAIN_END
}
`;if(!n.ShadersStoreWGSL[a])n.ShadersStoreWGSL[a]=s;var c=[t,f,r,g,l,o,m,i];for(let e of c)if(!n.IncludesShadersStoreWGSL[e.name])n.IncludesShadersStoreWGSL[e.name]=e.shader;var _={name:a,shader:s};export{_ as gaussianSplattingPixelShaderWGSL};

//# debugId=3DC9AD3D660AC21164756E2164756E21
//# sourceMappingURL=gaussianSplatting.fragment-71st3ft1.js.map
