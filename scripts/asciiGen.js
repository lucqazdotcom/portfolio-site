const DENSITY = " .:-=+*o%@";
const CHARACTER_WIDTH = 5.5;
const CHARACTER_HEIGHT = 9.6;

function renderAscii(canvas, context, output) {
  const { width, height } = canvas;
  const pixels = context.getImageData(0, 0, width, height).data;
  let ascii = "";

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const brightness =
        (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 3;
      const characterIndex = Math.floor(
        (brightness / 255) * (DENSITY.length - 1),
      );

      ascii += DENSITY[characterIndex];
    }

    ascii += "\n";
  }

  output.textContent = ascii;
}

export function createAsciiVideo(videoUrl) {
  const container = document.querySelector(".ascii-container");
  const canvas = container?.querySelector(".ascii-canvas");
  const output = container?.querySelector(".ascii-output");

  if (!container || !canvas || !output) {
    throw new Error("ASCII video elements are missing from the document");
  }

  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("Unable to create the ASCII canvas context");
  }

  const video = document.createElement("video");
  let animationFrameId;

  const resizeCanvas = () => {
    const charactersWide = Math.floor(
      container.clientWidth / CHARACTER_WIDTH,
    );
    const charactersHigh = Math.floor(
      container.clientHeight / CHARACTER_HEIGHT,
    );

    const width = Math.max(1, charactersWide * 2);
    const height = Math.max(1, charactersHigh * 2);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  };

  const updateFrame = () => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      renderAscii(canvas, context, output);
    }

    animationFrameId = requestAnimationFrame(updateFrame);
  };

  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.crossOrigin = "anonymous";

  video.addEventListener("loadedmetadata", () => {
    resizeCanvas();
    video.play().catch(() => {
      output.textContent = "Unable to play video";
    });
  });

  video.addEventListener("error", () => {
    output.textContent = "Unable to load video";
  });

  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(container);

  video.src = videoUrl;
  updateFrame();

  return () => {
    cancelAnimationFrame(animationFrameId);
    resizeObserver.disconnect();
    video.pause();
    video.removeAttribute("src");
    video.load();
  };
}
