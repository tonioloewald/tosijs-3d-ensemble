import{vt}from"./site-tgwn8dp1.js";import{ie}from"./site-gs8qfa0v.js";import{$t,Yt}from"./site-6jbcv03c.js";import{Oi}from"./site-0zj747em.js";import{be,Se}from"./site-001j1ta6.js";import{W}from"./site-6bak08eg.js";import{et,Qe}from"./site-01ac8aa4.js";import{li}from"./site-99hmv7tb.js";import{Ye}from"./site-n3rxdbkr.js";import{i}from"./site-1yf4ncc8.js";var n="shadowOnlyPixelShader",o=`#include<sceneUboDeclaration>
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
`;if(!i.ShadersStoreWGSL[n])i.ShadersStoreWGSL[n]=o;var r=[vt,ie,$t,Oi,Yt,be,W,et,Se,li,Ye,Qe];for(let e of r)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var v={name:n,shader:o};export{v as shadowOnlyPixelShaderWGSL};

//# debugId=0A4A76298D14F11F64756E2164756E21
//# sourceMappingURL=shadowOnly.fragment-vaqazzb4.js.map
