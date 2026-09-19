import{Ph as g}from"./site-k0sfwfvh.js";import{vA as d}from"./site-4v0m5tfj.js";import{xA as u}from"./site-dytv3nph.js";import{FA as v}from"./site-6b0a8tbg.js";import{GA as m}from"./site-9etvdk0z.js";import{HA as t}from"./site-bjjdr5z3.js";import"./site-hpk7czd9.js";import"./site-rxh8gfe9.js";import{OA as c}from"./site-7611pkz2.js";import{RA as a}from"./site-cgmwaca2.js";import{SA as l}from"./site-tvsjdjzy.js";import{kB as r}from"./site-3k38km0y.js";import{lB as s}from"./site-zxff350y.js";import{mB as n}from"./site-v9zm9412.js";import{nB as i}from"./site-yjav6xay.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="cellPixelShader",h=`uniform vEyePosition: vec4f;uniform vDiffuseColor: vec4f;varying vPositionW: vec3f;
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
`;if(!e.ShadersStoreWGSL[o])e.ShadersStoreWGSL[o]=h;var S=[a,t,d,m,i,l,r,n,v,u,c,s,g];for(let f of S)if(!e.IncludesShadersStoreWGSL[f.name])e.IncludesShadersStoreWGSL[f.name]=f.shader;var R={name:o,shader:h};export{R as cellPixelShaderWGSL};

//# debugId=FA8D2F7EA752939564756E2164756E21
//# sourceMappingURL=cell.fragment-h20kpde8.js.map
