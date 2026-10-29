/* ==========================================================================
   Aura Creations — site configuration
   Everything a non-developer is likely to change lives in this one file.
   ========================================================================== */
(function () {
  'use strict';

  window.AURA = window.AURA || {};

  window.AURA.config = {
    brand: {
      // The logo and Instagram name read "Aura Creation"; the brief uses
      // "Aura Creations". Confirm the preferred spelling with the owners.
      name: 'Aura Creations',
      founders: 'Rashi & Puneeta',
      tagline: 'Where elegance meets comfort'
    },

    // Thin bar above the navigation. Leave empty ('') to hide it.
    announcement: 'Discover your next favourite look.',

    contact: {
      // WhatsApp number in international format: digits only,
      // no "+", spaces or dashes. Shown on the brand's own Instagram post.
      // Set to '' to see the "number not configured" state.
      whatsappNumber: '916391390145',
      // How the number is printed on the page.
      displayPhone: '+91 63913 90145',
      // Show the number as text on the page (it is already public on the
      // brand's Instagram artwork). Set false to show only buttons.
      showPhone: true
    },

    instagram: {
      handle: '@auracreations02',
      url: 'https://www.instagram.com/auracreations02/'
    },

    location: {
      // Landmark wording taken from the brand's own launch post.
      // Confirm with the owners before the site goes public.
      landmark: 'Opposite Lenskart, in front of Krishna Ply, 60 Ft Road',
      area: 'Jankipuram Extension',
      city: 'Lucknow, Uttar Pradesh, India',
      // A plain Google Maps search. Replace with the boutique's verified
      // Google Business link once one exists.
      mapsQuery: 'Opposite Lenskart, Krishna Ply, 60 Feet Road, Jankipuram Extension, Lucknow, Uttar Pradesh'
    },

    // Concept-demo switches. Set isDemo to false only after the owners
    // approve the site and real product information replaces the samples.
    demo: {
      isDemo: true,
      sampleNote: 'Sample imagery for this concept. Real pieces, sizes and details will come from the boutique.',
      conceptNotice: 'Independent website concept by StackShooter — not an official Aura Creations website.'
    },

    // Public URL, once the site has one. Used for the canonical link and
    // Open Graph URL. Leave empty while the site is a concept.
    canonicalUrl: ''
  };
})();
