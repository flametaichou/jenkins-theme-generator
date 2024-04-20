import { css, html, LitElement } from 'https://cdn.jsdelivr.net/npm/lit@2.7.6/+esm';

class PresetView extends LitElement {

    static styles = [
        css`
            .preset {
                position: relative;
            }
            .preset__footer {
                position: absolute;
                width: 100%;
                bottom: 0;
                background: linear-gradient(0deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%);
            }
            .preset__button {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
            }
            .preset__description {
                padding: 0.5em;
            }
            .preview {
                height: 200px;
                display: flex;
                flex-direction: column;
            
                font-size: 8px;
            }
            .preview .preview__header {
                height: 20px;
                display: flex;
                gap: 0.5em;
                align-items: center;
                color: var(--white);
                font-weight: bold;
            }
            .preview .preview__header img {
                height: 16px;
            }
            .preview .preview__body {
                flex: 1 0;
                display: flex;
            }
            .preview .preview__menu {
                padding: 0.2em;
                width: 50px;
                display: flex;
                flex-direction: column;
                gap: 0.2em;
            }
            .preview .preview__menu-item {
                border-radius: 4px;
                padding: 0 0.5em;
            }
            .preview .preview__menu-item--active {
                filter: opacity(.225);
            }
            .preview .preview__button {
                border-radius: 4px;
                height: 8px;
                width: 20px;
            }
            .preview .preview__content {
                flex: 1 0;
                padding: 0.2em;
            }
            .preview .preview__row {
                display: flex;
                margin-bottom: 0.2em;
                padding: 0 0.5em;
            }
            .preview .preview__row--right {
                justify-content: flex-end;
            }
            .preview .preview__code {
            }
        `
    ];

    static properties = {
        value: { type: Object }
    };

    constructor() {
        super();
        this.value = {};
    }

    color(name) {
        return this.value.colors.find((c) => c.name === name).value;
    }

    apply() {
        let event = new CustomEvent('apply', {
            detail: {
                preset: this.value
            }
        });
        this.dispatchEvent(event);
    }

    render() {
        return html`
            <style> @import "css/ui-kit.css"; </style>
            <div class="preset card">
                <div class="preview" style="color: ${this.color('black')}">
                    <div class="preview__header" style="background-color: ${this.color('primary')}">
                        <img src="${this.value.logo}"/>
                        <span>Jenkins</span>
                    </div>
                    <div class="preview__row" style="background-color: ${this.color('grey1')}">
                        Dashboard > Job
                    </div>
                    <div class="preview__body">
                        <div class="preview__menu">
                            <div class="preview__menu-item">
                                New item
                            </div>
                            <div class="preview__menu-item">
                                People
                            </div>
                            <div class="preview__menu-item preview__menu-item--active" style="background-color: ${this.color('secondary')}">
                                History
                            </div>
                            <div class="preview__menu-item">
                                Manage
                            </div>
                        </div>
                        <div class="preview__content">
                            <div class="preview__row preview__row--right">
                                <div class="preview__button" style="background-color: ${this.color('accent')}"></div>
                            </div>
                            <pre class="preview__code" style="background-color: ${this.color('black')}; color: white;">
> job started
> processing job...
> done
                            </pre>
                        </div>
                    </div>
                </div>
                <div class="preset__footer">
                    <div class="preset__description flex">
                        <div class="flex-item--fill">
                            <div>${this.value.name}</div>
                            <div class="text--small text--muted">${this.value.description}</div>
                        </div>
                        <div class="preset__button">
                            <button class="secondary" @click="${() => this.apply()}">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('preset-view', PresetView);