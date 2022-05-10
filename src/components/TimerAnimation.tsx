import { useRef } from "react";
import Canvas from "./Canvas";

interface TimerAnimationProps {
  width: string | number;
  height: string | number;
  now: number;
  total: number;
}

const TimerAnimation = ({ width, height, now, total }: TimerAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const roundRect = (
    ctx: any,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    return ctx;
  };

  const parabolaY = (x: number, h: number) => {
    return Math.pow(x, 2) - h * x + Math.pow(h, 2) / 4;
  };

  const draw = (ctx: any, frameCount: number) => {
    let width = containerRef.current?.clientWidth ?? 0;
    let height = containerRef.current?.clientHeight ?? 0;

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    ctx.strokeStyle = "#C8C8C8";
    ctx.fillStyle = "#C8C8C8";

    const longInterval = 5000;
    const shortInterval = 1000;

    const shortWidth = Math.min(width * 0.5, 100);
    const longWidth = Math.min(width * 0.8, 150);
    const shortHeight = 3;
    const longHeight = 6;
    const marginBetween = 40;

    let leftLong = (width - longWidth) / 2;
    let leftShort = (width - shortWidth) / 2;

    let totalHeightMargins = (total / shortInterval) * marginBetween;
    let totalHeightLongLines = (total / longInterval) * longHeight;
    let totalHeightShortLines =
      (total / shortInterval - total / longInterval) * shortHeight;
    let totalHeight =
      totalHeightLongLines + totalHeightMargins + totalHeightShortLines;

    let positionVisibleZone = totalHeight - (now * totalHeight) / total;
    let heightVisibleZone = height;

    let time = 0;
    for (
      let totalTop = 0;
      totalTop < positionVisibleZone + heightVisibleZone;
      time += shortInterval
    ) {
      if (time % longInterval == 0) totalTop += longHeight;
      else totalTop += shortHeight;

      totalTop += marginBetween;

      if (totalTop >= positionVisibleZone) {
        let x = totalTop - positionVisibleZone;
        let alpha =
          (1 -
            parabolaY(x, heightVisibleZone) / parabolaY(0, heightVisibleZone));
        ctx.globalAlpha = alpha;
        let top = totalTop - positionVisibleZone;
        if (time % longInterval == 0) {
          let right = leftLong + longWidth;
          let buttom = totalTop - positionVisibleZone + longHeight;
          roundRect(ctx, leftLong, top, right - leftLong, buttom - top, 100).fill();
        } else {
          let right = leftShort + shortWidth;
          let buttom = totalTop - positionVisibleZone + shortHeight;
          roundRect(ctx, leftShort, top, right - leftShort, buttom - top, 100).fill();
        }
      }
    }
  };

  return (
    <div ref={containerRef} style={{ height: height, width: width }}>
      <Canvas draw={draw} />
    </div>
  );
};

export default TimerAnimation;
