import{Vj as o,Wj as c}from"./site-g7g0s4nh.js";import{Lk as t}from"./site-cr5a6qh0.js";import{RA as n}from"./site-cgmwaca2.js";import{RC as e}from"./site-eq33q5cn.js";var i="hdrIrradianceFilteringPixelShader",a=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
var inputTextureSampler: sampler;var inputTexture: texture_cube<f32>;
#ifdef IBL_CDF_FILTERING
var icdfTextureSampler: sampler;var icdfTexture: texture_2d<f32>;
#endif
uniform vFilteringInfo: vec2f;uniform hdrScale: f32;varying direction: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=irradiance(inputTexture,inputTextureSampler,input.direction,uniforms.vFilteringInfo,0.0,vec3f(1.0),input.direction
#ifdef IBL_CDF_FILTERING
,icdfTexture,icdfTextureSampler
#endif
);fragmentOutputs.color= vec4f(color*uniforms.hdrScale,1.0);}`;if(!e.ShadersStoreWGSL[i])e.ShadersStoreWGSL[i]=a;var u=[n,o,t,c];for(let r of u)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var S={name:i,shader:a};
export{S as Zh};

//# debugId=8C6E04EE3E3B7D4E64756E2164756E21
//# sourceMappingURL=site-nqpp73ye.js.map
