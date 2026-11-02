import{ie}from"./site-gs8qfa0v.js";import{i}from"./site-1yf4ncc8.js";var r="rgbdDecodePixelShader",t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(fromRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV)),1.0);}`;if(!i.ShadersStoreWGSL[r])i.ShadersStoreWGSL[r]=t;var a=[ie];for(let e of a)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var NT={name:r,shader:t};
export{NT};

//# debugId=87644E00DAC9D79C64756E2164756E21
//# sourceMappingURL=site-f4gpwqtr.js.map
