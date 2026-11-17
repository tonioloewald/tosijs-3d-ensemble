import{$e,Qe,ke,Oe,Ge,Xe}from"./site-2z058x82.js";import{yt}from"./site-y4hk7t51.js";import{Se,ye}from"./site-0dc500ez.js";import{H}from"./site-n8nnc3kp.js";import{at,pt}from"./site-xvg6m411.js";import{er}from"./site-e136fxw6.js";import{ei,ti}from"./site-wzfs18sq.js";import{rt}from"./site-t7pkmh0y.js";import{i}from"./site-1yf4ncc8.js";var t="shadowOnlyVertexShader",r=`attribute position: vec3f;
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
`;if(!i.ShadersStoreWGSL[t])i.ShadersStoreWGSL[t]=r;var o=[$e,Qe,ke,yt,Se,H,at,er,ei,Oe,Ge,Xe,ye,rt,pt,ti];for(let e of o)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var h={name:t,shader:r};export{h as shadowOnlyVertexShaderWGSL};

//# debugId=551C3F9ED326E74B64756E2164756E21
//# sourceMappingURL=shadowOnly.vertex-5hc6wkzn.js.map
