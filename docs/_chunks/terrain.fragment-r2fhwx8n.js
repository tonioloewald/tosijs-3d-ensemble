import{Ph as c}from"./site-k0sfwfvh.js";import{vA as u}from"./site-4v0m5tfj.js";import{xA as d}from"./site-dytv3nph.js";import{FA as p}from"./site-6b0a8tbg.js";import{GA as s}from"./site-9etvdk0z.js";import{HA as t}from"./site-bjjdr5z3.js";import"./site-hpk7czd9.js";import"./site-rxh8gfe9.js";import{OA as v}from"./site-7611pkz2.js";import{RA as m}from"./site-cgmwaca2.js";import{SA as l}from"./site-tvsjdjzy.js";import{kB as o}from"./site-3k38km0y.js";import{lB as n}from"./site-zxff350y.js";import{mB as i}from"./site-v9zm9412.js";import{nB as a}from"./site-yjav6xay.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var f="terrainPixelShader",S=`uniform vEyePosition: vec4f;uniform vDiffuseColor: vec4f;
#ifdef SPECULARTERM
uniform vSpecularColor: vec4f;
#endif
varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#include<helperFunctions>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#ifdef DIFFUSE
varying vTextureUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform vTextureInfos: vec2f;var diffuse1SamplerSampler: sampler;var diffuse1Sampler: texture_2d<f32>;var diffuse2SamplerSampler: sampler;var diffuse2Sampler: texture_2d<f32>;var diffuse3SamplerSampler: sampler;var diffuse3Sampler: texture_2d<f32>;uniform diffuse1Infos: vec2f;uniform diffuse2Infos: vec2f;uniform diffuse3Infos: vec2f;
#endif
#ifdef BUMP
var bump1SamplerSampler: sampler;var bump1Sampler: texture_2d<f32>;var bump2SamplerSampler: sampler;var bump2Sampler: texture_2d<f32>;var bump3SamplerSampler: sampler;var bump3Sampler: texture_2d<f32>;
#endif
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#ifdef BUMP
fn cotangent_frame(normal: vec3f,p: vec3f,uv: vec2f)->mat3x3f
{var dp1: vec3f=dpdx(p);var dp2: vec3f=dpdy(p);var duv1: vec2f=dpdx(uv);var duv2: vec2f=dpdy(uv);var dp2perp: vec3f=cross(dp2,normal);var dp1perp: vec3f=cross(normal,dp1);var tangent: vec3f=dp2perp*duv1.x+dp1perp*duv2.x;var binormal: vec3f=dp2perp*duv1.y+dp1perp*duv2.y;var invmax: f32=inverseSqrt(max(dot(tangent,tangent),dot(binormal,binormal)));return mat3x3f(tangent*invmax,binormal*invmax,normal);}
fn perturbNormal(viewDir: vec3f,mixColor: vec3f)->vec3f
{var bump1Color: vec3f=textureSample(bump1Sampler,bump1SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse1Infos).xyz;var bump2Color: vec3f=textureSample(bump2Sampler,bump2SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse2Infos).xyz;var bump3Color: vec3f=textureSample(bump3Sampler,bump3SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse3Infos).xyz;bump1Color=bump1Color.rgb*mixColor.r;bump2Color=mix(bump1Color.rgb,bump2Color.rgb,vec3f(mixColor.g));var map: vec3f=mix(bump2Color.rgb,bump3Color.rgb,vec3f(mixColor.b));map=map*255./127.-128./127.;var TBN: mat3x3f=cotangent_frame(fragmentInputs.vNormalW*uniforms.vTextureInfos.y,-viewDir,fragmentInputs.vTextureUV);return normalize(TBN*map);}
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var viewDirectionW: vec3f=normalize(uniforms.vEyePosition.xyz-fragmentInputs.vPositionW);var baseColor: vec4f= vec4f(1.,1.,1.,1.);var diffuseColor: vec3f=uniforms.vDiffuseColor.rgb;
#ifdef SPECULARTERM
var glossiness: f32=uniforms.vSpecularColor.a;var specularColor: vec3f=uniforms.vSpecularColor.rgb;
#else
var glossiness: f32=0.;
#endif
var alpha: f32=uniforms.vDiffuseColor.a;
#ifdef NORMAL
var normalW: vec3f=normalize(fragmentInputs.vNormalW);
#else
var normalW: vec3f= vec3f(1.0,1.0,1.0);
#endif
#ifdef DIFFUSE
baseColor=textureSample(textureSampler,textureSamplerSampler,fragmentInputs.vTextureUV);
#if defined(BUMP) && defined(DIFFUSE)
normalW=perturbNormal(viewDirectionW,baseColor.rgb);
#endif
#ifdef ALPHATEST
if (baseColor.a<0.4) {discard;}
#endif
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
baseColor=vec4f(baseColor.rgb*uniforms.vTextureInfos.y,baseColor.a);var diffuse1Color: vec4f=textureSample(diffuse1Sampler,diffuse1SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse1Infos);var diffuse2Color: vec4f=textureSample(diffuse2Sampler,diffuse2SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse2Infos);var diffuse3Color: vec4f=textureSample(diffuse3Sampler,diffuse3SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse3Infos);diffuse1Color=vec4f(diffuse1Color.rgb*baseColor.r,diffuse1Color.a);diffuse2Color=vec4f(mix(diffuse1Color.rgb,diffuse2Color.rgb,vec3f(baseColor.g)),diffuse2Color.a);baseColor=vec4f(mix(diffuse2Color.rgb,diffuse3Color.rgb,vec3f(baseColor.b)),baseColor.a);
#endif
#endif
#ifndef DEPTHPREPASS
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
baseColor=vec4f(baseColor.rgb*fragmentInputs.vColor.rgb,baseColor.a);
#endif
var diffuseBase: vec3f= vec3f(0.,0.,0.);var info: lightingInfo;var shadow: f32=1.;var aggShadow: f32=0.;var numLights: f32=0.;
#ifdef SPECULARTERM
var specularBase: vec3f= vec3f(0.,0.,0.);
#endif
#include<lightFragment>[0..maxSimultaneousLights]
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=fragmentInputs.vColor.a;
#endif
#ifdef SPECULARTERM
var finalSpecular: vec3f=specularBase*specularColor;
#else
var finalSpecular: vec3f= vec3f(0.0);
#endif
var finalDiffuse: vec3f=clamp(diffuseBase*diffuseColor*baseColor.rgb,vec3f(0.0),vec3f(1.0));var color: vec4f= vec4f(finalDiffuse+finalSpecular,alpha);
#include<logDepthFragment>
#include<fogFragment>
fragmentOutputs.color=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`;if(!e.ShadersStoreWGSL[f])e.ShadersStoreWGSL[f]=S;var g=[m,t,u,s,a,l,o,i,p,d,v,n,c];for(let r of g)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var R={name:f,shader:S};export{R as terrainPixelShaderWGSL};

//# debugId=BC43D4014D24EC5C64756E2164756E21
//# sourceMappingURL=terrain.fragment-r2fhwx8n.js.map
