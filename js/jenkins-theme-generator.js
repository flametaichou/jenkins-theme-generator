import { css, html, LitElement } from 'https://cdn.jsdelivr.net/npm/lit@2.7.6/+esm';
import { clone, download, toCamelCase } from './utils.js';
import { PRESETS } from './presets.js';

const MAIN_COLORS_NAMES = ['primary', 'secondary', 'accent'];
const GREYSCALE_COLOR_NAMES = ['white', 'grey0', 'grey1', 'grey2', 'grey3', 'grey4', 'grey5', 'black'];

class ThemeGenerator extends LitElement {

    static styles = [
        css`
            /* Generator */
            .tg {
            }
            .tg .tg__left {
            }
            .tg .tg__right {
                min-width: 450px;
                max-width: 450px;
            }
            .tg .tg__right textarea {
                font-family: monospace !important;
                color: var(--gray3);
                background-color: var(--gray0);
            }
            @media screen and (max-width: 1000px) {
                .tg .tg__right {
                    min-width: unset !important;
                    max-width: unset !important;
                }
            
                .tg .tg__right textarea {
                    min-height: 200px;
                }
            }
            @media screen and (min-width: 1000px) {
                .tg {
                    display: flex;
                }
                .tg .tg__left {
                    margin-right: 4em;
                }
                .tg .tg__right {
                }
            }
            
            /* Presets */
            .presets {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                grid-gap: 2vh;
                grid-row-gap: 2vh;
            }
        `
    ];

    static properties = {
        text: { type: String },
        logo: { type: String },
        colors: { type: Array },
        icons: { type: Array },
        generatedCss: { type: String }
    };

    constructor() {
        super();
        this.presets = PRESETS;
        this.applyPreset(this.presets[0]);
        this.generatedCss = null;

    }

    get mainColors() {
        return this.colors.filter((c) => MAIN_COLORS_NAMES.includes(c.name));
    }

    get greyscaleColors() {
        return this.colors.filter((c) => GREYSCALE_COLOR_NAMES.includes(c.name));
    }

    get otherColors() {
        return this.colors.filter((c) => !MAIN_COLORS_NAMES.includes(c.name) && !GREYSCALE_COLOR_NAMES.includes(c.name));
    }

    pickFile(iconName, base64) {
        const icon = this.icons.find((i) => i.name === iconName);
        icon.value = base64;
        this.generatedCss = null;
        this.requestUpdate();
    }

    pickLogo(base64) {
        this.logo = base64;
        this.generatedCss = null;
        this.requestUpdate();
    }

    pickColor(colorName, value) {
        const color = this.colors.find((c) => c.name === colorName);
        color.value = value;
        this.generatedCss = null;
        this.requestUpdate();
    }

    setText(event) {
        const { value } = event.currentTarget;
        this.generatedCss = null;
        this.text = value;
    }

    applyPreset(preset) {
        const clonedPreset = clone(preset);
        this.text = clonedPreset.text;
        this.logo = clonedPreset.logo;
        this.colors = clonedPreset.colors;
        this.icons = clonedPreset.icons;
        this.generatedCss = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    exportCss() {
        const url = 'template.scss';

        fetch(url)
            .then((response) => {
                response.text().then((text) => {
                    let template = text;

                    const variables = {};
                    variables.text = `'${this.text}'`;
                    variables.imageLogo = `'${this.logo}'`;

                    for (const color of this.colors) {
                        const variableName = toCamelCase('color_' + color.name);
                        variables[variableName] = color.value;
                        variables[variableName + 'Lighten1'] = `lighten($${variableName}, 10%)`;
                        variables[variableName + 'Lighten2'] = `lighten($${variableName}, 20%)`;
                        variables[variableName + 'Darken1'] = `darken($${variableName}, 10%)`;
                        variables[variableName + 'Darken2'] = `darken($${variableName}, 20%)`;
                    }

                    for (const icon of this.icons) {
                        variables[toCamelCase('icon_' + icon.name)] = `'${icon.value}'`;
                    }

                    let templateVariables = '';
                    for (const key of Object.keys(variables)) {
                        templateVariables += `$${key}: ${variables[key]};\n`;
                    }

                    template = templateVariables + template;

                    // https://github.com/medialize/sass.js/blob/master/docs/getting-started.md#using-the-synchronous-api-in-the-browser
                    Sass.compile(template, (result) => {
                        if (result.status === 1) {
                            alert(result.formatted);
                        } else {
                            this.generatedCss = result.text;
                        }
                    });
                });
            });
    }

    downloadCss() {
        download('jenkins-theme.css', this.generatedCss);
    }

    copyCss() {
        navigator.clipboard.writeText(this.generatedCss);
    }

    render() {
        return html`
            <style> @import "css/ui-kit.css"; </style>
            <div class="tg__wrapper card">
                <div class="tg card__content">
                    <div class="tg__left">
                        
                        <div class="flex flex--gap-1">
                            <div class="flex-item--fill">
                                <h3>Theme name</h3>
                                <input type="text" class="block" placeholder="No name" .value="${this.text}" @change="${(e) => this.setText(e)}"/>
                            </div>
                            
                            <div>
                                <h3>Logo</h3>
                                <div>
                                    <image-picker .src="${this.logo}" @input="${(e) => this.pickLogo(e.detail.src)}"></image-picker>
                                </div>
                            </div>
                        </div>
                        
                        <h3>Colors</h3>
                        <div>
                            <h4>Main</h4>
                            <div class="flex flex--gap-1">
                                ${this.mainColors.map((color) => html`
                                <color-picker value="${color.value}" name="${color.name}" @input="${(e) => this.pickColor(color.name, e.detail.value)}"></color-picker>
                                `)}
                            </div>
                            <h4>Other</h4>
                            <div class="flex flex--gap-1">
                                ${this.otherColors.map((color) => html`
                                <color-picker value="${color.value}" name="${color.name}" @input="${(e) => this.pickColor(color.name, e.detail.value)}"></color-picker>
                                `)}
                            </div>
                            <h4>Grayscale</h4>
                            <div class="flex flex--gap-1">
                                ${this.greyscaleColors.map((color) => html`
                                <color-picker value="${color.value}" name="${color.name}" @input="${(e) => this.pickColor(color.name, e.detail.value)}"></color-picker>
                                `)}
                            </div>
                        </div>
                        
                        <h3>Icons</h3>
                        <div class="flex flex--gap-1">
                            ${this.icons.map((icon) => html`
                            <image-picker .src="${icon.value}" name="${icon.name}" @input="${(e) => this.pickFile(icon.name, e.detail.src)}"></image-picker>
                            `)}
                        </div>
                    
                    </div>
                    <div class="tg__right flex flex--vertical">
                        <h3>How to use</h3>
                            
                        ${this.generatedCss 
                        ? html`
                            
                        <p>
                            Here is your CSS:
                        </p>
                        <div class="flex-item--fill flex flex--vertical flex--gap-1">
                            <textarea class="flex-item--fill" .value="${this.generatedCss}"></textarea>
                            <button class="block large" @click="${this.copyCss}">Copy</button>
                        </div>
                        <ul>
                            <li>
                                Install <a href="https://plugins.jenkins.io/simple-theme-plugin/" target="_blank">Jenkins Simple Theme Plugin</a> 
                            </li>
                            <li>
                                Go to <span class="chip">Manage Jenkins</span> > <span class="chip">Appearance</span>
                            </li>
                            <li>
                                Put this CSS into <span class="chip">Extra CSS</span> block and save
                            </li>
                        </ul>
                        <p>
                            You can also upload this CSS on your server and put its address into <span class="chip">CSS URL</span> block.
                        </p>
                        ` : html`
                        <p>
                            This tool generates overrides for CSS variables and styles to customize your <a href="https://www.jenkins.io/">Jenkins</a> appearance.
                        </p>
                        <p>
                            Theme can be configured on the left side. You can create a new theme or edit one of presets below.
                        </p>
                        <ul>
                            <li>
                                <strong>Theme name</strong> will appear in the footer if defined
                            </li>
                            <li>
                                <strong>Logo</strong> will replace default logo in header if defined
                            </li>
                            <li>
                                Color scheme will be replaced with defined <strong>colors</strong>
                            </li>
                            <li>
                                You can override some plugins icons via this tool. 
                                Loaded <strong>icons</strong> will replace default ones. Can be relevant only for older versions of these plugins.
                                SVG images are preferred to be used. 
                            </li>
                        </ul>
                        <p>
                            After clicking the <span class="chip">Generate</span> button, the CSS of the theme will appear here.
                        </p>
                        `}
                    </div>
                </div>
                <div class="card__footer">
                    ${this.generatedCss ? html`
                        <button class="primary block large" @click="${this.downloadCss}">Download</button>
                    ` : html`
                        <button class="secondary block large" @click="${this.exportCss}" ?disabled="${!!this.generatedCss}">Generate</button>
                    `}
                </div>
            </div>
            
            <h2>Presets</h2>
            <div class="presets">
                ${this.presets.map((preset) => html`
                <preset-view .value="${preset}" @apply="${(e) => this.applyPreset(e.detail.preset)}"></preset-view>
                `)}
            </div>
        `;
    }
}

customElements.define('theme-generator', ThemeGenerator);