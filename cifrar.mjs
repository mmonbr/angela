/**
 * Cifra pagina.html con una contraseña y genera index.html (pantalla de
 * acceso + contenido cifrado con AES-256-GCM, clave derivada con PBKDF2).
 *
 * Uso:  node cifrar.mjs "mi-contraseña"
 */
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto } from "node:crypto";

const pass = process.argv[2];
if (!pass) {
  console.error('Uso: node cifrar.mjs "contraseña"');
  process.exit(1);
}

const ITERACIONES = 310000;
const html = readFileSync(new URL("./pagina.html", import.meta.url), "utf8");
const enc = new TextEncoder();
const salt = webcrypto.getRandomValues(new Uint8Array(16));
const iv = webcrypto.getRandomValues(new Uint8Array(12));

const material = await webcrypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
const clave = await webcrypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: ITERACIONES, hash: "SHA-256" },
  material,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"]
);
const cifrado = new Uint8Array(await webcrypto.subtle.encrypt({ name: "AES-GCM", iv }, clave, enc.encode(html)));

const b64 = (u8) => Buffer.from(u8).toString("base64");

const plantilla = String.raw`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#16091f">
<title>¡Feliz cumpleaños, Ángela! 🎂</title>
<meta name="description" content="Una sorpresa para alguien muy especial.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎂</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Shrikhand&family=Outfit:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root {
    --noche: #16091f;
    --terciopelo: #261335;
    --oro: #f2c14e;
    --oro-claro: #ffdf8e;
    --oro-oscuro: #b98a24;
    --crema: #fdf3e3;
    --crema-suave: #d9c9ce;
    --fucsia: #ff4f9a;
    --error: #ff6b6b;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: var(--noche);
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255, 79, 154, .14), transparent 60%),
      radial-gradient(ellipse 70% 45% at 50% 110%, rgba(242, 193, 78, .10), transparent 60%);
    color: var(--crema);
    font-family: "Outfit", system-ui, sans-serif;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 20px calc(24px + env(safe-area-inset-bottom));
  }
  .puerta {
    width: 100%;
    max-width: 430px;
    background: linear-gradient(180deg, #2b1740, #1d0e2c);
    border: 3px solid var(--oro);
    border-radius: 14px;
    box-shadow:
      0 0 0 3px #1d0e2c,
      0 0 0 4px rgba(242,193,78,.5),
      0 10px 50px rgba(242, 193, 78, .18),
      inset 0 0 40px rgba(0,0,0,.5);
    padding: 30px 26px 32px;
    text-align: center;
    animation: aparecer .55s cubic-bezier(.22,.9,.3,1) both;
  }
  @keyframes aparecer {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .eyebrow {
    font-family: "Space Mono", monospace;
    font-size: .72rem;
    letter-spacing: .24em;
    text-transform: uppercase;
    color: var(--fucsia);
    margin-bottom: 14px;
  }
  h1 {
    font-family: "Shrikhand", cursive;
    font-weight: 400;
    font-size: 2.4rem;
    color: var(--oro);
    text-shadow: 0 2px 0 var(--oro-oscuro), 0 4px 0 #8a6317, 0 7px 18px rgba(0,0,0,.6);
    margin-bottom: 14px;
  }
  .texto {
    color: var(--crema-suave);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 24px;
  }
  form { display: flex; flex-direction: column; gap: 14px; }
  input {
    font-family: "Space Mono", monospace;
    font-size: 1.05rem;
    text-align: center;
    letter-spacing: .1em;
    color: var(--crema);
    background: rgba(0,0,0,.35);
    border: 2px solid rgba(253,243,227,.2);
    border-radius: 12px;
    padding: 14px 16px;
    outline: none;
    transition: border-color .2s ease;
  }
  input:focus { border-color: var(--oro); }
  button {
    font-family: "Outfit", sans-serif;
    font-weight: 700;
    font-size: 1.05rem;
    color: #2b1503;
    background: linear-gradient(180deg, var(--oro-claro), var(--oro) 55%, #e0a832);
    border: none;
    border-radius: 999px;
    padding: 14px 32px;
    cursor: pointer;
    box-shadow: 0 4px 0 var(--oro-oscuro), 0 12px 30px rgba(242, 193, 78, .25);
    transition: transform .15s ease, box-shadow .15s ease, opacity .2s ease;
  }
  button:hover { transform: translateY(-2px); }
  button:active { transform: translateY(2px); box-shadow: 0 2px 0 var(--oro-oscuro); }
  button:disabled { opacity: .6; cursor: wait; }
  button:focus-visible, input:focus-visible { outline: 3px solid var(--fucsia); outline-offset: 3px; }
  .aviso {
    min-height: 24px;
    margin-top: 16px;
    font-weight: 600;
    font-size: .95rem;
    color: var(--error);
  }
  .puerta.tiembla { animation: temblor .4s ease; }
  @keyframes temblor {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(7px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(3px); }
  }
  footer {
    font-family: "Space Mono", monospace;
    font-size: .68rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(217,201,206,.45);
    margin-top: 28px;
    text-align: center;
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
</style>
</head>
<body>

<div class="puerta" id="puerta">
  <p class="eyebrow">Función privada</p>
  <h1>Backstage</h1>
  <p class="texto">Esta página es una sorpresa para alguien muy especial.<br>
    Si eres tú… ya sabes la contraseña. 😉</p>
  <form id="formulario">
    <input type="password" id="clave" autocomplete="off" placeholder="Contraseña" aria-label="Contraseña" autofocus>
    <button type="submit" id="entrar">Entrar 🎟️</button>
  </form>
  <p class="aviso" id="aviso" role="status"></p>
</div>

<footer>angelamontenegro.com</footer>

<script>
(function () {
  "use strict";

  var DATOS = {
    salt: "%%SALT%%",
    iv: "%%IV%%",
    ct: "%%CT%%"
  };
  var ITERACIONES = %%ITER%%;

  var puerta = document.getElementById("puerta");
  var aviso = document.getElementById("aviso");
  var boton = document.getElementById("entrar");
  var campo = document.getElementById("clave");

  function b64a(s) {
    var b = atob(s);
    var u = new Uint8Array(b.length);
    for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
    return u;
  }

  function fallo(msg) {
    aviso.textContent = msg;
    puerta.classList.remove("tiembla");
    void puerta.offsetWidth;
    puerta.classList.add("tiembla");
    boton.disabled = false;
    campo.select();
  }

  document.getElementById("formulario").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var pass = campo.value.trim();
    if (!pass) return;

    if (!window.crypto || !window.crypto.subtle) {
      fallo("Abre la página con https para poder entrar.");
      return;
    }

    boton.disabled = true;
    aviso.textContent = "";
    var enc = new TextEncoder();

    crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"])
      .then(function (material) {
        return crypto.subtle.deriveKey(
          { name: "PBKDF2", salt: b64a(DATOS.salt), iterations: ITERACIONES, hash: "SHA-256" },
          material,
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        );
      })
      .then(function (clave) {
        return crypto.subtle.decrypt({ name: "AES-GCM", iv: b64a(DATOS.iv) }, clave, b64a(DATOS.ct));
      })
      .then(function (claro) {
        var html = new TextDecoder().decode(claro);
        document.open();
        document.write(html);
        document.close();
      })
      .catch(function () {
        fallo("Mmm… esa no es. Prueba otra vez. 🤔");
      });
  });

  document.body.dataset.lista = "1";
})();
</script>
</body>
</html>
`;

const salida = plantilla
  .replace("%%SALT%%", b64(salt))
  .replace("%%IV%%", b64(iv))
  .replace("%%CT%%", b64(cifrado))
  .replace("%%ITER%%", String(ITERACIONES));

writeFileSync(new URL("./index.html", import.meta.url), salida);
console.log("index.html generado (" + cifrado.length + " bytes cifrados).");
