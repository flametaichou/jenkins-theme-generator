## Jenkins Theme Generator
![Logo](/images/logo.png)  

*A tool for customization of [Jenkins](https://www.jenkins.io/) appearance*

### About

Jenkins got fancy new appearance in version 2.346.1, that contains full restyle and a new set of icons.
I like this new appearance, however I wanted to customize some details like colors, logo and icons.

This tool is designed for this purpose.

### Features

It generates CSS overrides that can be applied with [Jenkins Simple Theme Plugin](https://plugins.jenkins.io/simple-theme-plugin/).
Here is what you can do with this tool:

- Change logo
- Customize color scheme
- Replace icons of several plugins (relevant for plugins that have not updated their icons)
- Dark background in console output

This tool will work only on Jenkins versions newer than [`2.346.1`](https://www.jenkins.io/changelog-stable/#v2.346.1)

Tested on following Jenkins versions:  
`2.375`, `2.426.3`, `2.434`

### Libraries used
- [Lit.js](https://lit.dev/) (lit-html)
- [Sass.js](https://sass-lang.com/documentation/js-api/)

### Thanks
- [jenkins-neo2-theme](https://github.com/TobiX/jenkins-neo2-theme) - for the inspiration (I used this theme long time before Jenkins v.`2.346.1`)
- [jenkins-neo-theme](https://github.com/jenkins-contrib-themes/jenkins-neo-theme) - for original neo theme
- [jenkins-material-theme](https://github.com/afonsof/jenkins-material-theme) - for the inspiration
- [Jenkins Simple Theme Plugin](https://plugins.jenkins.io/simple-theme-plugin/) - for possibility to load custom CSS into Jenkins
- [Jenkins Symbols](https://www.jenkins.io/doc/developer/views/symbols/) - for icons replacements

### TODO
- Make fonts configurable
- Add the choice between dark and light console background
- Fix color pickers (the color seems darker when the picker is open)
- Add the "successfully copied" tooltip
- Draw the Painter Jenkins picture and make it a logo?