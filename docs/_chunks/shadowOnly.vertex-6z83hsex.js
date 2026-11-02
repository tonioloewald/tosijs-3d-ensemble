import{He,$e,Le,Re,ze,We}from"./site-h34zyp0z.js";import{vt}from"./site-tgwn8dp1.js";import{xe,ve}from"./site-4jtdaaqg.js";import{W}from"./site-6bak08eg.js";import{rt,ht}from"./site-g6d05r0j.js";import{Hi}from"./site-2athc7aj.js";import{Ht,Xt}from"./site-s43vh2nv.js";import{Je}from"./site-p3sjwtn5.js";import{i}from"./site-1yf4ncc8.js";var t="shadowOnlyVertexShader",r=`attribute position: vec3f;
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
`;if(!i.ShadersStoreWGSL[t])i.ShadersStoreWGSL[t]=r;var o=[He,$e,Le,vt,xe,W,rt,Hi,Ht,Re,ze,We,ve,Je,ht,Xt];for(let e of o)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var D={name:t,shader:r};export{D as shadowOnlyVertexShaderWGSL};

//# debugId=A215EE2E79C8F3BD64756E2164756E21
//# sourceMappingURL=shadowOnly.vertex-6z83hsex.js.map
