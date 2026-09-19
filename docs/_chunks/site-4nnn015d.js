import{RA as a}from"./site-cgmwaca2.js";import{RC as e}from"./site-eq33q5cn.js";var t="rgbdDecodePixelShader",n=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(fromRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV)),1.0);}`;if(!e.ShadersStoreWGSL[t])e.ShadersStoreWGSL[t]=n;var S=[a];for(let r of S)if(!e.IncludesShadersStoreWGSL[r.name])e.IncludesShadersStoreWGSL[r.name]=r.shader;var s={name:t,shader:n};
export{s as uv};

//# debugId=BE74F09C6D44B09464756E2164756E21
//# sourceMappingURL=site-4nnn015d.js.map
