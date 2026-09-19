import{RC as e}from"./site-eq33q5cn.js";var r="filterPixelShader",o=`varying vec2 vUV;uniform sampler2D textureSampler;uniform mat4 kernelMatrix;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec3 baseColor=texture2D(textureSampler,vUV).rgb;vec3 updatedColor=(kernelMatrix*vec4(baseColor,1.0)).rgb;gl_FragColor=vec4(updatedColor,1.0);}`;if(!e.ShadersStore[r])e.ShadersStore[r]=o;var a={name:r,shader:o};
export{a as Yk};

//# debugId=93B99E908B7EDF5264756E2164756E21
//# sourceMappingURL=site-k3kn72af.js.map
