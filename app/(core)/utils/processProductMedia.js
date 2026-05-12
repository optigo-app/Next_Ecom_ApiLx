
function safeParseMediaJSON(input) {
  if (!input || input === "0" || input === 0) return [];

  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Invalid ImageVideoDetail JSON → returning empty list");
    return [];
  }
}

export function processProductMedia({
  designno,
  metalColorCode,
  imageVideoDetail,
  cdnImage,
  cdnThumb,
  cdnVideo,
}) {
  const parsed = safeParseMediaJSON(imageVideoDetail);

  const media = {
    normalImages: [],
    colorImages: [],
    normalVideos: [],
    colorVideos: [],
  };

  // ------------------ CLEAN INPUT ------------------
  parsed.forEach((item) => {
    const TI = Number(item?.TI);
    const Nm = Number(item?.Nm);
    const Ex = item?.Ex?.toLowerCase() || "";
    const CN = item?.CN?.toString()?.trim()?.toUpperCase() || null;

    if (!Nm || !Ex) return; // skip corrupted entries

    if (TI === 1) media.normalImages.push({ Nm, Ex });
    if (TI === 2) media.colorImages.push({ Nm, Ex, CN });
    if (TI === 3) media.normalVideos.push({ Nm, Ex });
    if (TI === 4) media.colorVideos.push({ Nm, Ex, CN });
  });

  // ------------------ URL BUILDERS ------------------
  const makeImage = (n, ext, color) =>
    color
      ? `${cdnImage}${designno}~${n}~${color}.${ext}`
      : `${cdnImage}${designno}~${n}.${ext}`;

  const makeThumb = (n, ext, color) => {
    const base = color
      ? `${designno}~${n}~${color}`
      : `${designno}~${n}`;
    return `${cdnThumb}${base}.jpg`;
  };

  const makeVideo = (n, ext, color) =>
    color
      ? `${cdnVideo}${designno}~${n}~${color}.${ext}`
      : `${cdnVideo}${designno}~${n}.${ext}`;

  // ------------------ RESOLVE IMAGES ------------------
  const colorFiltered = media.colorImages.filter(
    (x) => x.CN === metalColorCode
  );

  const colorImages = colorFiltered.map((i) => ({
    full: makeImage(i.Nm, i.Ex, metalColorCode),
    thumb: makeThumb(i.Nm, i.Ex, metalColorCode),
  }));

  const normalImages = media.normalImages.map((i) => ({
    full: makeImage(i.Nm, i.Ex),
    thumb: makeThumb(i.Nm, i.Ex),
  }));

  const finalImages =
    colorImages.length > 0
      ? colorImages
      : normalImages.length > 0
      ? normalImages
      : [];

  // ------------------ RESOLVE VIDEOS ------------------
  const colorVid = media.colorVideos
    .filter((x) => x.CN === metalColorCode)
    .map((i) => makeVideo(i.Nm, i.Ex, metalColorCode));

  const normalVid = media.normalVideos.map((i) =>
    makeVideo(i.Nm, i.Ex)
  );

  const finalVideos = [...colorVid, ...normalVid];

  return {
    hasImages: finalImages.length > 0,
    hasVideos: finalVideos.length > 0,
    images: finalImages,
    videos: finalVideos,
  };
}
