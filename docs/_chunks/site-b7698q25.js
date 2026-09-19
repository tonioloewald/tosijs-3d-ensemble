import{RC as e}from"./site-eq33q5cn.js";var r="lensFlarePixelShader",o=`varying vec2 vUV;uniform sampler2D textureSampler;uniform vec4 color;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
vec4 baseColor=texture2D(textureSampler,vUV);gl_FragColor=baseColor*color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;if(!e.ShadersStore[r])e.ShadersStore[r]=o;var l={name:r,shader:o};
export{l as ci};

//# debugId=BD1400CFC666AE1B64756E2164756E21
//# sourceMappingURL=site-b7698q25.js.map
