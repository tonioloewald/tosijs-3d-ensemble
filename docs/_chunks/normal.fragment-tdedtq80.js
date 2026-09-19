import{Sh as v}from"./site-6966qygq.js";import{Xy as s}from"./site-e0vyt15v.js";import{Zy as u}from"./site-v92vhwaz.js";import"./site-h0y6wy85.js";import{ez as g}from"./site-w73a8sje.js";import{fz as d}from"./site-am95gh1b.js";import{gz as m}from"./site-dkfc1t93.js";import{hz as c}from"./site-bd94jn6g.js";import"./site-rd56nynb.js";import{wz as h}from"./site-njq9fpyp.js";import{Bz as f}from"./site-chw2k88q.js";import{Ez as t}from"./site-qn42tyww.js";import{Tz as n}from"./site-ym4sz14a.js";import{Uz as l}from"./site-ky8cdnt3.js";import{Vz as a}from"./site-fypy0ssm.js";import{Wz as r}from"./site-9re6xjgb.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="normalPixelShader",p=`precision highp float;uniform vec4 vEyePosition;uniform vec4 vDiffuseColor;varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef LIGHTING
#include<helperFunctions>
#include<__decl__lightFragment>[0]
#include<__decl__lightFragment>[1]
#include<__decl__lightFragment>[2]
#include<__decl__lightFragment>[3]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#endif
#ifdef DIFFUSE
varying vec2 vDiffuseUV;uniform sampler2D diffuseSampler;uniform vec2 vDiffuseInfos;
#endif
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
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);vec4 baseColor=vec4(1.,1.,1.,1.);vec3 diffuseColor=vDiffuseColor.rgb;float alpha=vDiffuseColor.a;
#ifdef DIFFUSE
baseColor=texture2D(diffuseSampler,vDiffuseUV);
#ifdef ALPHATEST
if (baseColor.a<0.4)
discard;
#endif
#include<depthPrePass>
baseColor.rgb*=vDiffuseInfos.y;
#endif
#ifdef NORMAL
baseColor=mix(baseColor,vec4(vNormalW,1.0),0.5);
#endif
#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(1.0,1.0,1.0);
#endif
#ifdef LIGHTING
vec3 diffuseBase=vec3(0.,0.,0.);lightingInfo info;float shadow=1.;float glossiness=0.;float aggShadow=0.;float numLights=0.;
#include<lightFragment>[0]
#include<lightFragment>[1]
#include<lightFragment>[2]
#include<lightFragment>[3]
vec3 finalDiffuse=clamp(diffuseBase*diffuseColor,0.0,1.0)*baseColor.rgb;
#else
vec3 finalDiffuse= baseColor.rgb;
#endif
vec4 color=vec4(finalDiffuse,alpha);
#include<logDepthFragment>
#include<fogFragment>
gl_FragColor=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!e.ShadersStore[o])e.ShadersStore[o]=p;var F=[f,m,c,s,d,r,t,n,a,g,u,h,l,v];for(let i of F)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var U={name:o,shader:p};export{U as normalPixelShader};

//# debugId=EEB32559D787D3FD64756E2164756E21
//# sourceMappingURL=normal.fragment-tdedtq80.js.map
