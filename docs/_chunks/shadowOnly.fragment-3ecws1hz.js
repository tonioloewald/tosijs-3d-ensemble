import{Sh as u}from"./site-6966qygq.js";import{qk as F}from"./site-zdstp8ns.js";import{Xy as g}from"./site-e0vyt15v.js";import{Zy as h}from"./site-v92vhwaz.js";import"./site-h0y6wy85.js";import{fz as d}from"./site-am95gh1b.js";import{gz as s}from"./site-dkfc1t93.js";import{hz as f}from"./site-bd94jn6g.js";import"./site-rd56nynb.js";import{wz as p}from"./site-njq9fpyp.js";import{Bz as m}from"./site-chw2k88q.js";import{Dz as l}from"./site-s0jpz7fy.js";import{Ez as c}from"./site-qn42tyww.js";import{Tz as r}from"./site-ym4sz14a.js";import{Uz as t}from"./site-ky8cdnt3.js";import{Vz as a}from"./site-fypy0ssm.js";import{Wz as n}from"./site-9re6xjgb.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var i="shadowOnlyPixelShader",v=`precision highp float;
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

//# debugId=C094D11C1DD118B264756E2164756E21
//# sourceMappingURL=shadowOnly.fragment-3ecws1hz.js.map
