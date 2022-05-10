export const downloadAPK = () => {
  var a = document.createElement("a");
  a.href = "./strile.apk";
  a.setAttribute("download", "strile.apk");
  a.click();
};
