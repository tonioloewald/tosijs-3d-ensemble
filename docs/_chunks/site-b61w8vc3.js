import{OA as n}from"./site-87xakm2d.js";import{PA as a}from"./site-pwbh5t5d.js";import{TA as s}from"./site-nd8mn4f1.js";import{TC as e}from"./site-qntg4d3x.js";var t="imageProcessingPixelShader",i=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
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
export{m as Rk};

//# debugId=535C1F85BB5B90E164756E2164756E21
//# sourceMappingURL=site-b61w8vc3.js.map
