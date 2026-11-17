import{Hd}from"./site-dsj0gcfk.js";import{i}from"./site-1yf4ncc8.js";var t="gaussianSplattingVoxelPixelShader",o=`var voxel_storage: texture_storage_3d<r8unorm,write>;var<storage,read_write> voxelOpacityBuffer: array<atomic<u32>>;
#include<iblVoxelOpacityAtomicMax>
varying vNormalizedPosition: vec3f;varying vNormalizedCenterPosition: vec3f;varying vAlpha: f32;varying vPatchPosition: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let normPos: vec3f=input.vNormalizedPosition;let size: vec3<u32>=textureDimensions(voxel_storage);let stepSize: f32=1.0/f32(size.x);let diff: vec3f=abs(input.vNormalizedCenterPosition-normPos);let distToCenter: f32=max(max(diff.x,diff.y),diff.z);let gaussian: f32=exp(-dot(input.vPatchPosition,input.vPatchPosition));let shadowingOpacity: f32=clamp(
select(gaussian,1.0,distToCenter<stepSize)*input.vAlpha,
0.0,1.0
);if (shadowingOpacity<=0.0) {discard;}
let coord: vec3<u32>=min(
vec3<u32>(u32(normPos.x*f32(size.x)),u32(normPos.y*f32(size.y)),u32(normPos.z*f32(size.z))),
size-vec3<u32>(1u));let vidx: u32=coord.x+coord.y*size.x+coord.z*size.x*size.y;voxelOpacityAtomicMax(vidx,u32(shadowingOpacity*255.0+0.5));fragmentOutputs.color=vec4f(0.0,0.0,0.0,0.0);}
`;if(!i.ShadersStoreWGSL[t])i.ShadersStoreWGSL[t]=o;var a=[Hd];for(let e of a)if(!i.IncludesShadersStoreWGSL[e.name])i.IncludesShadersStoreWGSL[e.name]=e.shader;var n={name:t,shader:o};export{n as gaussianSplattingVoxelPixelShaderWGSL};

//# debugId=F091477AF6BA9FFE64756E2164756E21
//# sourceMappingURL=gaussianSplattingVoxel.fragment-27nazpmt.js.map
