import{OA as s}from"./site-87xakm2d.js";import{PA as m}from"./site-pwbh5t5d.js";import{QA as f}from"./site-0ma0ypye.js";import{TA as i}from"./site-nd8mn4f1.js";import{UA as c}from"./site-pxptatb5.js";import{mB as n}from"./site-9kgzghsy.js";import{nB as l}from"./site-qyq8ndc8.js";import{oB as t}from"./site-2e2f7cy5.js";import{pB as a}from"./site-1nhd90ma.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var o="gpuRenderParticlesPixelShader",p=`var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;varying vUV: vec2f;varying vColor: vec4f;
#include<clipPlaneFragmentDeclaration>
#include<imageProcessingDeclaration>
#include<logDepthDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#include<fogFragmentDeclaration>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
let textureColor: vec4f=textureSample(diffuseSampler,diffuseSamplerSampler,input.vUV);var baseColor: vec4f=textureColor*input.vColor;
#ifdef BLENDMULTIPLYMODE
let alpha: f32=input.vColor.a*textureColor.a;baseColor=vec4f(baseColor.rgb*alpha+vec3f(1.0)*(1.0-alpha),baseColor.a);
#endif
#include<logDepthFragment>
#include<fogFragment>(color,baseColor)
#ifdef IMAGEPROCESSINGPOSTPROCESS
baseColor=vec4f(toLinearSpaceVec3(baseColor.rgb),baseColor.a);
#else
#ifdef IMAGEPROCESSING
baseColor=vec4f(toLinearSpaceVec3(baseColor.rgb),baseColor.a);baseColor=applyImageProcessing(baseColor);
#endif
#endif
fragmentOutputs.color=baseColor;}
`;if(!e.ShadersStoreWGSL[o])e.ShadersStoreWGSL[o]=p;var S=[a,s,c,i,m,n,t,f,l];for(let r of S)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var F={name:o,shader:p};export{F as gpuRenderParticlesPixelShaderWGSL};

//# debugId=ABCFBA60E21CD93164756E2164756E21
//# sourceMappingURL=gpuRenderParticles.fragment-6r895hj6.js.map
