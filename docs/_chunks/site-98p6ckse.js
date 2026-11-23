import{i}from"./site-1yf4ncc8.js";var e="passPixelShader",r=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);}`;if(!i.ShadersStoreWGSL[e])i.ShadersStoreWGSL[e]=r;var $R={name:e,shader:r};
export{$R};

//# debugId=6B569A09B92ACEB964756E2164756E21
//# sourceMappingURL=site-98p6ckse.js.map
