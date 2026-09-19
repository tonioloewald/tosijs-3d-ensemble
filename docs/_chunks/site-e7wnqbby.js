import{RC as e}from"./site-eq33q5cn.js";var r="displayPassPixelShader",a=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var passSamplerSampler: sampler;var passSampler: texture_2d<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(passSampler,passSamplerSampler,input.vUV);}`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=a;var p={name:r,shader:a};
export{p as rh};

//# debugId=74F1A0E3ADBFAC0E64756E2164756E21
//# sourceMappingURL=site-e7wnqbby.js.map
