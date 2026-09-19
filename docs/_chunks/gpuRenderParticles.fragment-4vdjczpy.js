import{MA as s}from"./site-8dvn2q8d.js";import{NA as m}from"./site-y1qjnjd6.js";import{OA as f}from"./site-7611pkz2.js";import{RA as i}from"./site-cgmwaca2.js";import{SA as c}from"./site-tvsjdjzy.js";import{kB as n}from"./site-3k38km0y.js";import{lB as l}from"./site-zxff350y.js";import{mB as t}from"./site-v9zm9412.js";import{nB as a}from"./site-yjav6xay.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="gpuRenderParticlesPixelShader",p=`var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;varying vUV: vec2f;varying vColor: vec4f;
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

//# debugId=9394ADA9740F6C9A64756E2164756E21
//# sourceMappingURL=gpuRenderParticles.fragment-4vdjczpy.js.map
