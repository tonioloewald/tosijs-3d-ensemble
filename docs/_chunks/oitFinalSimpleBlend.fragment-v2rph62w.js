import{RC as r}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var o="oitFinalSimpleBlendPixelShader",t=`var uFrontColor: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var fragCoord: vec2i=vec2i(fragmentInputs.position.xy);var frontColor: vec4f=textureLoad(uFrontColor,fragCoord,0);fragmentOutputs.color=frontColor;}
`;if(!r.ShadersStoreWGSL[o])r.ShadersStoreWGSL[o]=t;var n={name:o,shader:t};export{n as oitFinalSimpleBlendPixelShaderWGSL};

//# debugId=B0C504324163515D64756E2164756E21
//# sourceMappingURL=oitFinalSimpleBlend.fragment-v2rph62w.js.map
