import{TA as a}from"./site-nd8mn4f1.js";import{TC as e}from"./site-qntg4d3x.js";var t="rgbdDecodePixelShader",n=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(fromRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV)),1.0);}`;if(!e.ShadersStoreWGSL[t])e.ShadersStoreWGSL[t]=n;var S=[a];for(let r of S)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var s={name:t,shader:n};
export{s as wv};

//# debugId=F7987BB91730960864756E2164756E21
//# sourceMappingURL=site-nekanv1e.js.map
