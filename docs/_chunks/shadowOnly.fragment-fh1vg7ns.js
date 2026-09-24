import{Uh as u}from"./site-5esz3mdf.js";import{sk as F}from"./site-na2rj1m9.js";import{Zy as g}from"./site-aes4xqc1.js";import{$y as h}from"./site-1afhqv8a.js";import"./site-tr8rxmyd.js";import{hz as d}from"./site-111yrrft.js";import{iz as s}from"./site-nzqnrmaj.js";import{jz as f}from"./site-h8e2z66v.js";import"./site-kdvgj03h.js";import{yz as p}from"./site-cd6d8e0s.js";import{Dz as m}from"./site-231618cv.js";import{Fz as l}from"./site-2zvtkt7b.js";import{Gz as c}from"./site-5396gbjx.js";import{Vz as r}from"./site-bdxc68pn.js";import{Wz as t}from"./site-dhab8phj.js";import{Xz as a}from"./site-4a1hf6nf.js";import{Yz as n}from"./site-qy8vh6e0.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var i="shadowOnlyPixelShader",v=`precision highp float;
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
}`;if(!e.ShadersStore[i])e.ShadersStore[i]=v;var _=[F,l,m,s,f,g,d,n,c,r,a,h,p,t,u];for(let o of _)if(!e.IncludesShadersStore[o.name])e.IncludesShadersStore[o.name]=o.shader;var W={name:i,shader:v};export{W as shadowOnlyPixelShader};

//# debugId=0224A6D2BD6120A164756E2164756E21
//# sourceMappingURL=shadowOnly.fragment-fh1vg7ns.js.map
