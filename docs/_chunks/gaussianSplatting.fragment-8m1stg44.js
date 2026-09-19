import{sz as m}from"./site-7bmbqsnn.js";import{tz as g}from"./site-sx1rnsnr.js";import{OA as l}from"./site-7611pkz2.js";import{SA as f}from"./site-tvsjdjzy.js";import{kB as r}from"./site-3k38km0y.js";import{lB as o}from"./site-zxff350y.js";import{mB as i}from"./site-v9zm9412.js";import{nB as t}from"./site-yjav6xay.js";import{RC as n}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var a="gaussianSplattingPixelShader",s=`#include<clipPlaneFragmentDeclaration>
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

//# debugId=6A816C87F94E1DEC64756E2164756E21
//# sourceMappingURL=gaussianSplatting.fragment-8m1stg44.js.map
