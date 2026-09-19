import{RC as t}from"./site-eq33q5cn.js";var e="oitBackBlendPixelShader",r=`var uBackColor: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureLoad(uBackColor,vec2i(fragmentInputs.position.xy),0);if (fragmentOutputs.color.a==0.0) {discard;}}
`;if(!t.ShadersStoreWGSL[e])t.ShadersStoreWGSL[e]=r;var o={name:e,shader:r};
export{o as Xm};

//# debugId=89B3E65900E9B75164756E2164756E21
//# sourceMappingURL=site-7kq070ww.js.map
