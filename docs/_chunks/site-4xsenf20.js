import{We,Xe,De,Re,Ve,Ue}from"./site-t34bfymj.js";import{_e,xe}from"./site-9cwt6m4p.js";import{rt,ht}from"./site-g6d05r0j.js";import{li}from"./site-r4v4cv5j.js";import{i}from"./site-1yf4ncc8.js";var r="colorVertexShader",o=`attribute position: vec3f;
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform view: mat4x4f;
#endif
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
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
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`;if(!i.ShadersStoreWGSL[r])i.ShadersStoreWGSL[r]=o;var t=[We,Xe,_e,rt,De,Re,Ve,Ue,xe,ht,li];for(let e of t)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var VT={name:r,shader:o};
export{VT};

//# debugId=C5F9A3D9FF645DE764756E2164756E21
//# sourceMappingURL=site-4xsenf20.js.map
