/* ============================================================
   BAT — simple content settings (no coding needed)
   ------------------------------------------------------------
   VIDEOS  Paste the YouTube video ID (the part after "v=" in the
           link). The first one is the featured video. "title" is
           optional: if left empty, the site reads it from YouTube.
   COVERS  Optional artwork for the placeholders. Drop an image in
           assets/img/ and write its path here, for example:
           bandcamp: "assets/img/bandcamp-cover.jpg"
   Tour dates are NOT edited here: use /admin (see README).
   ============================================================ */
window.BAT_CONFIG = {
  videos: [
    { id: "JyQn6Htt4Pc", title: "Revenge Of The Wolf" },
    { id: "5umWT1-hDdE", title: "Horror Vision" },
    { id: "rl2I_87n5CY", title: "Streetbanger" },
    { id: "r9XsmFB8W08", title: "Rite For Exorcism" },
    { id: "pc-QqvQGRwY", title: "Beware of the BAT" }
  ],
  covers: {
    bandcamp: "",       // square album artwork (Music section)
    bandcampMerch: "",  // Bandcamp merch photo (Merch section)
    visionMerch: ""     // Vision Merch shirt photo (Merch section)
  }
};
