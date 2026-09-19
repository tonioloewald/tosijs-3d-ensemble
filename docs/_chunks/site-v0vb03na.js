import{RC as e}from"./site-eq33q5cn.js";var r="convolutionPixelShader",l=`varying vec2 vUV;uniform sampler2D textureSampler;uniform vec2 screenSize;uniform float kernel[9];
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec2 onePixel=vec2(1.0,1.0)/screenSize;vec4 colorSum =
texture2D(textureSampler,vUV+onePixel*vec2(-1,-1))*kernel[0] +
texture2D(textureSampler,vUV+onePixel*vec2(0,-1))*kernel[1] +
texture2D(textureSampler,vUV+onePixel*vec2(1,-1))*kernel[2] +
texture2D(textureSampler,vUV+onePixel*vec2(-1,0))*kernel[3] +
texture2D(textureSampler,vUV+onePixel*vec2(0,0))*kernel[4] +
texture2D(textureSampler,vUV+onePixel*vec2(1,0))*kernel[5] +
texture2D(textureSampler,vUV+onePixel*vec2(-1,1))*kernel[6] +
texture2D(textureSampler,vUV+onePixel*vec2(0,1))*kernel[7] +
texture2D(textureSampler,vUV+onePixel*vec2(1,1))*kernel[8];float kernelWeight =
kernel[0] +
kernel[1] +
kernel[2] +
kernel[3] +
kernel[4] +
kernel[5] +
kernel[6] +
kernel[7] +
kernel[8];if (kernelWeight<=0.0) {kernelWeight=1.0;}
gl_FragColor=vec4((colorSum/kernelWeight).rgb,1);}`;if(!e.ShadersStore[r])e.ShadersStore[r]=l;var n={name:r,shader:l};
export{n as Uk};

//# debugId=189A4E90D10B182B64756E2164756E21
//# sourceMappingURL=site-v0vb03na.js.map
