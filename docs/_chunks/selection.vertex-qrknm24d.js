import{nA as m}from"./site-cdfrs8gm.js";import{oA as p}from"./site-4nsp2pg6.js";import{pA as l}from"./site-fmaaaf9d.js";import{qA as c}from"./site-37323n7e.js";import{$A as a}from"./site-b0586s68.js";import{aB as n}from"./site-gvha0p8v.js";import{bB as f}from"./site-y76seb3a.js";import{cB as r}from"./site-xk1d5e3r.js";import{dB as s}from"./site-s2x1pkvg.js";import{eB as d}from"./site-e7fcp3dx.js";import{hB as u}from"./site-x4w78gzw.js";import{iB as o}from"./site-xv022249.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var i="selectionVertexShader",v=`attribute position: vec3f;
#ifdef INSTANCES
attribute instanceSelectionId: f32;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#ifdef STORE_CAMERASPACE_Z
uniform view: mat4x4f;
#else
uniform depthValues: vec2f;
#endif
#ifdef INSTANCES
flat varying vSelectionId: f32;
#endif
#ifdef STORE_CAMERASPACE_Z
varying vViewPosZ: f32;
#else
varying vDepthMetric: f32;
#endif
#ifdef ALPHATEST
varying vUV: vec2f;uniform diffuseMatrix: mat4x4f; 
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input: VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
var positionUpdated: vec3f=vertexInputs.position;
#ifdef UV1
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(positionUpdated,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#ifdef ALPHATEST
#ifdef UV1
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef UV2
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#ifdef STORE_CAMERASPACE_Z
vertexOutputs.vViewPosZ=(uniforms.view*worldPos).z;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
vertexOutputs.vDepthMetric=((-vertexOutputs.position.z+uniforms.depthValues.x)/(uniforms.depthValues.y));
#else
vertexOutputs.vDepthMetric=((vertexOutputs.position.z+uniforms.depthValues.x)/(uniforms.depthValues.y));
#endif
#endif
#ifdef INSTANCES
vertexOutputs.vSelectionId=vertexInputs.instanceSelectionId;
#endif
#include<clipPlaneVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStoreWGSL[i])e.ShadersStoreWGSL[i]=v;var S=[r,n,c,l,o,a,p,m,f,d,s,u];for(let t of S)if(!e.IncludesShadersStoreWGSL[t.name])e.IncludesShadersStoreWGSL[t.name]=t.shader;var b={name:i,shader:v};export{b as selectionVertexShaderWGSL};

//# debugId=4BC647C0B4341EC764756E2164756E21
//# sourceMappingURL=selection.vertex-qrknm24d.js.map
