import{RC as e}from"./site-eq33q5cn.js";var i="volumetricLightScatteringPassPixelShader",r=`#if defined(ALPHATEST) || defined(NEED_UV)
varying vec2 vUV;
#endif
#if defined(ALPHATEST)
uniform sampler2D diffuseSampler;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{
#if defined(ALPHATEST)
vec4 diffuseColor=texture2D(diffuseSampler,vUV);if (diffuseColor.a<0.4)
discard;
#endif
gl_FragColor=vec4(0.0,0.0,0.0,1.0);}
`;if(!e.ShadersStore[i])e.ShadersStore[i]=r;var f={name:i,shader:r};
export{f as Zg};

//# debugId=8512B6D31A1F735964756E2164756E21
//# sourceMappingURL=site-t0ed5tyj.js.map
