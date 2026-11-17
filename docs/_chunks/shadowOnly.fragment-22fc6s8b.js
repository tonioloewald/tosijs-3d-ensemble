import{yt}from"./site-y4hk7t51.js";import{ee}from"./site-6tn24edh.js";import{ii,ri}from"./site-g74271hk.js";import{Hi}from"./site-67rdeqqf.js";import{Te,Ce}from"./site-5red3kgf.js";import{H}from"./site-n8nnc3kp.js";import{st,it}from"./site-1j9kyrc7.js";import{vi}from"./site-n3pnr0nr.js";import{Ze}from"./site-kt68nzgc.js";import{i}from"./site-1yf4ncc8.js";var n="shadowOnlyPixelShader",o=`#include<sceneUboDeclaration>
uniform alpha: f32;uniform shadowColor: vec3f;
#define ADDITIONAL_UBO_DECLARATION
varying vPositionW: vec3f;
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
#define CUSTOM_FRAGMENT_BEFORE_LIGHT_COMPOSITION
var color: vec4f= vec4f(uniforms.shadowColor,(1.0-clamp(shadow,0.,1.))*uniforms.alpha);
#include<logDepthFragment>
#include<fogFragment>
fragmentOutputs.color=color;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;if(!i.ShadersStoreWGSL[n])i.ShadersStoreWGSL[n]=o;var r=[yt,ee,ii,Hi,ri,Te,H,st,Ce,vi,Ze,it];for(let e of r)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var v={name:n,shader:o};export{v as shadowOnlyPixelShaderWGSL};

//# debugId=D5B83604853CDFC564756E2164756E21
//# sourceMappingURL=shadowOnly.fragment-22fc6s8b.js.map
