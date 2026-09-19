import{RC as e}from"./site-eq33q5cn.js";var r="displayPassPixelShader",a=`varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D passSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(passSampler,vUV);}`;if(!e.ShadersStore[r])e.ShadersStore[r]=a;var o={name:r,shader:a};
export{o as sh};

//# debugId=34F97CBEB3E8596664756E2164756E21
//# sourceMappingURL=site-rb3bjfnm.js.map
