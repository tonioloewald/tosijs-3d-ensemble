import{TC as e}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var r="lod3DPixelShader",o=`precision highp float;precision highp sampler3D;const float GammaEncodePowerApprox=1.0/2.2;varying vec2 vUV;uniform sampler3D textureSampler;uniform float lod;uniform float slice;uniform int gamma;void main(void)
{ivec3 textureCoordinates=ivec3(vUV*vec2(textureSize(textureSampler,0).xy),int(slice));gl_FragColor=texelFetch(textureSampler,textureCoordinates,int(lod));if (gamma==0) {gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(GammaEncodePowerApprox));}}
`;if(!e.ShadersStore[r])e.ShadersStore[r]=o;var a={name:r,shader:o};export{a as lod3DPixelShader};

//# debugId=0D1C1AF7D0EE75ED64756E2164756E21
//# sourceMappingURL=lod3D.fragment-yawk99q4.js.map
