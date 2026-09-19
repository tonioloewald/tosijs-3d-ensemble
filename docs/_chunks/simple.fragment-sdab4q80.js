import{Sh as p}from"./site-6966qygq.js";import{Xy as m}from"./site-e0vyt15v.js";import{Zy as u}from"./site-v92vhwaz.js";import"./site-h0y6wy85.js";import{ez as g}from"./site-w73a8sje.js";import{fz as c}from"./site-am95gh1b.js";import{gz as d}from"./site-dkfc1t93.js";import{hz as s}from"./site-bd94jn6g.js";import"./site-rd56nynb.js";import{wz as v}from"./site-njq9fpyp.js";import{Bz as l}from"./site-chw2k88q.js";import{Ez as t}from"./site-qn42tyww.js";import{Tz as r}from"./site-ym4sz14a.js";import{Uz as a}from"./site-ky8cdnt3.js";import{Vz as f}from"./site-fypy0ssm.js";import{Wz as n}from"./site-9re6xjgb.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="simplePixelShader",h=`precision highp float;uniform vec4 vEyePosition;uniform vec4 vDiffuseColor;varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
#endif
#include<helperFunctions>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
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
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
baseColor.rgb*=vColor.rgb;
#endif
#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(1.0,1.0,1.0);
#endif
vec3 diffuseBase=vec3(0.,0.,0.);lightingInfo info;float shadow=1.;float glossiness=0.;float aggShadow=0.;float numLights=0.;
#ifdef SPECULARTERM
vec3 specularBase=vec3(0.,0.,0.);
#endif 
#include<lightFragment>[0..maxSimultaneousLights]
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=vColor.a;
#endif
vec3 finalDiffuse=clamp(diffuseBase*diffuseColor,0.0,1.0)*baseColor.rgb;vec4 color=vec4(finalDiffuse,alpha);
#include<logDepthFragment>
#include<fogFragment>
gl_FragColor=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!e.ShadersStore[o])e.ShadersStore[o]=h;var S=[l,d,s,m,c,n,t,r,f,g,u,v,a,p];for(let i of S)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var y={name:o,shader:h};export{y as simplePixelShader};

//# debugId=4974173516B3044964756E2164756E21
//# sourceMappingURL=simple.fragment-sdab4q80.js.map
