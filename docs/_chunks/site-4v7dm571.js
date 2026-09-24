import{Xj as o,Yj as c}from"./site-384f6z1f.js";import{Nk as t}from"./site-rvxg9c4k.js";import{TA as n}from"./site-nd8mn4f1.js";import{TC as e}from"./site-qntg4d3x.js";var i="hdrIrradianceFilteringPixelShader",a=`#include<helperFunctions>
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
export{S as $h};

//# debugId=1BF0F52D32E6E34764756E2164756E21
//# sourceMappingURL=site-4v7dm571.js.map
