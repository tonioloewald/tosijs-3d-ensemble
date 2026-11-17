import{i}from"./site-1yf4ncc8.js";var e="iblVoxelOpacityAtomicMax",o=`fn voxelOpacityAtomicMax(vidx: u32,value: u32) {let wordIdx: u32=vidx>>2u;let shift: u32=(vidx & 3u)*8u;let mask: u32=0xFFu<<shift;let shifted: u32=(value & 0xFFu)<<shift;loop {let oldWord: u32=atomicLoad(&voxelOpacityBuffer[wordIdx]);if (value<=((oldWord>>shift) & 0xFFu)) {break;}
let newWord: u32=(oldWord & ~mask) | shifted;if (atomicCompareExchangeWeak(&voxelOpacityBuffer[wordIdx],oldWord,newWord).exchanged) {break;}}}
`;if(!i.IncludesShadersStoreWGSL[e])i.IncludesShadersStoreWGSL[e]=o;var Hd={name:e,shader:o};
export{Hd};

//# debugId=23C5455D3D6F94A964756E2164756E21
//# sourceMappingURL=site-dsj0gcfk.js.map
