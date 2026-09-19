import{rA as d}from"./site-7b4wqcsz.js";import{SA as s}from"./site-tvsjdjzy.js";import{UA as v}from"./site-nr8e2t2t.js";import{$A as o}from"./site-b0586s68.js";import{bB as f}from"./site-y76seb3a.js";import{fB as c}from"./site-w3a7hzs8.js";import{gB as n}from"./site-ara777sk.js";import{hB as a}from"./site-x4w78gzw.js";import{iB as r}from"./site-xv022249.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var i="gridVertexShader",u=`attribute position: vec3f;attribute normal: vec3f;
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#include<instancesDeclaration>
#include<sceneUboDeclaration>
varying vPosition: vec3f;varying vNormal: vec3f;
#if defined(HORIZON_FADE) || defined(BELOW_LINE_COLOR) || defined(ORIGIN_MARKER)
varying vWorldPos: vec3f;
#endif
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
#ifdef OPACITY
varying vOpacityUV: vec2f;uniform opacityMatrix: mat4x4f;uniform vOpacityInfos: vec2f;
#endif
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);
#include<fogVertex>
var cameraSpacePosition: vec4f=scene.view*worldPos;vertexOutputs.position=scene.projection*cameraSpacePosition;
#ifdef OPACITY
#ifndef UV1
var uv: vec2f= vec2f(0.,0.);
#else
var uv: vec2f=vertexInputs.uv;
#endif
#ifndef UV2
var uv2: vec2f= vec2f(0.,0.);
#else
var uv2: vec2f=vertexInputs.uv2;
#endif
if (uniforms.vOpacityInfos.x==0.)
{vertexOutputs.vOpacityUV=(uniforms.opacityMatrix* vec4f(uv,1.0,0.0)).xy;}
else
{vertexOutputs.vOpacityUV=(uniforms.opacityMatrix* vec4f(uv2,1.0,0.0)).xy;}
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
vertexOutputs.vPosition=vertexInputs.position;vertexOutputs.vNormal=vertexInputs.normal;
#if defined(HORIZON_FADE) || defined(BELOW_LINE_COLOR) || defined(ORIGIN_MARKER)
vertexOutputs.vWorldPos=worldPos.xyz;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStoreWGSL[i])e.ShadersStoreWGSL[i]=u;var l=[o,v,s,n,r,f,c,a,d];for(let t of l)if(!e.IncludesShadersStoreWGSL[t.name])e.IncludesShadersStoreWGSL[t.name]=t.shader;var E={name:i,shader:u};export{E as gridVertexShaderWGSL};

//# debugId=F368B60857D5DD3964756E2164756E21
//# sourceMappingURL=grid.vertex-0wgb49he.js.map
