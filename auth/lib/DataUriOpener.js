export const toOpenableLink = (dataUri) => {
  return `javascript:${encodeURI(`(()=>{window.open('').document.body.innerHTML=\`<iframe src="${dataUri}" style="position:absolute;top:0;left:0;border:0;width:100%;height:100%;"></iframe>\`})()`)}`;
};
