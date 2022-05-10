import { useRef } from "react";
import Canvas from "./Canvas";

interface GraphProps {
  width: string | number;
  height: string | number;
  title: string;
  points: number[][];
  commonMax: number;
}

const Graph = ({ width, height, title, points, commonMax }: GraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  let max = 0;
  points.forEach(p => {
    max = Math.max(max, p[0])
  })

  const draw = (ctx: any, frameCount: number) => {
    let width = containerRef.current?.clientWidth ?? 0;
    let height = containerRef.current?.clientHeight ?? 0;

    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.font = "18px Roboto";
    ctx.fillText(title, 25, 30);

    ctx.strokeStyle = "#C8C8C8";
    ctx.fillStyle = "#C8C8C8";
    ctx.font = "14px Roboto";
    var maxCountWidth = ctx.measureText(commonMax.toFixed(1)).width + 5;

    let mb = 20 + 18;
    let mt = 60;
    let ml = 25 + maxCountWidth;
    let mr = 20;
    const heightGraph = height - mb - mt;
    const widthGraph = width - ml - mr;

    ctx.beginPath();
    ctx.moveTo(ml, mt);
    ctx.lineTo(ml, height - mb);
    ctx.lineTo(width - mr, height - mb);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ml, mt);
    ctx.lineTo(width - mr, mt);
    ctx.moveTo(ml, mt + heightGraph / 3);
    ctx.lineTo(width - mr, mt + heightGraph / 3);
    ctx.moveTo(ml, mt + (heightGraph / 3) * 2);
    ctx.lineTo(width - mr, mt + (heightGraph / 3) * 2);
    ctx.setLineDash([20, 15]);
    ctx.stroke();

    for (let index = 0; index < 7; index++) {
      ctx.fillText(points[index][1], (index * widthGraph) / 6 + ml - 4, heightGraph + mt + 18);
    }


    for (let index = 0; index < 3; index++) {
      ctx.fillText((max / 3 * (3 - index)).toFixed(1), ml - maxCountWidth, (index * heightGraph) / 3 + mt + 5);
    }

    ctx.strokeStyle = "#0971f1";
    ctx.fillStyle = "#0971f1";
    ctx.setLineDash([20, 0]);

    ctx.moveTo(ml, mt + heightGraph - (heightGraph / max) * points[0][0]);
    for (let index = 0; index < 7; index++) {
      ctx.beginPath();
      ctx.arc(
        (index * widthGraph) / 6 + ml,
        mt + heightGraph - (heightGraph / max) * points[index][0],
        3,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    ctx.moveTo(ml, mt + heightGraph - (heightGraph / max) * points[0][0]);
    ctx.beginPath();
    for (let index = 0; index < 7; index++) {
      ctx.lineTo((index * widthGraph) / 6 + ml, mt + heightGraph - (heightGraph / max) * points[index][0]);
    }
    ctx.stroke();
  };

  return (
    <div ref={containerRef} style={{ height: height, width: width }}>
      <Canvas draw={draw} />
    </div>
  );
};

export default Graph;
