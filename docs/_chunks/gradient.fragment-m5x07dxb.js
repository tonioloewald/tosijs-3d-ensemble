import{Ph as v}from"./site-k0sfwfvh.js";import{vA as m}from"./site-4v0m5tfj.js";import{xA as g}from"./site-dytv3nph.js";import{FA as d}from"./site-6b0a8tbg.js";import{GA as c}from"./site-9etvdk0z.js";import{HA as l}from"./site-bjjdr5z3.js";import"./site-hpk7czd9.js";import"./site-rxh8gfe9.js";import{OA as u}from"./site-7611pkz2.js";import{RA as t}from"./site-cgmwaca2.js";import{SA as s}from"./site-tvsjdjzy.js";import{kB as n}from"./site-3k38km0y.js";import{lB as f}from"./site-zxff350y.js";import{mB as a}from"./site-v9zm9412.js";import{nB as r}from"./site-yjav6xay.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var i="gradientPixelShader",S=`uniform vEyePosition: vec4f;uniform topColor: vec4f;uniform bottomColor: vec4f;uniform offset: f32;uniform scale: f32;uniform smoothness: f32;varying vPositionW: vec3f;varying vPosition: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#ifdef VERTEXCOLOR
varying vColor: vec4f;
#endif
#include<helperFunctions>
#include<lightUboDeclaration>[0]
#include<lightUboDeclaration>[1]
#include<lightUboDeclaration>[2]
#include<lightUboDeclaration>[3]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
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
var viewDirectionW: vec3f=normalize(uniforms.vEyePosition.xyz-fragmentInputs.vPositionW);var h: f32=fragmentInputs.vPosition.y*uniforms.scale+uniforms.offset;var mysmoothness: f32=clamp(uniforms.smoothness,0.01,max(uniforms.smoothness,10.));var baseColor: vec4f=mix(uniforms.bottomColor,uniforms.topColor,vec4f(max(pow(max(h,0.0),mysmoothness),0.0)));var diffuseColor: vec3f=baseColor.rgb;var alpha: f32=baseColor.a;
#ifdef ALPHATEST
if (baseColor.a<0.4) {discard;}
#endif
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
#ifdef VERTEXCOLOR
baseColor=vec4f(baseColor.rgb*fragmentInputs.vColor.rgb,baseColor.a);
#endif
#ifdef NORMAL
var normalW: vec3f=normalize(fragmentInputs.vNormalW);
#else
var normalW: vec3f= vec3f(1.0,1.0,1.0);
#endif
#ifdef EMISSIVE
var diffuseBase: vec3f=baseColor.rgb;
#else
var diffuseBase: vec3f= vec3f(0.,0.,0.);
#endif
var info: lightingInfo;var shadow: f32=1.;var glossiness: f32=0.;var aggShadow: f32=0.;var numLights: f32=0.;
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
`;if(!e.ShadersStoreWGSL[i])e.ShadersStoreWGSL[i]=S;var p=[t,l,m,c,r,s,n,a,d,g,u,f,v];for(let o of p)if(!e.IncludesShadersStoreWGSL[o.name])e.IncludesShadersStoreWGSL[o.name]=o.shader;var R={name:i,shader:S};export{R as gradientPixelShaderWGSL};

//# debugId=BE4DE4412F93168264756E2164756E21
//# sourceMappingURL=gradient.fragment-m5x07dxb.js.map
