
type ICalda = IPosition;
interface IVertice {
    tipo: 'cobra' | 'comida' | 'vazio';
    calda: boolean;
    cabeça: boolean;
    posicao: IPosition;
}

type IVertice1D = IVertice[];
type IVertice2D = IVertice1D[];


interface IPosition {
    x: number;
    y: number;
}



const ALTURA = 400;
const LARGURA = 400;

const TAM_MATRIZ = 20;

const TAM_PC = ALTURA / TAM_MATRIZ;

const TAM_FONT = 10;


class Game {

    matriz: IVertice2D;
    context: CanvasRenderingContext2D;
    snake = new Cobrinha();
    comida: IVertice


    constructor(context: CanvasRenderingContext2D) {
        this.matriz = this.criaMatriz(TAM_MATRIZ);
        this.context = context;
        this.iniciaJogo();
    }

    criaMatriz(tam: number) {

        const getNewVertex = (x: number, y: number): IVertice => ({
            tipo: 'vazio',
            calda: false,
            cabeça: false,
            posicao: { x, y }
        });

        let m = new Array(tam).fill(0).map(() => (new Array(tam).fill(0)));
        for (let i = 0; i < tam; i++) {
            for (let j = 0; j < tam; j++) {
                m[i][j] = getNewVertex(i, j);
            }
        }
        return m;
    }

    renderizacao() {
        this.desenharCanvas();
        this.atualizaMatriz()
        //this.atualizaComida();
        this.desenhaMatriz();
    }

    desenharCanvas() {
        this.context.fillStyle = 'yellow';
        this.context.fillRect(0, 0, LARGURA, ALTURA);
    }

    desenhaMatriz() {
        for (let i = 0; i < TAM_PC; i++) {
            for (let j = 0; j < TAM_PC; j++) {
                this.desanhaBorda(i, j);
                if (this.matriz[i][j].tipo === 'vazio') {
                    this.desenhaDistancia(i, j)
                } else if (this.matriz[i][j].tipo === 'comida') {
                    this.desenhaComida(i, j)
                } else if (this.matriz[i][j].tipo === 'cobra') {
                    this.desenhaCobra(i, j)
                }
            }
        }

        if(!this.snake.vida) {
            this.context.font = "20px Comic Sans MS";
            this.context.fillStyle = "black";
            this.context.textAlign = 'center'
            this.context.fillText(`Você perdeu!!`, ALTURA/2, LARGURA/2);
        }
    }

    desanhaBorda(i: number, j: number) {
        this.context.strokeRect(i * TAM_PC, j * TAM_PC, TAM_PC, TAM_PC);
    }

    desenhaDistancia(i: number, j: number) {
        this.context.font = TAM_FONT + "px Comic Sans MS";
        this.context.fillStyle = "red";
        this.context.textAlign = 'center'
        this.context.fillText(`0`, ((i * TAM_PC) + TAM_PC / 2), ((j * TAM_PC) + (TAM_PC / 2 * Math.sqrt(2))));
    }

    desenhaCobra(i: number, j: number) {

        this.context.fillStyle = "gray";
        this.context.fillRect(i * TAM_PC + 1, j * TAM_PC + 1, TAM_PC - 1, TAM_PC - 1)

    }

    desenhaComida(i: number, j: number) {

        this.context.fillStyle = "red";
        this.context.fillRect(i * TAM_PC + 1, j * TAM_PC + 1, TAM_PC - 1, TAM_PC - 1)


    }

    atualizarCobra() {
        const cabeça = this.snake.estado[0]
        if (this.snake.estado.some((calda, index) => index > 0 && calda.x == cabeça.x && calda.y == cabeça.y))
            this.snake.conflito();
        if (this.comida.posicao.x === cabeça.x && this.comida.posicao.y === cabeça.y) {
            this.snake.comer();
            this.geraComida()
        }
        this.snake.estado.forEach((calda: ICalda, index) => {
            this.matriz[calda.x][calda.y] = { posicao: calda, tipo: 'cobra', cabeça: index == 0, calda: index != 0 };
        });
    }

    atualizaMatriz() {
        this.matriz = this.criaMatriz(TAM_MATRIZ);
        this.atualizarCobra();
        const { x, y }: any = this.comida.posicao;
        this.matriz[x][y] = this.comida;
    }

    iniciaJogo() {
        this.geraComida();
        this.atualizarCobra();
    }

    geraComida() {
        const r = () => Math.floor((Math.random() * TAM_MATRIZ) % TAM_MATRIZ - 1)
        const [x, y]: any = [r(), r()]
        this.comida = { posicao: { x, y }, tipo: 'comida', cabeça: false, calda: false }
    }

}

class Cobrinha {

    vida: boolean = true;
    estado: ICalda[] = []
    ultimo_comando = '';

    constructor() {
        this.estado.push({ x: 10, y: 15 });
    }

    desenharCobrinha(ctx: CanvasRenderingContext2D, TAM_PC: number) {

    }

    conflito() {
        this.vida = false;
        console.log('Fim do jogo!');

    }

    comer() {
        let { x, y } = this.estado[this.estado.length - 1];
        // if (this.ultimo_comando === 'esquerda') x = x + 1
        // if (this.ultimo_comando === 'direita') x = x - 1
        // if (this.ultimo_comando === 'cima') y = y + 1
        // if (this.ultimo_comando === 'baixo') y = y - 1

        this.estado.push({ x, y })

        console.log(this.estado, this.ultimo_comando, x, y)
    }

    esquerda() {
        if (this.ultimo_comando == 'direita'  || !this.vida) return;
        this.ultimo_comando = 'esquerda';

        if (this.estado[0].x - 1 < 0) {
            this.conflito();
            return;
        }

        let aux = this.estado[0];
        this.estado[0] = { x: aux.x - 1, y: aux.y }

        for (let i = 1; i < this.estado.length; i++) {
            let aux2 = this.estado[i]
            this.estado[i] = aux;
            aux = aux2;

        }

    }

    cima() {
        if (this.ultimo_comando == 'baixo' || !this.vida) return;
        this.ultimo_comando = 'cima';

        if (this.estado[0].y - 1 < 0) {
            this.conflito();
            return;
        }
        let aux = this.estado[0];
        this.estado[0] = { x: aux.x, y: aux.y - 1 }

        for (let i = 1; i < this.estado.length; i++) {
            let aux2 = this.estado[i]
            this.estado[i] = aux;
            aux = aux2;

        }

    }

    direita() {


        if (this.ultimo_comando == 'esquerda' || !this.vida) return;
        this.ultimo_comando = 'direita';

        if (this.estado[0].x + 1 >= TAM_MATRIZ) {
            this.conflito();
            return;
        }
        let aux = this.estado[0];
        this.estado[0] = { x: aux.x + 1, y: aux.y }

        for (let i = 1; i < this.estado.length; i++) {
            let aux2 = this.estado[i]
            this.estado[i] = aux;
            aux = aux2;

        }

    }

    baixo() {
        if (this.ultimo_comando == 'cima' || !this.vida) return;
        this.ultimo_comando = 'baixo';

        if (this.estado[0].y + 1 >= TAM_MATRIZ) {
            this.conflito();
            return;
        }

        let aux = this.estado[0];
        this.estado[0] = { x: aux.x, y: aux.y + 1 }

        for (let i = 1; i < this.estado.length; i++) {
            let aux2 = this.estado[i]
            this.estado[i] = aux;
            aux = aux2;

        }
    }
}


var stage: HTMLCanvasElement = document.getElementById('stage');
var ctx: CanvasRenderingContext2D = stage.getContext('2d');

document.addEventListener("keydown", keyPush)

// setInterval(game, 50);



const jogo = new Game(ctx);
game();



function game() {
    jogo.renderizacao();

}

function keyPush(event: KeyboardEvent) {
    switch (event.keyCode) {
        case 37: //left
            jogo.snake.esquerda();
            break;

        case 38: //up
            jogo.snake.cima();
            break;

        case 39: //right
            jogo.snake.direita();
            break;

        case 40: //down
            jogo.snake.baixo();
            break;
        default:
            break;
    }
    game();
}


// const matriz: Matriz = new Matriz();

// const VEL = 1;
// var vx = 0;
// var vy = 0;

// var px = 10;
// var py = 15;

// var foodx
// var foody = foodx = 15;

// var trail = [{ x: 10, y: 10 }];
// var tail = 5;

// const matriz = new Matriz(ctx);




// function game() {

//     px += vx;
//     py += vy;

//     if (px < 0) {
//         px = TAM_PC - 1;
//     }
//     if (px > TAM_PC - 1) {
//         px = 0;
//     }
//     if (py < 0) {
//         py = TAM_PC - 1;
//     }
//     if (py > TAM_PC - 1) {
//         py = 0;
//     }

//     // matriz.drawMatriz(ctx);

//     matriz.desenharCanvas(ctx, TAM_PC, TAM_PC);

//     const escrita = new Array(TAM_PC).fill(new Array(TAM_PC).fill('0'));

//     matriz.desenhaMatriz(ctx, escrita);




//     ctx.fillStyle = 'red';
//     ctx.fillRect(foodx * TAM_MATRIZ, foody * TAM_MATRIZ, TAM_MATRIZ, TAM_MATRIZ);

//     ctx.fillStyle = "gray";
//     for (let i = 0; i < trail.length; i++) {
//         ctx.fillRect(trail[i].x * TAM_MATRIZ, trail[i].y * TAM_MATRIZ, TAM_MATRIZ, TAM_MATRIZ);

//         // if ((trail)[i].x === px && trail[i].y === py) {
//         //     vx = 0;
//         //     vy = 0;
//         // }
//         trail.push({ x: px, y: py });
//         while (trail.length > tail) {
//             trail.shift();
//         }

//         if (foodx === px && foody === py) {
//             tail++;
//             foodx = Math.floor(Math.random() * TAM_PC)
//             foody = Math.floor(Math.random() * TAM_PC)
//         }
//     }


// }




