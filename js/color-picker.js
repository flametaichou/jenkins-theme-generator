import { css, html, LitElement } from 'https://cdn.jsdelivr.net/npm/lit@2.7.6/+esm';

class ColorPicker extends LitElement {

    static styles = [
        css`
            /* Color picker */
            .color-picker__wrapper {
                display: flex;
                align-items: center;
                width: 128px;
            }
            .color-picker__input {
                height: 100%;
                width: 100%;
                cursor: pointer;
                opacity: 0;
                z-index: 2;
            }
            .color-picker {
                position: relative;
                background-color: var(--gray0);
                height: 36px;
                width: 36px;
            
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .color-picker:hover {
                filter: brightness(.9);
            }
            .color-picker__background {
                position: absolute;
                height: 100%;
                width: 100%;
                z-index: 0;
            }
            .color-picker__hint {
                padding: 0 0.5em;
            }
            .color-picker__label {
                display: block;
            }
        `
    ];

    static properties = {
        value: { type: String },
        name: { type: String }
    };

    constructor() {
        super();
        this.value = '#00000';
        this.name = '?';
    }

    pickColor(event) {
        const { value } = event.currentTarget;
        this.value = value;
        this.requestUpdate();

        this.dispatchEvent(new CustomEvent('input', {
            detail: {
                value: value
            }
        }));
    }
    
    render() {
        return html`
            <style> @import "css/ui-kit.css"; </style>
            <div class="color-picker__wrapper input">
                <div class="color-picker">
                    <div class="color-picker__background" style="background-color: ${this.value}"></div>
                    <input type="color" id="${this.name}" name="${this.name}" .value="${this.value}" class="color-picker__input" @input="${(e) => this.pickColor(e)}"/>
                </div>
                <div class="color-picker__hint">
                    <label for="${this.name}" class="color-picker__label">${this.name}</label>
                    <label class="color-picker__label text--muted text--small">${this.value}</label>
                </div>
            </div>
        `;
    }
}

customElements.define('color-picker', ColorPicker);