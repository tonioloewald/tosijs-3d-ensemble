import{Xj as o,Yj as a}from"./site-384f6z1f.js";import{Nk as t}from"./site-rvxg9c4k.js";import{TA as i}from"./site-nd8mn4f1.js";import{TC as r}from"./site-qntg4d3x.js";var n="hdrFilteringPixelShader",u=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform alphaG: f32;var inputTextureSampler: sampler;var inputTexture: texture_cube<f32>;uniform vFilteringInfo: vec2f;uniform hdrScale: f32;varying direction: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=radiance(uniforms.alphaG,inputTexture,inputTextureSampler,input.direction,uniforms.vFilteringInfo);fragmentOutputs.color= vec4f(color*uniforms.hdrScale,1.0);}`;if(!r.ShadersStoreWGSL[n])r.ShadersStoreWGSL[n]=u;var c=[i,o,t,a];for(let e of c)if(!r.IncludesShadersStoreWGSL[e.name])r.IncludesShadersStoreWGSL[e.name]=e.shader;var S={name:n,shader:u};
export{S as Xh};

//# debugId=DE185FF45A2308E064756E2164756E21
//# sourceMappingURL=site-dy4bs7pj.js.map
