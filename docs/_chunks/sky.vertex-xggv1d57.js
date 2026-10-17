import{H}from"./site-n8nnc3kp.js";import{_e,xe}from"./site-9cwt6m4p.js";import{it,ct}from"./site-vc4jxf6y.js";import{Ke}from"./site-779jwsn5.js";import{i}from"./site-1yf4ncc8.js";var o="skyVertexShader",r=`attribute position: vec3f;
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
uniform world: mat4x4f;uniform view: mat4x4f;uniform viewProjection: mat4x4f;
#ifdef POINTSIZE
uniform pointSize: f32;
#endif
varying vPositionW: vec3f;
#ifdef VERTEXCOLOR
varying vColor: vec4f;
#endif
#include<logDepthDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.position=uniforms.viewProjection*uniforms.world* vec4f(vertexInputs.position,1.0);var worldPos: vec4f=uniforms.world* vec4f(vertexInputs.position,1.0);vertexOutputs.vPositionW= worldPos.xyz;
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#ifdef VERTEXCOLOR
vertexOutputs.vColor=vertexInputs.color;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!i.ShadersStoreWGSL[o])i.ShadersStoreWGSL[o]=r;var t=[H,_e,it,xe,Ke,ct];for(let e of t)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var p={name:o,shader:r};export{p as skyVertexShaderWGSL};

//# debugId=E34A6C5A066A636064756E2164756E21
//# sourceMappingURL=sky.vertex-xggv1d57.js.map
