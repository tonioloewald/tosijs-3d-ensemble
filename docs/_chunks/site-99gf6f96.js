import{RC as e}from"./site-eq33q5cn.js";var t="postprocessVertexShader",r=`attribute position: vec2<f32>;uniform scale: vec2<f32>;varying vUV: vec2<f32>;const madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.vUV=(vertexInputs.position*madd+madd)*uniforms.scale;vertexOutputs.position=vec4(vertexInputs.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!e.ShadersStoreWGSL[t])e.ShadersStoreWGSL[t]=r;var o={name:t,shader:r};
export{o as oB};

//# debugId=708377DAAACC229564756E2164756E21
//# sourceMappingURL=site-99gf6f96.js.map
