import{RC as e}from"./site-eq33q5cn.js";var r="copyTexture3DLayerToTexturePixelShader",t=`var textureSampler: texture_3d<f32>;uniform layerNum: i32;varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let coord=vec3f(vec2f(input.vUV.x,input.vUV.y)*vec2f(textureDimensions(textureSampler,0).xy),f32(uniforms.layerNum));let color=textureLoad(textureSampler,vec3i(coord),0).rgb;fragmentOutputs.color= vec4f(color,1);}`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=t;var a={name:r,shader:t};
export{a as Ii};

//# debugId=F7D1852DC457238364756E2164756E21
//# sourceMappingURL=site-0tjsf8d8.js.map
