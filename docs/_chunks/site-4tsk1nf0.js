import{i}from"./site-1yf4ncc8.js";var e="clearQuadVertexShader",r=`uniform depthValue: f32;const pos=array(
vec2f(-1.0,1.0),
vec2f(1.0,1.0),
vec2f(-1.0,-1.0),
vec2f(1.0,-1.0)
);
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.position=vec4f(pos[vertexInputs.vertexIndex],uniforms.depthValue,1.0);
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!i.ShadersStoreWGSL[e])i.ShadersStoreWGSL[e]=r;var u2={name:e,shader:r};
export{u2};

//# debugId=231B6C914ADD876564756E2164756E21
//# sourceMappingURL=site-4tsk1nf0.js.map
