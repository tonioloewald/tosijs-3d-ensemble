import{RC as e}from"./site-eq33q5cn.js";var r="passPixelShader",t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);}`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=t;var S={name:r,shader:t};
export{S as OC};

//# debugId=22F00B5D6B4504D164756E2164756E21
//# sourceMappingURL=site-xkmjcj0v.js.map
