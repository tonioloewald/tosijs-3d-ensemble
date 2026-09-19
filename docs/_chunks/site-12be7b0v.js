import{RC as e}from"./site-eq33q5cn.js";var r="depthBoxBlurPixelShader",t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform screenSize: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var colorDepth: vec4f=vec4f(0.0);for (var x: i32=-OFFSET; x<=OFFSET; x++) {for (var y: i32=-OFFSET; y<=OFFSET; y++) {colorDepth+=textureSample(textureSampler,textureSamplerSampler,input.vUV+ vec2f(f32(x),f32(y))/uniforms.screenSize);}}
fragmentOutputs.color=(colorDepth/ f32((OFFSET*2+1)*(OFFSET*2+1)));}`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=t;var a={name:r,shader:t};
export{a as ek};

//# debugId=7D9C1CD6A7D39B2064756E2164756E21
//# sourceMappingURL=site-12be7b0v.js.map
