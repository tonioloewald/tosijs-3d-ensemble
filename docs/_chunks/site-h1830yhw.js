import{OA as o}from"./site-7611pkz2.js";import{SA as i}from"./site-tvsjdjzy.js";import{mB as t}from"./site-v9zm9412.js";import{nB as a}from"./site-yjav6xay.js";import{RC as e}from"./site-eq33q5cn.js";var n="outlinePixelShader",l=`uniform color: vec4f;
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
export{s as Ig};

//# debugId=E4FA4BEB6448B64F64756E2164756E21
//# sourceMappingURL=site-h1830yhw.js.map
