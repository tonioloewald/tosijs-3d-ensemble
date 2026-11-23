import{Te,Ce}from"./site-5red3kgf.js";import{H}from"./site-n8nnc3kp.js";import{st,it}from"./site-1j9kyrc7.js";import{zi}from"./site-g74271hk.js";import{Ze}from"./site-kt68nzgc.js";import{Xi}from"../hydrate-xg9x7h5h.js";import{i}from"./site-1yf4ncc8.js";var r="firePixelShader",o=`uniform vEyePosition: vec4f;varying vPositionW: vec3f;
#ifdef VERTEXCOLOR
varying vColor: vec4f;
#endif
#ifdef DIFFUSE
varying vDiffuseUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;uniform vDiffuseInfos: vec2f;
#endif
var distortionSamplerSampler: sampler;var distortionSampler: texture_2d<f32>;var opacitySamplerSampler: sampler;var opacitySampler: texture_2d<f32>;
#ifdef DIFFUSE
varying vDistortionCoords1: vec2f;varying vDistortionCoords2: vec2f;varying vDistortionCoords3: vec2f;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
fn bx2(x: vec4f)->vec4f
{return vec4f(2.0)*x- vec4f(1.0);}
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var viewDirectionW: vec3f=normalize(uniforms.vEyePosition.xyz-fragmentInputs.vPositionW);var baseColor: vec4f= vec4f(1.,1.,1.,1.);var alpha: f32=1.0;
#ifdef DIFFUSE
let distortionAmount0: f32=0.092;let distortionAmount1: f32=0.092;let distortionAmount2: f32=0.092;var heightAttenuation: vec2f= vec2f(0.3,0.39);var noise0: vec4f=textureSample(distortionSampler,distortionSamplerSampler,fragmentInputs.vDistortionCoords1);var noise1: vec4f=textureSample(distortionSampler,distortionSamplerSampler,fragmentInputs.vDistortionCoords2);var noise2: vec4f=textureSample(distortionSampler,distortionSamplerSampler,fragmentInputs.vDistortionCoords3);var noiseSum: vec4f=bx2(noise0)*distortionAmount0+bx2(noise1)*distortionAmount1+bx2(noise2)*distortionAmount2;var perturbedBaseCoords: vec4f= vec4f(fragmentInputs.vDiffuseUV,0.0,1.0)+noiseSum*(fragmentInputs.vDiffuseUV.y*heightAttenuation.x+heightAttenuation.y);var opacityColor: vec4f=textureSample(opacitySampler,opacitySamplerSampler,perturbedBaseCoords.xy);
#ifdef ALPHATEST
if (opacityColor.r<0.1) {discard;}
#endif
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
baseColor=textureSample(diffuseSampler,diffuseSamplerSampler,perturbedBaseCoords.xy)*2.0;baseColor=baseColor*opacityColor;baseColor=vec4f(baseColor.rgb*uniforms.vDiffuseInfos.y,baseColor.a);
#endif
#endif
#ifndef DEPTHPREPASS
#ifdef VERTEXCOLOR
baseColor=vec4f(baseColor.rgb*fragmentInputs.vColor.rgb,baseColor.a);
#endif
var diffuseBase: vec3f= vec3f(1.0,1.0,1.0);
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=fragmentInputs.vColor.a;
#endif
var color: vec4f= vec4f(baseColor.rgb,alpha);
#include<logDepthFragment>
#include<fogFragment>
fragmentOutputs.color=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`;if(!i.ShadersStoreWGSL[r])i.ShadersStoreWGSL[r]=o;var t=[Te,H,st,Ce,zi,Ze,it,Xi];for(let e of t)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var v={name:r,shader:o};export{v as firePixelShaderWGSL};

//# debugId=C187BBD784A67D8A64756E2164756E21
//# sourceMappingURL=fire.fragment-m0atq6vn.js.map
