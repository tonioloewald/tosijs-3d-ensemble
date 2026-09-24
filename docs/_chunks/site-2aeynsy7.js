import{TC as e}from"./site-qntg4d3x.js";var o="proceduralVertexShader",i=`attribute vec2 position;varying vec2 vPosition;varying vec2 vUV;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vPosition=position;vUV=position*madd+madd;gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;if(!e.ShadersStore[o])e.ShadersStore[o]=i;var t={name:o,shader:i};
export{t as Ji};

//# debugId=17C561CEF452339364756E2164756E21
//# sourceMappingURL=site-2aeynsy7.js.map
