import{MA as n}from"./site-8dvn2q8d.js";import{NA as a}from"./site-y1qjnjd6.js";import{RA as s}from"./site-cgmwaca2.js";import{RC as e}from"./site-eq33q5cn.js";var t="imageProcessingPixelShader",i=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);result=vec4f(max(result.rgb,vec3f(0.)),result.a);
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result=vec4f(toLinearSpaceVec3(result.rgb),result.a);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
fragmentOutputs.color=result;}`;if(!e.ShadersStoreWGSL[t])e.ShadersStoreWGSL[t]=i;var o=[n,s,a];for(let r of o)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var m={name:t,shader:i};
export{m as Pk};

//# debugId=300A06B6A81F881664756E2164756E21
//# sourceMappingURL=site-gv5ggw3t.js.map
