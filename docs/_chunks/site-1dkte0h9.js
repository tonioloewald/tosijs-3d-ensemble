import{QA as o}from"./site-0ma0ypye.js";import{UA as i}from"./site-pxptatb5.js";import{oB as t}from"./site-2e2f7cy5.js";import{pB as a}from"./site-1nhd90ma.js";import{TC as e}from"./site-qntg4d3x.js";var n="outlinePixelShader",l=`uniform color: vec4f;
#ifdef ALPHATEST
varying vUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vUV).a<0.4) {discard;}
#endif
#include<logDepthFragment>
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!e.ShadersStoreWGSL[n])e.ShadersStoreWGSL[n]=l;var f=[a,i,t,o];for(let r of f)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var s={name:n,shader:l};
export{s as Kg};

//# debugId=246EFEF43AEC9B0E64756E2164756E21
//# sourceMappingURL=site-1dkte0h9.js.map
