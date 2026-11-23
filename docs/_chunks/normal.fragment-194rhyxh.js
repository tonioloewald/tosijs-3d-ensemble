import{ee}from"./site-6tn24edh.js";import{ii,ri,zi}from"./site-g74271hk.js";import{Hi}from"./site-67rdeqqf.js";import{Te,Ce}from"./site-5red3kgf.js";import{H}from"./site-n8nnc3kp.js";import{st,it}from"./site-1j9kyrc7.js";import{vi}from"./site-n3pnr0nr.js";import{Ze}from"./site-kt68nzgc.js";import{Xi}from"../hydrate-1ctxyq89.js";import{i}from"./site-1yf4ncc8.js";var r="normalPixelShader",f=`uniform vEyePosition: vec4f;uniform vDiffuseColor: vec4f;varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#ifdef LIGHTING
#include<helperFunctions>
#include<lightUboDeclaration>[0]
#include<lightUboDeclaration>[1]
#include<lightUboDeclaration>[2]
#include<lightUboDeclaration>[3]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#endif
#ifdef DIFFUSE
varying vDiffuseUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;uniform vDiffuseInfos: vec2f;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var viewDirectionW: vec3f=normalize(uniforms.vEyePosition.xyz-fragmentInputs.vPositionW);var baseColor: vec4f= vec4f(1.,1.,1.,1.);var diffuseColor: vec3f=uniforms.vDiffuseColor.rgb;var alpha: f32=uniforms.vDiffuseColor.a;
#ifdef DIFFUSE
baseColor=textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vDiffuseUV);
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
#ifdef NORMAL
baseColor=mix(baseColor, vec4f(fragmentInputs.vNormalW,1.0),0.5);
#endif
#ifdef NORMAL
var normalW: vec3f=normalize(fragmentInputs.vNormalW);
#else
var normalW: vec3f= vec3f(1.0,1.0,1.0);
#endif
#ifdef LIGHTING
var diffuseBase: vec3f= vec3f(0.,0.,0.);var info: lightingInfo;var shadow: f32=1.;var glossiness: f32=0.;var aggShadow: f32=0.;var numLights: f32=0.;
#include<lightFragment>[0]
#include<lightFragment>[1]
#include<lightFragment>[2]
#include<lightFragment>[3]
var finalDiffuse: vec3f=clamp(diffuseBase*diffuseColor,vec3f(0.0),vec3f(1.0))*baseColor.rgb;
#else
var finalDiffuse: vec3f= baseColor.rgb;
#endif
var color: vec4f= vec4f(finalDiffuse,alpha);
#include<logDepthFragment>
#include<fogFragment>
fragmentOutputs.color=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`;if(!i.ShadersStoreWGSL[r])i.ShadersStoreWGSL[r]=f;var n=[ee,ii,Hi,ri,Te,H,st,Ce,zi,vi,Ze,it,Xi];for(let e of n)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var F={name:r,shader:f};export{F as normalPixelShaderWGSL};

//# debugId=835DFE5671508DC664756E2164756E21
//# sourceMappingURL=normal.fragment-194rhyxh.js.map
