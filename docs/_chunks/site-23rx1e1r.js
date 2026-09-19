import{nA as c}from"./site-cdfrs8gm.js";import{oA as u}from"./site-4nsp2pg6.js";import{pA as m}from"./site-fmaaaf9d.js";import{qA as s}from"./site-37323n7e.js";import{$A as o}from"./site-b0586s68.js";import{aB as n}from"./site-gvha0p8v.js";import{bB as a}from"./site-y76seb3a.js";import{cB as i}from"./site-xk1d5e3r.js";import{dB as f}from"./site-s2x1pkvg.js";import{eB as d}from"./site-e7fcp3dx.js";import{RC as e}from"./site-eq33q5cn.js";var r="volumetricLightScatteringPassVertexShader",p=`attribute position: vec3f;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;uniform depthValues: vec2f;
#if defined(ALPHATEST) || defined(NEED_UV)
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
fn main(input: VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;
#if (defined(ALPHATEST) || defined(NEED_UV)) && defined(UV1)
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#if (defined(ALPHATEST) || defined(NEED_UV)) && defined(UV2)
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vertexOutputs.position=uniforms.viewProjection*finalWorld*vec4f(positionUpdated,1.0);
#if defined(ALPHATEST) || defined(NEED_UV)
#ifdef UV1
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef UV2
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
}
`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=p;var l=[i,n,s,m,o,u,c,a,d,f];for(let t of l)if(!e.IncludesShadersStoreWGSL[t.name])e.IncludesShadersStoreWGSL[t.name]=t.shader;var b={name:r,shader:p};
export{b as mh};

//# debugId=709EF8BEC17D0B2464756E2164756E21
//# sourceMappingURL=site-23rx1e1r.js.map
