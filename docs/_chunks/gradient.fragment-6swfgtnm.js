import{Uh as u}from"./site-5esz3mdf.js";import{Zy as c}from"./site-aes4xqc1.js";import{$y as h}from"./site-1afhqv8a.js";import"./site-tr8rxmyd.js";import{gz as g}from"./site-6qkyg26z.js";import{hz as d}from"./site-111yrrft.js";import{iz as m}from"./site-nzqnrmaj.js";import{jz as s}from"./site-h8e2z66v.js";import"./site-kdvgj03h.js";import{yz as p}from"./site-cd6d8e0s.js";import{Dz as l}from"./site-231618cv.js";import{Gz as f}from"./site-5396gbjx.js";import{Vz as r}from"./site-bdxc68pn.js";import{Wz as t}from"./site-dhab8phj.js";import{Xz as a}from"./site-4a1hf6nf.js";import{Yz as n}from"./site-qy8vh6e0.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var i="gradientPixelShader",v=`precision highp float;uniform vec4 vEyePosition;uniform vec4 topColor;uniform vec4 bottomColor;uniform float offset;uniform float scale;uniform float smoothness;varying vec3 vPositionW;varying vec3 vPosition;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif
#include<helperFunctions>
#include<__decl__lightFragment>[0]
#include<__decl__lightFragment>[1]
#include<__decl__lightFragment>[2]
#include<__decl__lightFragment>[3]
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
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);float h=vPosition.y*scale+offset;float mysmoothness=clamp(smoothness,0.01,max(smoothness,10.));vec4 baseColor=mix(bottomColor,topColor,max(pow(max(h,0.0),mysmoothness),0.0));vec3 diffuseColor=baseColor.rgb;float alpha=baseColor.a;
#ifdef ALPHATEST
if (baseColor.a<0.4)
discard;
#endif
#include<depthPrePass>
#ifdef VERTEXCOLOR
baseColor.rgb*=vColor.rgb;
#endif
#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(1.0,1.0,1.0);
#endif
#ifdef EMISSIVE
vec3 diffuseBase=baseColor.rgb;
#else
vec3 diffuseBase=vec3(0.,0.,0.);
#endif
lightingInfo info;float shadow=1.;float glossiness=0.;float aggShadow=0.;float numLights=0.;
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
}
`;if(!e.ShadersStore[i])e.ShadersStore[i]=v;var C=[l,m,s,c,d,n,f,r,a,g,h,p,t,u];for(let o of C)if(!e.IncludesShadersStore[o.name])e.IncludesShadersStore[o.name]=o.shader;var R={name:i,shader:v};export{R as gradientPixelShader};

//# debugId=9843C9D2D144214764756E2164756E21
//# sourceMappingURL=gradient.fragment-6swfgtnm.js.map
