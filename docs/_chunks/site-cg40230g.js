import{RC as e}from"./site-eq33q5cn.js";var r="clearQuadVertexShader",t=`uniform depthValue: f32;const pos=array(
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
`;if(!e.ShadersStoreWGSL[r])e.ShadersStoreWGSL[r]=t;var a={name:r,shader:t};
export{a as It};

//# debugId=19D4D9EC3FAB7AEC64756E2164756E21
//# sourceMappingURL=site-cg40230g.js.map
