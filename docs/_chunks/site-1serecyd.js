import{RA as n}from"./site-cgmwaca2.js";import{RC as e}from"./site-eq33q5cn.js";var t="rgbdEncodePixelShader",a=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=toRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb);}`;if(!e.ShadersStoreWGSL[t])e.ShadersStoreWGSL[t]=a;var S=[n];for(let r of S)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var s={name:t,shader:a};
export{s as xv};

//# debugId=F7F273E6B29B7F6364756E2164756E21
//# sourceMappingURL=site-1serecyd.js.map
