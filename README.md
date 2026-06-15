# Panigale 90 — Sito web

Sito statico (HTML/CSS/JS, nessuna dipendenza) generato a partire dall'annuncio Airbnb
[Panigale 90](https://www.airbnb.com/rooms/994075475181136624).

## Struttura
```
panigale90-site/
├── index.html            # la pagina
├── css/style.css         # stile
├── js/availability.js    # ← DATE OCCUPATE + email (lo modifichi tu)
├── js/main.js            # logica (galleria, calendario, form)
├── assets/img/           # 10 foto scaricate dall'annuncio
└── README.md
```

## Provarlo in locale
Apri `index.html` con doppio clic, **oppure** (consigliato, per far funzionare le foto e la mappa):
```bash
cd panigale90-site
python3 -m http.server 8080
# poi apri http://localhost:8080
```

## Aggiornare le foto
Sostituisci i file in `assets/img/` (mantieni gli stessi nomi `photo-01.jpg … photo-10.jpg`)
oppure modifica l'elenco `PHOTOS` all'inizio di `js/main.js` per cambiarne ordine e didascalie.

## Aggiornare la disponibilità (calendario)
Apri `js/availability.js` e modifica l'elenco `booked` con i tuoi periodi occupati:
```js
booked: [
  { from: "2026-07-01", to: "2026-07-05" },  // dal 1 al 5 luglio occupato
]
```
Le date risultano "occupate" e non selezionabili sul calendario del sito.

### Sincronizzazione automatica con Airbnb (opzionale)
Airbnb esporta un calendario in formato **iCal (.ics)**:
*Airbnb → Calendario → Disponibilità → Esporta/Connetti calendario*.
Il browser non può leggere quel link direttamente (Airbnb blocca le richieste cross-origin),
quindi serve un piccolo proxy lato server. Due strade semplici:
1. **GitHub Actions / cron**: uno script che scarica l'`.ics`, lo converte nell'elenco
   `booked` e riscrive `js/availability.js` una volta al giorno.
2. **Funzione serverless** (Netlify/Cloudflare): un endpoint che fa da proxy all'`.ics`;
   poi imposta `icalFeedUrl` in `availability.js`.
Posso predisporre una delle due se vuoi la sincronizzazione automatica.

## Richieste di prenotazione
Il form invia una email precompilata (via `mailto:`) all'indirizzo impostato in
`contactEmail` dentro `js/availability.js`. C'è anche il pulsante **"Prenota su Airbnb"**.

## Pubblicazione
Essendo un sito statico, puoi pubblicarlo gratis su **Netlify**, **GitHub Pages**,
**Cloudflare Pages** o qualsiasi hosting: basta caricare la cartella.
