import{We,Xe,De,Ie,ze,Ue}from"./site-2h9vrvyz.js";import{xt}from"./site-23zackra.js";import{_e,ge}from"./site-2pb4jqv9.js";import{H}from"./site-n8nnc3kp.js";import{rt,ct}from"./site-kxgmgds3.js";import{Vi}from"./site-k5mprve9.js";import{Ht,Xt}from"./site-csj5varn.js";import{et}from"./site-k5ekeryj.js";import{i}from"./site-1yf4ncc8.js";var t="shadowOnlyVertexShader",r=`attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<sceneUboDeclaration>
#ifdef POINTSIZE
uniform pointSize: f32;
#endif
varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#ifdef VERTEXCOLOR
varying vColor: vec4f;
#endif
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightVxFragment>[0..maxSimultaneousLights]
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=scene.viewProjection*worldPos;vertexOutputs.vPositionW= worldPos.xyz;
#ifdef NORMAL
vertexOutputs.vNormalW=normalize(( finalWorld* vec4f(vertexInputs.normal,0.0)).xyz);
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!i.ShadersStoreWGSL[t])i.ShadersStoreWGSL[t]=r;var o=[We,Xe,De,xt,_e,H,rt,Vi,Ht,Ie,ze,Ue,ge,et,ct,Xt];for(let e of o)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var h={name:t,shader:r};export{h as shadowOnlyVertexShaderWGSL};

//# debugId=B50226AA1D010D7664756E2164756E21
//# sourceMappingURL=shadowOnly.vertex-0wcxtrzv.js.map
