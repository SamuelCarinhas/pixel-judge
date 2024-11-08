import { useEffect, useRef } from "react"

interface Ball {
    x: number
    y: number
    dx: number
    dy: number
    ex: number
    ey: number
    size: number
    red: number
    green: number
    blue: number
    alpha: number
    fade: boolean
}

interface MousePosition {
    x: number,
    y: number
}

export default function AnimatedCanvas() {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const mouseRef = useRef<MousePosition | null>(null);
    const mouseIn = useRef<boolean>(false);

    function draw(ctx: CanvasRenderingContext2D, state: Ball[]) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        const xStep = 0.3/width;
        const yStep = 0.3/height;

        ctx.clearRect(0, 0, width, height);

        for(const ball of state) {
            ctx.fillStyle = `rgba(${ball.red}, ${ball.green}, ${ball.blue}, ${ball.alpha})`;
            ctx.beginPath();
            ctx.arc(ball.x * width, ball.y * height, ball.size, 0, 2 * Math.PI);
            ctx.fill();

            let dx = ball.dx + ball.ex;
            let dy = ball.dy + ball.ey;

            if(
                (ball.x + xStep * dx) * width < ball.size ||
                (ball.x + xStep * dx) * width > width - ball.size
            ) {
                ball.dx *= -1;
                ball.ex *= -1;
            }
            if(
                (ball.y + yStep * dy) * height < ball.size ||
                (ball.y + yStep * dy) * height > height - ball.size
            ) {
                ball.dy *= -1;
                ball.ey *= -1;
            }

            dx = ball.dx + ball.ex;
            dy = ball.dy + ball.ey;

            ball.x += xStep * dx;
            ball.y += yStep * dy;

            ball.alpha += (ball.fade ? -1 : 1) * 0.001;
            if(ball.alpha < 0 || ball.alpha > 0.5) {
                ball.fade = !ball.fade;
                ball.alpha += (ball.fade ? -1 : 1) * 0.001;
            }

            if(!mouseIn.current || !mouseRef.current) {
                ball.ex /= 1.1;
                ball.ey /= 1.1;
                continue;
            }

            const x = ball.x * width;
            const y = ball.y * height;

            const d = Math.sqrt(Math.pow(x - mouseRef.current.x, 2) + Math.pow(y - mouseRef.current.y, 2));

            if(d > height / 5) {
                ball.ex /= 1.2;
                ball.ey /= 1.2;
                continue;
            }
        
            ball.ex += d/(width/5) / 4 * ball.dx;
            ball.ey += d/(height/5) / 4 * ball.dy;
        }
    }

    useEffect(() => {
        if(!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if(!ctx) return;
        
        let frame: number = -1;

        const state: Ball[] = [];
        for(let i = 0; i < 100; i++) {
            state.push({
                x: 0.1 + Math.random() - 0.1,
                y: 0.1 + Math.random() - 0.1,
                dx: 1 - 2 * Math.random(),
                dy: 1 - 2 * Math.random(),
                ex: 0,
                ey: 0,
                size: Math.random() * 2 + 0.5,
                red: 255,
                green: 136,
                blue: 0,
                alpha: Math.random() / 2,
                fade: Math.random() < 0.5
            })
        }
        
        const loop = () => {
            draw(ctx, state);
            
            frame = requestAnimationFrame(() => loop());
        }

        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if(!canvas) return;

            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;

            ctx.canvas.width = canvas.width;
            ctx.canvas.height = canvas.height;
        }

        const handleMouseMove = (event: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            mouseRef.current = { x, y };

            const isInside =
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom;
            
            mouseIn.current = isInside;
        };

        resizeCanvas();
        
        frame = requestAnimationFrame(() => loop());
        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
        }
    }, [canvasRef]);

    return (
        <canvas ref={canvasRef} className="absolute h-[100%] w-full" />
    )

}