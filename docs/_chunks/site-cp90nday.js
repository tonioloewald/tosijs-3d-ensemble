import{TC as e}from"./site-qntg4d3x.js";var i="lensFlareVertexShader",o=`attribute vec2 position;uniform mat4 viewportMatrix;varying vec2 vUV;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vUV=position*madd+madd;gl_Position=viewportMatrix*vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;if(!e.ShadersStore[i])e.ShadersStore[i]=o;var t={name:i,shader:o};
export{t as fi};

//# debugId=4BD22E1D3A0A7EF164756E2164756E21
//# sourceMappingURL=site-cp90nday.js.map
