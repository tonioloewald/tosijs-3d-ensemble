import{RC as e}from"./site-eq33q5cn.js";var r="volumetricLightScatteringPixelShader",t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;var lightScatteringSamplerSampler: sampler;var lightScatteringSampler: texture_2d<f32>;uniform decay: f32;uniform exposure: f32;uniform weight: f32;uniform density: f32;uniform meshPositionOnScreen: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
var tc: vec2f=input.vUV;var deltaTexCoord: vec2f=tc-uniforms.meshPositionOnScreen;deltaTexCoord*=1.0/f32(NUM_SAMPLES)*uniforms.density;var illuminationDecay: f32=1.0;var color: vec4f=textureSample(lightScatteringSampler,lightScatteringSamplerSampler,tc)*0.4;for (var i: i32=0; i<NUM_SAMPLES; i++) {tc-=deltaTexCoord;var dataSample: vec4f=textureSample(lightScatteringSampler,lightScatteringSamplerSampler,tc)*0.4;dataSample*=illuminationDecay*uniforms.weight;color+=dataSample;illuminationDecay*=uniforms.decay;}
let realColor: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);fragmentOutputs.color=vec4f(color.rgb*uniforms.exposure,realColor.a)+realColor*(1.5-0.4);
#define CUSTOM_FRAGMENT_MAIN_END
}
`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=t;var i={name:r,shader:t};
export{i as lh};

//# debugId=C48C5C4B14E8C37064756E2164756E21
//# sourceMappingURL=site-g1s14yec.js.map
