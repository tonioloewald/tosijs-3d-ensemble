import{vA as s}from"./site-4v0m5tfj.js";import{xA as d}from"./site-dytv3nph.js";import{GA as g}from"./site-9etvdk0z.js";import{HA as c}from"./site-bjjdr5z3.js";import"./site-hpk7czd9.js";import"./site-rxh8gfe9.js";import{OA as u}from"./site-7611pkz2.js";import{RA as m}from"./site-cgmwaca2.js";import{SA as f}from"./site-tvsjdjzy.js";import{UA as l}from"./site-nr8e2t2t.js";import{kB as a}from"./site-3k38km0y.js";import{lB as t}from"./site-zxff350y.js";import{mB as i}from"./site-v9zm9412.js";import{nB as r}from"./site-yjav6xay.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="shadowOnlyPixelShader",S=`#include<sceneUboDeclaration>
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

//# debugId=40FB0BBCF750638964756E2164756E21
//# sourceMappingURL=shadowOnly.fragment-28qcw1mk.js.map
