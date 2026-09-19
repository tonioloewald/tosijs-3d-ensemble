import{RC as e}from"./site-eq33q5cn.js";var t="meshUVSpaceRendererFinaliserVertexShader",r=`attribute position: vec3f;attribute uv: vec2f;uniform worldViewProjection: mat4x4f;varying vUV: vec2f;@vertex
fn main(input : VertexInputs)->FragmentInputs {vertexOutputs.position=uniforms.worldViewProjection* vec4f(vertexInputs.position,1.0);vertexOutputs.positionvUV=vertexInputs.uv;}
`;if(!e.ShadersStoreWGSL[t])e.ShadersStoreWGSL[t]=r;var n={name:t,shader:r};
export{n as Hh};

//# debugId=DB49E5E604F53F3A64756E2164756E21
//# sourceMappingURL=site-ncf0hvhv.js.map
