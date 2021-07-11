
export class ScreenCanvas {
    canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private h: number;
    private w: number;
    private navHeight: number;
    private appHeight: number;
    private rowGap: number;
    private wordGap: number;
    private wordHeight: number;
    private wordRound: number;
    private minLength: number;
    private maxLength: number;
    private startY: number;
    private startX: number;
    private codeColors = ["#4594BF", "#94D0F0", "#D0C273", "#C38956"];
    private tabIndex = 0;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.h = this.canvas.height;
        this.w = this.canvas.width;
        this.navHeight = this.h * 0.05;
        this.appHeight = this.h - this.navHeight;
        this.rowGap = this.h * 0.025;
        this.wordGap = this.w * 0.01;
        this.wordHeight = this.w * 0.013;
        this.wordRound = this.w * 0.01;
        this.minLength = this.w * 0.05;
        this.maxLength = this.w * 0.1;
        this.startY = this.navHeight + this.h * 0.1;
        this.startX = this.w * 0.2 + this.wordGap;

        this.ctx.fillStyle = "#FFF";
        this.ctx.fillRect(0, 0, this.w, this.navHeight);
        let navOfst = 0;
        ["#209DE5", "#F124B4", "#1C1C1C"].map(clr => {
            this.ctx.beginPath();
            this.ctx.fillStyle = clr;
            this.ctx.arc(this.w * (navOfst += this.navHeight * 0.0030), this.navHeight * 0.5, this.navHeight * 0.35, 0, Math.PI * 2);
            this.ctx.fill();
        })
        this.clear();
    }

    private clear() {
        this.ctx.fillStyle = "#1C1C1C";
        this.ctx.fillRect(0, this.navHeight, this.w, this.appHeight);
    }

    
    private randomLength() {
        return this.minLength + Math.random() * (this.maxLength - this.minLength);
    }

    private randomColor() {
        return this.codeColors[Math.floor(Math.random() * this.codeColors.length)];
    }

    private roundRect(x: number, y: number, w: number, h: number, r: number) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.arcTo(x + w, y, x + w, y + h, r);
        this.ctx.arcTo(x + w, y + h, x, y + h, r);
        this.ctx.arcTo(x, y + h, x, y, r);
        this.ctx.arcTo(x, y, x + w, y, r);
        this.ctx.fill();
    }
    play() {
        const length = this.randomLength();
        this.ctx.fillStyle = this.randomColor();
        if (this.appHeight < this.startY) {
            this.startX = this.w * 0.2 + this.wordGap;
            this.startY = this.navHeight + this.h * 0.1;
            this.clear();
        } else if (this.startX + length + this.wordGap > this.w * 0.8) {
            if (this.tabIndex === 0 && Math.random() > 0.6) this.tabIndex++;
            else if (this.tabIndex === 1 && Math.random() > 0.75) this.tabIndex++;
            else if (this.tabIndex > 0) this.tabIndex--;
          
            this.startX = this.w * 0.2 + this.wordGap + this.w * 0.1 * this.tabIndex;
            this.startY += this.rowGap + this.wordHeight * (this.tabIndex === 0 && Math.random() > 0.5 ? 3 : 1);
        } else {
            this.roundRect(this.startX, this.startY, length, this.wordHeight, this.wordRound);
            this.startX += length + this.wordGap;
        }
    }
}