import{rA as p}from"./site-7b4wqcsz.js";import{SA as m}from"./site-tvsjdjzy.js";import{_A as l}from"./site-vjcvv95b.js";import{$A as a}from"./site-b0586s68.js";import{aB as o}from"./site-gvha0p8v.js";import{bB as s}from"./site-y76seb3a.js";import{cB as i}from"./site-xk1d5e3r.js";import{dB as d}from"./site-s2x1pkvg.js";import{eB as v}from"./site-e7fcp3dx.js";import{fB as c}from"./site-w3a7hzs8.js";import{gB as f}from"./site-ara777sk.js";import{hB as u}from"./site-x4w78gzw.js";import{iB as n}from"./site-xv022249.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var r="fireVertexShader",x=`attribute position: vec3f;
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
uniform view: mat4x4f;uniform viewProjection: mat4x4f;
#ifdef DIFFUSE
varying vDiffuseUV: vec2f;
#endif
#ifdef POINTSIZE
uniform pointSize: f32;
#endif
varying vPositionW: vec3f;
#ifdef VERTEXCOLOR
varying vColor: vec4f;
#endif
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
uniform time: f32;uniform speed: f32;
#ifdef DIFFUSE
varying vDistortionCoords1: vec2f;varying vDistortionCoords2: vec2f;varying vDistortionCoords3: vec2f;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;vertexOutputs.vPositionW= worldPos.xyz;
#ifdef DIFFUSE
vertexOutputs.vDiffuseUV=vec2f(vertexInputs.uv.x,vertexInputs.uv.y-0.2);
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<vertexColorMixing>
#ifdef DIFFUSE
var layerSpeed: vec3f= vec3f(-0.2,-0.52,-0.1)*uniforms.speed;vertexOutputs.vDistortionCoords1=vec2f(vertexInputs.uv.x,vertexInputs.uv.y+layerSpeed.x*uniforms.time/1000.0);vertexOutputs.vDistortionCoords2=vec2f(vertexInputs.uv.x,vertexInputs.uv.y+layerSpeed.y*uniforms.time/1000.0);vertexOutputs.vDistortionCoords3=vec2f(vertexInputs.uv.x,vertexInputs.uv.y+layerSpeed.z*uniforms.time/1000.0);
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=x;var S=[i,o,a,n,m,f,s,v,d,u,p,c,l];for(let t of S)if(!e.IncludesShadersStoreWGSL[t.name])e.IncludesShadersStoreWGSL[t.name]=t.shader;var U={name:r,shader:x};export{U as fireVertexShaderWGSL};

//# debugId=4C476AC5B067E68164756E2164756E21
//# sourceMappingURL=fire.vertex-xmpyj9h6.js.map
