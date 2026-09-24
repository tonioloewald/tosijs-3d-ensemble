import{TC as e}from"./site-qntg4d3x.js";var r="displayPassPixelShader",a=`varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D passSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(passSampler,vUV);}`;if(!e.ShadersStore[r])e.ShadersStore[r]=a;var o={name:r,shader:a};
export{o as uh};

//# debugId=F99531F65E9FC14264756E2164756E21
//# sourceMappingURL=site-qhgq4fqe.js.map
