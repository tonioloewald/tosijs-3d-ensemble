import{TA as n}from"./site-nd8mn4f1.js";import{TC as e}from"./site-qntg4d3x.js";var t="rgbdEncodePixelShader",a=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=toRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb);}`;if(!e.ShadersStoreWGSL[t])e.ShadersStoreWGSL[t]=a;var S=[n];for(let r of S)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var s={name:t,shader:a};
export{s as zv};

//# debugId=ADEA045299B72B0E64756E2164756E21
//# sourceMappingURL=site-3cm602d1.js.map
