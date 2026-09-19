import{RC as e}from"./site-eq33q5cn.js";var o="ssaoCombinePixelShader",r=`uniform sampler2D textureSampler;uniform sampler2D originalColor;uniform vec4 viewport;varying vec2 vUV;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
vec2 uv=viewport.xy+vUV*viewport.zw;vec4 ssaoColor=texture2D(textureSampler,uv);vec4 sceneColor=texture2D(originalColor,uv);gl_FragColor=sceneColor*ssaoColor;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;if(!e.ShadersStore[o])e.ShadersStore[o]=r;var a={name:o,shader:r};
export{a as Ik};

//# debugId=2663E488963CF93964756E2164756E21
//# sourceMappingURL=site-x16g1sw1.js.map
