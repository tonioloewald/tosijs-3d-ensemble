import{tA as c}from"./site-6ba65z6z.js";import{UA as a}from"./site-pxptatb5.js";import{hB as f}from"./site-fpk64j4h.js";import{iB as i}from"./site-mz6nphdx.js";import{jB as n}from"./site-51s6gww7.js";import{kB as t}from"./site-atnw9cpw.js";import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var r="skyVertexShader",l=`attribute position: vec3f;
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
`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=l;var s=[a,t,i,n,c,f];for(let o of s)if(!e.IncludesShadersStoreWGSL[o.name])e.IncludesShadersStoreWGSL[o.name]=o.shader;var V={name:r,shader:l};export{V as skyVertexShaderWGSL};

//# debugId=071329877BB1837C64756E2164756E21
//# sourceMappingURL=sky.vertex-kzs4bvtw.js.map
