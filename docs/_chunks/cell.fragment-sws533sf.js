import{ee}from"./site-6tn24edh.js";import{ii,ri,zi}from"./site-g74271hk.js";import{Hi}from"./site-67rdeqqf.js";import{Te,Ce}from"./site-5red3kgf.js";import{H}from"./site-n8nnc3kp.js";import{st,it}from"./site-1j9kyrc7.js";import{vi}from"./site-n3pnr0nr.js";import{Ze}from"./site-kt68nzgc.js";import{Xi}from"../hydrate-1ej7e9f6.js";import{i}from"./site-1yf4ncc8.js";var f="cellPixelShader",o=`uniform vEyePosition: vec4f;uniform vDiffuseColor: vec4f;varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#ifdef VERTEXCOLOR
varying vColor: vec4f;
#endif
#include<helperFunctions>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#ifdef DIFFUSE
varying vDiffuseUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;uniform vDiffuseInfos: vec2f;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
fn computeCustomDiffuseLighting(info: lightingInfo,diffuseBaseIn: vec3f,shadow: f32)->vec3f
{var diffuseBase: vec3f=info.diffuse*shadow;
#ifdef CELLBASIC
var level: f32=1.0;if (info.ndl<0.5) {level=0.5;}
diffuseBase=diffuseBase.rgb* vec3f(level,level,level);
#else
var ToonThresholds: array<f32,4>;ToonThresholds[0]=0.95;ToonThresholds[1]=0.5;ToonThresholds[2]=0.2;ToonThresholds[3]=0.03;var ToonBrightnessLevels: array<f32,5>;ToonBrightnessLevels[0]=1.0;ToonBrightnessLevels[1]=0.8;ToonBrightnessLevels[2]=0.6;ToonBrightnessLevels[3]=0.35;ToonBrightnessLevels[4]=0.2;if (info.ndl>ToonThresholds[0])
{diffuseBase=diffuseBase.rgb*ToonBrightnessLevels[0];}
else if (info.ndl>ToonThresholds[1])
{diffuseBase=diffuseBase.rgb*ToonBrightnessLevels[1];}
else if (info.ndl>ToonThresholds[2])
{diffuseBase=diffuseBase.rgb*ToonBrightnessLevels[2];}
else if (info.ndl>ToonThresholds[3])
{diffuseBase=diffuseBase.rgb*ToonBrightnessLevels[3];}
else
{diffuseBase=diffuseBase.rgb*ToonBrightnessLevels[4];}
#endif
return max(diffuseBase, vec3f(0.2));}
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
#ifdef VERTEXCOLOR
baseColor=vec4f(baseColor.rgb*fragmentInputs.vColor.rgb,baseColor.a);
#endif
#ifdef NORMAL
var normalW: vec3f=normalize(fragmentInputs.vNormalW);
#else
var normalW: vec3f= vec3f(1.0,1.0,1.0);
#endif
var info: lightingInfo;var diffuseBase: vec3f= vec3f(0.,0.,0.);var shadow: f32=1.;var glossiness: f32=0.;var aggShadow: f32=0.;var numLights: f32=0.;
#ifdef SPECULARTERM
var specularBase: vec3f= vec3f(0.,0.,0.);
#endif
#include<lightFragment>[0..maxSimultaneousLights]
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=fragmentInputs.vColor.a;
#endif
var finalDiffuse: vec3f=clamp(diffuseBase*diffuseColor,vec3f(0.0),vec3f(1.0))*baseColor.rgb;var color: vec4f= vec4f(finalDiffuse,alpha);
#include<logDepthFragment>
#include<fogFragment>
fragmentOutputs.color=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`;if(!i.ShadersStoreWGSL[f])i.ShadersStoreWGSL[f]=o;var r=[ee,ii,Hi,ri,Te,H,st,Ce,zi,vi,Ze,it,Xi];for(let e of r)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var p={name:f,shader:o};export{p as cellPixelShaderWGSL};

//# debugId=88D82ED9B669FC5D64756E2164756E21
//# sourceMappingURL=cell.fragment-sws533sf.js.map
