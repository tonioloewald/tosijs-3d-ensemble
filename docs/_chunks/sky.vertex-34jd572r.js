import{rA as c}from"./site-7b4wqcsz.js";import{SA as a}from"./site-tvsjdjzy.js";import{fB as f}from"./site-w3a7hzs8.js";import{gB as i}from"./site-ara777sk.js";import{hB as n}from"./site-x4w78gzw.js";import{iB as t}from"./site-xv022249.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var r="skyVertexShader",l=`attribute position: vec3f;
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

//# debugId=B8EA011158420D2264756E2164756E21
//# sourceMappingURL=sky.vertex-34jd572r.js.map
