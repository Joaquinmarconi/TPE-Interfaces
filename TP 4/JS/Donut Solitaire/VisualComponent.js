class VisualComponent {
    constructor(ctx, x, y) {
        if (this.constructor === VisualComponent) {
            throw new Error("VisualComponent es abstracta");
        }
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.visible = true;
    }

    update() {
        // 
    }

    hide() { this.visible = false; }
    show() { this.visible = true; }
}