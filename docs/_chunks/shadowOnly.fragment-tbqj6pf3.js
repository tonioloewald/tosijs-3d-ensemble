import{xA as s}from"./site-8bd555m7.js";import{zA as d}from"./site-fma21pc5.js";import{IA as g}from"./site-t0fesssv.js";import{JA as c}from"./site-yepct92f.js";import"./site-b4z1gcca.js";import"./site-h4f3dppz.js";import{QA as u}from"./site-0ma0ypye.js";import{TA as m}from"./site-nd8mn4f1.js";import{UA as f}from"./site-pxptatb5.js";import{WA as l}from"./site-mevm09sp.js";import{mB as a}from"./site-9kgzghsy.js";import{nB as t}from"./site-qyq8ndc8.js";import{oB as i}from"./site-2e2f7cy5.js";import{pB as r}from"./site-1nhd90ma.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var o="shadowOnlyPixelShader",S=`#include<sceneUboDeclaration>
uniform alpha: f32;uniform shadowColor: vec3f;varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#include<helperFunctions>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
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
var viewDirectionW: vec3f=normalize(scene.vEyePosition.xyz-fragmentInputs.vPositionW);
#ifdef NORMAL
var normalW: vec3f=normalize(fragmentInputs.vNormalW);
#else
var normalW: vec3f= vec3f(1.0,1.0,1.0);
#endif
var diffuseBase: vec3f= vec3f(0.,0.,0.);var info: lightingInfo;var shadow: f32=1.;var glossiness: f32=0.;var aggShadow: f32=0.;var numLights: f32=0.;
#include<lightFragment>[0..1]
var color: vec4f= vec4f(uniforms.shadowColor,(1.0-clamp(shadow,0.,1.))*uniforms.alpha);
#include<logDepthFragment>
#include<fogFragment>
fragmentOutputs.color=color;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;if(!e.ShadersStoreWGSL[o])e.ShadersStoreWGSL[o]=S;var h=[l,m,c,s,g,r,f,a,i,d,u,t];for(let n of h)if(!e.IncludesShadersStoreWGSL[n.name])e.IncludesShadersStoreWGSL[n.name]=n.shader;var _={name:o,shader:S};export{_ as shadowOnlyPixelShaderWGSL};

//# debugId=D13F55EE2F6DE23564756E2164756E21
//# sourceMappingURL=shadowOnly.fragment-tbqj6pf3.js.map
