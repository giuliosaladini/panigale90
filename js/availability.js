/* =============================================================
   DISPONIBILITÀ — Panigale 90
   -------------------------------------------------------------
   Qui definisci le date GIÀ OCCUPATE. Sul sito appariranno in
   grigio e non saranno selezionabili.

   Ogni periodo è un oggetto { from: "AAAA-MM-GG", to: "AAAA-MM-GG" }
   - "from"  = primo giorno occupato (incluso)
   - "to"    = ultimo giorno occupato (incluso)

   Esempi qui sotto: cancellali o modificali con le tue date reali.

   👉 Sincronizzazione automatica con Airbnb (opzionale):
   Airbnb fornisce un calendario esportabile in formato iCal (.ics)
   da: Airbnb > Calendario > Disponibilità > "Connetti altri siti
   web" / "Esporta calendario". Copia quel link .ics e incollalo in
   ICAL_FEED_URL qui sotto. Poiché Airbnb blocca le richieste dirette
   dal browser (CORS), serve un piccolo proxy: le istruzioni sono nel
   file README del sito.
   ============================================================= */

window.PANIGALE_AVAILABILITY = {
  // Periodi occupati (modificali tu)
  booked: [
    { from: "2026-06-20", to: "2026-06-24" },
    { from: "2026-07-04", to: "2026-07-09" },
    { from: "2026-08-12", to: "2026-08-18" }
  ],

  // Soggiorno minimo in notti (informativo)
  minNights: 2,

  // Email a cui arrivano le richieste dal form
  contactEmail: "giulio.saladini@alice.it",

  // Opzionale: link iCal esportato da Airbnb (lascia "" per usare solo le date manuali sopra)
  icalFeedUrl: ""
};
