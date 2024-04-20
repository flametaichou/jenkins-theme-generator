import { css, html, LitElement } from 'https://cdn.jsdelivr.net/npm/lit@2.7.6/+esm';
import { getBase64 } from './utils.js';

const EMPTY_SRC = `images/upload.svg`;

class ImagePicker extends LitElement {

    static styles = [
        css`
            /* Image picker */
            .image-picker__wrapper {
                display: flex;
                align-items: center;
            }
            .image-picker__input {
                height: 100%;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
                z-index: 1;
            }
            .image-picker__input,
            .image-picker__input::-webkit-file-upload-button {
                cursor: pointer;
            }
            .image-picker {
                position: relative;
                background-color: var(--gray0);
                height: 42px;
                width: 42px;
            
                background-size: cover;
            }
            .image-picker:hover {
                filter: brightness(.9);
            }
            .image-picker__image {
                height: 100%;
                transition: all 0.3s ease;
                z-index: 0;
            }
            .image-picker__label {
                padding: 0 0.5em;
            }
        `
    ];

    static properties = {
        src: { type: String },
        name: { type: String }
    };

    constructor() {
        super();
        this.src = '';
        this.name = undefined;
    }

    pickFile(event) {
        const { files } = event.currentTarget;
        getBase64(files[0]).then((base64) => {
            this.src = base64;
            this.requestUpdate();

            this.dispatchEvent(new CustomEvent('input', {
                detail: {
                    src: base64
                }
            }));
        });
    }

    render() {
        return html`
            <style> @import "css/ui-kit.css"; </style>
            <div class="image-picker__wrapper input">
                <div class="image-picker" style="background-image: url('${this.src || EMPTY_SRC }')">
                    <input type="file" accept="image/*" id="${this.name}" name="${this.name}" class="image-picker__input" @input="${(e) => this.pickFile(e)}"/>
                </div>
                ${this.name ? html`
                <label for="${this.name}" class="image-picker__label">${this.name}</label>
                ` : html``}
            </div>
        `;
    }
}

customElements.define('image-picker', ImagePicker);