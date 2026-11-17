import{ee}from"./site-6tn24edh.js";import{ii,ri,zi}from"./site-g74271hk.js";import{H}from"./site-n8nnc3kp.js";import{Hi}from"./site-67rdeqqf.js";import{st,it}from"./site-1j9kyrc7.js";import{Te,Ce}from"./site-5red3kgf.js";import{vi}from"./site-n3pnr0nr.js";import{Ze}from"./site-kt68nzgc.js";import{Xi}from"../hydrate-1ej7e9f6.js";import{i}from"./site-1yf4ncc8.js";var r="furPixelShader",f=`uniform vEyePosition: vec4f;uniform vDiffuseColor: vec4f;uniform furColor: vec4f;uniform furLength: f32;varying vPositionW: vec3f;varying vfur_length: f32;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#ifdef VERTEXCOLOR
varying vColor: vec4f;
#endif
#include<helperFunctions>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#ifdef DIFFUSE
varying vDiffuseUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;uniform vDiffuseInfos: vec2f;
#endif
#ifdef HIGHLEVEL
uniform furOffset: f32;uniform furOcclusion: f32;var furTextureSampler: sampler;var furTexture: texture_2d<f32>;varying vFurUV: vec2f;
#endif
#include<logDepthDeclaration>
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<fogFragmentDeclaration>
#include<clipPlaneFragmentDeclaration>
fn Rand(rv: vec3f)->f32 {var x: f32=dot(rv, vec3f(12.9898,78.233,24.65487));return fract(sin(x)*43758.5453);}
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var viewDirectionW: vec3f=normalize(uniforms.vEyePosition.xyz-fragmentInputs.vPositionW);var baseColor: vec4f=uniforms.furColor;var diffuseColor: vec3f=uniforms.vDiffuseColor.rgb;var alpha: f32=uniforms.vDiffuseColor.a;
#ifdef DIFFUSE
baseColor=baseColor*textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vDiffuseUV);
#ifdef ALPHATEST
if (baseColor.a<0.4) {discard;}
#endif
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
baseColor=vec4f(baseColor.rgb*uniforms.vDiffuseInfos.y,baseColor.a);
#endif
#endif
#ifndef DEPTHPREPASS
#ifdef VERTEXCOLOR
baseColor=vec4f(baseColor.rgb*fragmentInputs.vColor.rgb,baseColor.a);
#endif
#ifdef NORMAL
var normalW: vec3f=normalize(fragmentInputs.vNormalW);
#else
var normalW: vec3f= vec3f(1.0,1.0,1.0);
#endif
#ifdef HIGHLEVEL
var furTextureColor: vec4f=textureSample(furTexture,furTextureSampler, vec2f(fragmentInputs.vFurUV.x,fragmentInputs.vFurUV.y));if (furTextureColor.a<=0.0 || furTextureColor.g<uniforms.furOffset) {discard;}
var occlusion: f32=mix(0.0,furTextureColor.b*1.2,uniforms.furOffset);baseColor= vec4f(baseColor.xyz*max(occlusion,uniforms.furOcclusion),1.1-uniforms.furOffset);
#endif
var diffuseBase: vec3f= vec3f(0.,0.,0.);var info: lightingInfo;var shadow: f32=1.;var glossiness: f32=0.;var aggShadow: f32=0.;var numLights: f32=0.;
#ifdef SPECULARTERM
var specularBase: vec3f= vec3f(0.,0.,0.);
#endif
#include<lightFragment>[0..maxSimultaneousLights]
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=fragmentInputs.vColor.a;
#endif
var finalDiffuse: vec3f=clamp(diffuseBase.rgb*baseColor.rgb,vec3f(0.0),vec3f(1.0));
#ifdef HIGHLEVEL
var color: vec4f= vec4f(finalDiffuse,alpha);
#else
var rr: f32=fragmentInputs.vfur_length/uniforms.furLength*0.5;var color: vec4f= vec4f(finalDiffuse*(0.5+rr),alpha);
#endif
#include<logDepthFragment>
#include<fogFragment>
fragmentOutputs.color=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`;if(!i.ShadersStoreWGSL[r])i.ShadersStoreWGSL[r]=f;var o=[ee,ii,H,Hi,ri,st,Te,Ce,zi,vi,Ze,it,Xi];for(let e of o)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var C={name:r,shader:f};export{C as furPixelShaderWGSL};

//# debugId=FC1A2EA2CE20DD0564756E2164756E21
//# sourceMappingURL=fur.fragment-qzv2ec9q.js.map
