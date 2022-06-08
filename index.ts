class Matriz {
    desenharMatriz(ctx: CanvasRenderingContext2D, TAM_X: number, TAM_Y: number) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(0, 0, 400, 400);
    }

    escreverNaMatriz(ctx: CanvasRenderingContext2D, escrita: Array<Array<any>>, TAM_PC: number) {
        for (let i = 0; i < TAM_PC; i++) {
            for (let j = 0; j < TAM_PC; j++) {
                ctx.font = "9px Comic Sans MS";
                ctx.fillStyle = "red";
                ctx.textAlign = "center";
                ctx.fillText(`${escrita[i][j]}`, i * TAM_PC + 10, j * TAM_PC + 10);
            }
        }
    }

}

var stage: HTMLCanvasElement = document.getElementById('stage');
var ctx: CanvasRenderingContext2D = stage.getContext('2d');

document.addEventListener("keydown", keyPush)

setInterval(game, 100);

console.log('teste');

const matriz = new Matriz();

// const matriz: Matriz = new Matriz();

const VEL = 1;
var vx = 0;
var vy = 0;

var px = 10;
var py = 15;

var tp = 20;

var qp = 20;

var foodx
var foody = foodx = 15;

var trail = [{ x: 10, y: 10 }];
var tail = 5;


function game() {

    px += vx;
    py += vy;

    if (px < 0) {
        px = qp - 1;
    }
    if (px > qp - 1) {
        px = 0;
    }
    if (py < 0) {
        py = qp - 1;
    }
    if (py > qp - 1) {
        py = 0;
    }

    // matriz.drawMatriz(ctx);

    matriz.desenharMatriz(ctx, qp, qp);

    const escrita = new Array(qp).fill(new Array(qp).fill('0'));
    matriz.escreverNaMatriz(ctx, escrita, tp);




    ctx.fillStyle = 'red';
    ctx.fillRect(foodx * tp, foody * tp, tp, tp);

    ctx.fillStyle = "gray";

    for (let i = 0; i < trail.length; i++) {
        ctx.fillRect(trail[i].x * tp, trail[i].y * tp, tp, tp);

        if ((trail)[i].x === px && trail[i].y === py) {
            vx = 0;
            vy = 0;
        }
        trail.push({ x: px, y: py });
        while (trail.length > tail) {
            trail.shift();
        }

        if (foodx === px && foody === py) {
            tail++;
            foodx = Math.floor(Math.random() * tp)
            foody = Math.floor(Math.random() * tp)
        }
    }


}

function keyPush(event: KeyboardEvent) {
    console.log(event.keyCode);
    switch (event.keyCode) {
        case 37: //left
            vx = -VEL;
            vy = 0;
            break;

        case 38: //up
            vx = 0;
            vy = -VEL;
            break;

        case 39: //right
            vx = 1;
            vy = 0;
            break;

        case 40: //down
            vx = 0;
            vy = VEL
            break;
        default:
            break;
    }
    console.log(vx, vy)
}


