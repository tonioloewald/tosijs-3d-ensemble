import{RC as e}from"./site-eq33q5cn.js";var t="meshUVSpaceRendererMaskerVertexShader",r=`attribute uv: vec2f;varying vUV: vec2f;@vertex
fn main(input : VertexInputs)->FragmentInputs {vertexOutputs.position= vec4f( vec2f(vertexInputs.uv.x,vertexInputs.uv.y)*2.0-1.0,0.,1.0);vertexOutputs.vUV=vertexInputs.uv;}`;if(!e.ShadersStoreWGSL[t])e.ShadersStoreWGSL[t]=r;var n={name:t,shader:r};
export{n as Fh};

//# debugId=4B980559872A8BF164756E2164756E21
//# sourceMappingURL=site-ejs9443h.js.map
