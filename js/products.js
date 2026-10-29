/* ==========================================================================
   Aura Creations — catalogue data and site imagery

   DEMONSTRATION CONTENT
   ---------------------
   Every product below is a SAMPLE created for this website concept.
   The photographs are free-to-use images from Unsplash (Unsplash License),
   chosen to suggest the boutique's style. They are NOT Aura Creations
   products, and nothing here represents real stock, prices or sizes.

   Replacing a sample with a real piece:
   - image:          a path such as 'assets/images/products/rose-suit.jpg'
                     or a full https:// URL
   - secondaryImage: a second photo of the SAME piece, or null
   - description:    the boutique's own words, or null to hide it
   - price:          a number such as 2450 (shown as ₹2,450), or null to hide
   - availableSizes: e.g. ['S', 'M', 'L', 'XL'], or null to hide the selector
   - isNewArrival:   true only if the boutique marks it as new
   - isSample:       remove (or set false) once the piece is real
   ========================================================================== */
(function () {
  'use strict';

  window.AURA = window.AURA || {};

  /* Collections shown as large cards and as catalogue filters.
     "new" is a special filter that shows products with isNewArrival: true. */
  window.AURA.categories = [
    {
      id: 'ethnic',
      label: 'Ethnic Wear',
      blurb: 'Suits, festive wear and everyday classics',
      image: 'https://images.unsplash.com/photo-1759840278381-bf7d5e332050',
      imageAlt: 'A woman in a red kurta with a floral scarf'
    },
    {
      id: 'indo-western',
      label: 'Indo-Western',
      blurb: 'Co-ord sets, fusion silhouettes and party wear',
      image: 'https://images.unsplash.com/photo-1763336016192-c7b62602e993',
      imageAlt: 'A woman in an elegant dress seated on a sofa'
    },
    {
      id: 'new',
      label: 'New Arrivals',
      blurb: 'The latest pieces to reach the boutique',
      image: 'https://images.unsplash.com/photo-1780504863283-3157e6d141e1',
      imageAlt: 'A woman in a pink traditional outfit walking with a white bag'
    }
  ];

  window.AURA.products = [
    {
      id: 'sample-01',
      name: 'Red festive ensemble',
      category: 'ethnic',
      image: 'https://images.unsplash.com/photo-1759840278862-ef629e9b0f64',
      imageAlt: 'A woman in red traditional attire holding a handbag',
      secondaryImage: null,
      description: null,
      price: null,
      availableSizes: null,
      isNewArrival: true,
      isSample: true
    },
    {
      id: 'sample-02',
      name: 'Blue and gold fusion look',
      category: 'indo-western',
      image: 'https://images.unsplash.com/photo-1610202631408-fa6ba0f39ca3',
      imageAlt: 'A woman in a blue and gold floral sleeveless outfit',
      secondaryImage: null,
      description: null,
      price: null,
      availableSizes: null,
      isNewArrival: false,
      isSample: true
    },
    {
      id: 'sample-03',
      name: 'Rose floral suit',
      category: 'ethnic',
      image: 'https://images.unsplash.com/photo-1610047614222-d33c39abfab2',
      imageAlt: 'A woman in a red and white floral outfit',
      secondaryImage: null,
      description: null,
      price: null,
      availableSizes: null,
      isNewArrival: false,
      isSample: true
    },
    {
      id: 'sample-04',
      name: 'Evening drape dress',
      category: 'indo-western',
      image: 'https://images.unsplash.com/photo-1762740646316-57edde19a0c6',
      imageAlt: 'A woman in an elegant dress seated on a couch',
      secondaryImage: null,
      description: null,
      price: null,
      availableSizes: null,
      isNewArrival: true,
      isSample: true
    },
    {
      id: 'sample-05',
      name: 'Blush everyday suit',
      category: 'ethnic',
      image: 'https://images.unsplash.com/photo-1776436817748-f8e10a7e75b0',
      imageAlt: 'A young woman in a pink outfit sitting outdoors',
      secondaryImage: null,
      description: null,
      price: null,
      availableSizes: null,
      isNewArrival: false,
      isSample: true
    },
    {
      id: 'sample-06',
      name: 'Marigold occasion look',
      category: 'indo-western',
      image: 'https://images.unsplash.com/photo-1615555896813-401d84a0d737',
      imageAlt: 'A woman in a yellow sleeveless outfit wearing a gold necklace',
      secondaryImage: null,
      description: null,
      price: null,
      availableSizes: null,
      isNewArrival: false,
      isSample: true
    },
    {
      id: 'sample-07',
      name: 'Emerald lounge set',
      category: 'ethnic',
      image: 'https://images.unsplash.com/photo-1706943262117-b35de4ba50b4',
      imageAlt: 'A woman in a green outfit seated on a bed',
      secondaryImage: null,
      description: null,
      price: null,
      availableSizes: null,
      isNewArrival: true,
      isSample: true
    },
    {
      id: 'sample-08',
      name: 'Flowing gown',
      category: 'indo-western',
      image: 'https://images.unsplash.com/photo-1763029803944-648ed8638219',
      imageAlt: 'A woman in a long elegant dress seated on a couch',
      secondaryImage: null,
      description: null,
      price: null,
      availableSizes: null,
      isNewArrival: false,
      isSample: true
    }
  ];
})();
