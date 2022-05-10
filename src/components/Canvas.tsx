import React, { useRef, useEffect } from "react";

const Canvas = (props: any) => {
  const { draw, ...rest } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      let frameCount = 0;
      let animationFrameId: number;

      const render = () => {
        frameCount++;
        draw(context, frameCount);
        animationFrameId = window.requestAnimationFrame(render);
      };
      render();

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }
  }, [draw]);

  return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas;
