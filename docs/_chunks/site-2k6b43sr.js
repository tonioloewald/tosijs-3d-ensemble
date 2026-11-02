import{i}from"./site-1yf4ncc8.js";var e="passPixelShader",r=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);}`;if(!i.ShadersStoreWGSL[e])i.ShadersStoreWGSL[e]=r;var aC={name:e,shader:r};
export{aC};

//# debugId=2647DA2F570AE97B64756E2164756E21
//# sourceMappingURL=site-2k6b43sr.js.map
