import{Rn}from"./site-x634c9e6.js";import{yt}from"./site-ngk6phyz.js";import{re}from"./site-ja726rsd.js";import{Ie,Me,Zt}from"./site-71pw3ca8.js";import{hi}from"./site-4c0sjx36.js";import{Fi}from"./site-kws6gcw2.js";import{Pe,Ae}from"./site-p9xva8s7.js";import{H}from"./site-rze70emw.js";import{st,at}from"./site-z02bshqw.js";import{it}from"./site-zcgrc802.js";import{xi}from"../hydrate-56zmh9rp.js";import{i}from"./site-1yf4ncc8.js";var o="shadowOnlyPixelShader",n=`precision highp float;
#include<__decl__sceneFragment>
uniform float alpha;uniform vec3 shadowColor;varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#include<helperFunctions>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<clipPlaneFragmentDeclaration>
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying float vViewDepth;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);
#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(1.0,1.0,1.0);
#endif
vec3 diffuseBase=vec3(0.,0.,0.);lightingInfo info;float shadow=1.;float glossiness=0.;float aggShadow=0.;float numLights=0.;
#include<lightFragment>[0..1]
vec4 color=vec4(shadowColor,(1.0-clamp(shadow,0.,1.))*alpha);
#include<logDepthFragment>
#include<fogFragment>
gl_FragColor=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!i.ShadersStore[o])i.ShadersStore[o]=n;var r=[Rn,yt,re,Ie,Me,Fi,Zt,Pe,H,st,Ae,hi,it,at,xi];for(let e of r)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var D={name:o,shader:n};export{D as shadowOnlyPixelShader};

//# debugId=108DCE38B7F3396064756E2164756E21
//# sourceMappingURL=shadowOnly.fragment-hfwnpjjz.js.map
