import { createGlobalStyle } from 'styled-components'

const EstilosGlobais = createGlobalStyle`

:root {
    --primaria: #4D5667;
    --secundaria: #707070;
    --terciaria: #0485BF;
    --black: #1A1A1A;
    --white: #FFF;
    --styled-white: #E5E5E5;
    --alert-success: #61B96E;
    --alert-success-50: #F0FDF5;
    --alert-success-100: #E9F7EE;
    --alert-success-200: #BCF6D2;
    --alert-success-300: #88EDB1;
    --alert-success-400: #4DDB87;
    --alert-success-500: #25C265;
    --alert-success-600: #1AAA55;
    --alert-success-700: #177E41;
    --alert-success-800: #176437;
    --alert-success-900: #0B4322;
    --alert-success-950: #062D18;
    --warning: #D2AE4A;
    --warning-50: #FFFAEA;
    --warning-100: #FFFAE6;
    --warning-200: #FFE287;
    --warning-300: #FFCE48;
    --warning-400: #FFB81E;
    --warning-500: #FC9403;
    --warning-600: #DF6D00;
    --warning-700: #B94A04;
    --warning-800: #96390A;
    --warning-900: #4B3009;
    --warning-950: #471601;
    --info: #1F5FAC;
    --info-50: #F1F7FE;
    --info-100: #E9F2FB;
    --info-200: #BFD9F8;
    --info-300: #87BBF2;
    --info-400: #4899E8;
    --info-500: #1F78D1;
    --info-600: #1260B7;
    --info-700: #104C94;
    --info-800: #11427B;
    --info-900: #0B2E50;
    --info-950: #0D2444;
    --error: #D66161;
    --error-50: #FEF4F2;
    --error-100: #FCECE9;
    --error-200: #FFD1C9;
    --error-300: #FDB0A4;
    --error-400: #F98370;
    --error-500: #F15A42;
    --error-600: #DB3B21;
    --error-700: #BB311A;
    --error-800: #9A2C1A;
    --error-900: #691B10;
    --error-950: #461209;
    --fonte-primaria: Montserrat;
}
html {
  line-height: 1.15; 
  -webkit-text-size-adjust: 100%;
  font-family: var(--fonte-primaria);
}
body {
  margin: 0;
  min-height: 100vh;
}
main {
  display: block;
}
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}
hr {
  box-sizing: content-box; 
  height: 0; 
  overflow: visible; 
}
a {
  background-color: transparent;
  text-decoration: none; 
}
abbr[title] {
  border-bottom: none; 
  text-decoration: underline; 
  text-decoration: underline dotted; 
}
b,
strong {
  font-weight: bolder;
}
code,
kbd,
samp {
  font-family: monospace, monospace; 
  font-size: 1em; 
}
small {
  font-size: 80%;
}
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
img {
  border-style: none;
}
button,
input,
optgroup,
select,
textarea {
  font-family: inherit; 
  font-size: 100%; 
  line-height: 1.15; 
  margin: 0;
}
button,
input { 
  overflow: visible;
}
button,
select { 
  text-transform: none;
}
button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}
button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}
.button {
  border: none;
  border-radius: 8px;
  background-color: var(--primaria)!important;
  color: var(--styled-white);
  cursor: pointer;
}
.button:hover {
  background-color: var(--secundaria)!important;
}
fieldset {
  padding: 0.35em 0.75em 0.625em;
}
legend {
  box-sizing: border-box; 
  color: inherit; 
  display: table; 
  max-width: 100%; 
  padding: 0; 
  white-space: normal; 
}
progress {
  vertical-align: baseline;
}
textarea {
  overflow: auto;
}
[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; 
  padding: 0; 
}
[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}
[type="search"] {
  -webkit-appearance: textfield; 
  outline-offset: -2px; 
}
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-file-upload-button {
  -webkit-appearance: button; 
  font: inherit; 
}
details {
  display: block;
}
summary {
  display: list-item;
}
template {
  display: none;
}
[hidden] {
  display: none;
}
`

export default EstilosGlobais