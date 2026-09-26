import{re}from"./site-k4eckz4x.js";import{i}from"./site-1yf4ncc8.js";var r="rgbdEncodePixelShader",t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=toRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb);}`;if(!i.ShadersStoreWGSL[r])i.ShadersStoreWGSL[r]=t;var n=[re];for(let e of n)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var bT={name:r,shader:t};
export{bT};

//# debugId=863185EA627CA64D64756E2164756E21
//# sourceMappingURL=site-jk5pgxyt.js.map
