import{RC as e}from"./site-eq33q5cn.js";var i="lensFlareVertexShader",o=`attribute vec2 position;uniform mat4 viewportMatrix;varying vec2 vUV;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vUV=position*madd+madd;gl_Position=viewportMatrix*vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;if(!e.ShadersStore[i])e.ShadersStore[i]=o;var t={name:i,shader:o};
export{t as di};

//# debugId=D3BF2FF5F015763A64756E2164756E21
//# sourceMappingURL=site-emv7cjy3.js.map
