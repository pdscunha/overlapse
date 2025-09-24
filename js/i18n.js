(function(window, document) {
  'use strict';

  var FALLBACK_LOCALE = 'en';

  var translations = {
    en: {
      logo: {
        title: 'Overlapse Home'
      },
      nav: {
        about: 'About',
        map: 'Map'
      },
      social: {
        facebook: 'Open Facebook page',
        instagram: 'Open Instagram page',
        twitter: 'Open Twitter page'
      },
      share: {
        label: 'Share'
      },
      follow: {
        us: 'Follow Us'
      },
      footer: {
        copyright: '© 2019 Overlapse'
      },
      year: {
        connector: '&'
      },
      locations: {
        praia: {
          years: '1974 & 2014',
          description: 'View from the Barra Lighthouse. The Barra bridge is captured mid-construction.'
        },
        aveiro: {
          years: '1962 & 2020',
          description: 'Traditional moliceiro boats share the waterway with new pedestrian routes and riverside cafes.'
        },
        rossio: {
          years: '1955 & 2018',
          description: 'A civic plaza that evolves from market stalls to a flexible public space for events and gatherings.'
        }
      },
      map: {
        fallback: {
          note: 'Connect to the internet to unlock the interactive OpenStreetMap view. This static preview shows the featured locations.'
        }
      },
      about: {
        hero: {
          title: 'About Overlapse',
          lead: 'Overlapse pairs archival photography with contemporary views to show how human decisions reshape our shared spaces. We invite residents, visitors, and planners to see the slow-motion story of our city unfold.'
        },
        mission: {
          title: 'Our Mission',
          body1: 'We believe that cities are living archives. Streets, riverfronts, and neighbourhood blocks are always evolving, yet their transformations are rarely visible in the moment. Overlapse exists to surface those hidden chapters and make the urban past tangible.',
          body2: 'By presenting carefully matched before-and-after images, amplified with local context, we encourage thoughtful conversations about preservation, progress, and the people at the centre of both.'
        },
        story: {
          title: 'How We Build Each Story',
          step1: 'We collaborate with museums, libraries, and community historians to digitise and catalogue photographs that capture pivotal moments in the region.',
          step2: 'We revisit each site to recreate the perspective with present-day photography, respecting composition while embracing today\'s character.',
          step3: 'We pair the images in the Overlapse viewer, layering timelines, memories, and local voices to illuminate how the city has changed and what might come next.'
        },
        quote: '"Overlapse helps us see that every skyline starts as a sketch, every plaza as a shared ambition. When you slide between moments, you witness the choices that build a city."',
        discover: {
          title: 'What You\'ll Discover',
          card1: {
            title: 'Urban Awareness',
            body: 'Trace the impact of planning decisions, infrastructure projects, and community advocacy across decades.'
          },
          card2: {
            title: 'Local Memory',
            body: 'Follow stories from long-time residents and neighbourhood historians who lend context to every photograph.'
          },
          card3: {
            title: 'Future Insight',
            body: 'Use the past to spark new ideas for climate resilience, housing, mobility, and the public realm.'
          }
        },
        team: {
          title: 'Who\'s Behind Overlapse?',
          body1: 'Overlapse is led by a collective of photographers, urbanists, designers, and civic storytellers. We work with municipal archives, universities, and community groups to surface narratives that are inclusive and representative.',
          body2: 'Every new chapter begins with a listening session, gathering memories on porches, in libraries, and at local meetups to ensure the project reflects lived experience.'
        },
        cta: {
          title: 'Join The Next Chapter',
          body: 'Have a story, photograph, or neighbourhood you\'d like to see featured? Share it with us and help expand the collective record of our city.',
          cta: 'Share Your Story'
        }
      }
    },
    pt: {
      logo: {
        title: 'Página inicial do Overlapse'
      },
      nav: {
        about: 'Sobre',
        map: 'Mapa'
      },
      social: {
        facebook: 'Abrir página do Facebook',
        instagram: 'Abrir página do Instagram',
        twitter: 'Abrir página do Twitter'
      },
      share: {
        label: 'Partilhar'
      },
      follow: {
        us: 'Segue-nos'
      },
      footer: {
        copyright: '© 2019 Overlapse'
      },
      year: {
        connector: 'e'
      },
      locations: {
        praia: {
          years: '1974 e 2014',
          description: 'Vista do Farol da Barra. A ponte da Barra pode ser vista em construção.'
        },
        aveiro: {
          years: '1962 e 2020',
          description: 'Os tradicionais moliceiros partilham o canal com novas rotas pedonais e cafés ribeirinhos.'
        },
        rossio: {
          years: '1955 e 2018',
          description: 'Uma praça cívica que evolui de mercado a espaço público flexível para eventos e encontros.'
        }
      },
      map: {
        fallback: {
          note: 'Liga-te à internet para desbloquear o mapa interativo do OpenStreetMap. Esta pré-visualização estática apresenta os locais em destaque.'
        }
      },
      about: {
        hero: {
          title: 'Sobre o Overlapse',
          lead: 'O Overlapse combina fotografia de arquivo com vistas contemporâneas para mostrar como as decisões humanas remodelam os nossos espaços partilhados. Convidamos residentes, visitantes e planeadores a ver a história da nossa cidade em câmara lenta.'
        },
        mission: {
          title: 'A nossa missão',
          body1: 'Acreditamos que as cidades são arquivos vivos. Ruas, frentes ribeirinhas e quarteirões estão sempre a evoluir, mas essas transformações raramente são visíveis no momento. O Overlapse existe para trazer à superfície esses capítulos escondidos e tornar o passado urbano tangível.',
          body2: 'Ao apresentar imagens de antes e depois cuidadosamente alinhadas, enriquecidas com contexto local, incentivamos conversas informadas sobre preservação, progresso e as pessoas que estão no centro de ambos.'
        },
        story: {
          title: 'Como construímos cada história',
          step1: 'Colaboramos com museus, bibliotecas e historiadores comunitários para digitalizar e catalogar fotografias que captam momentos decisivos da região.',
          step2: 'Revisitamos cada local para recriar a perspetiva com fotografia atual, respeitando a composição enquanto abraçamos o carácter de hoje.',
          step3: 'Juntamos as imagens no visualizador Overlapse, sobrepondo cronologias, memórias e vozes locais para revelar como a cidade mudou e o que pode vir a seguir.'
        },
        quote: '"O Overlapse mostra-nos que cada linha do horizonte começa com um esboço e cada praça com uma ambição partilhada. Ao deslizar entre momentos, testemunhas as escolhas que constroem uma cidade."',
        discover: {
          title: 'O que vais descobrir',
          card1: {
            title: 'Consciência urbana',
            body: 'Acompanha o impacto de decisões de planeamento, projetos de infraestrutura e defesa comunitária ao longo de décadas.'
          },
          card2: {
            title: 'Memória local',
            body: 'Segue histórias de residentes de longa data e historiadores de bairro que dão contexto a cada fotografia.'
          },
          card3: {
            title: 'Visão para o futuro',
            body: 'Usa o passado para inspirar novas ideias sobre resiliência climática, habitação, mobilidade e espaço público.'
          }
        },
        team: {
          title: 'Quem está por trás do Overlapse?',
          body1: 'O Overlapse é conduzido por uma equipa de fotógrafos, urbanistas, designers e contadores de histórias cívicas. Trabalhamos com arquivos municipais, universidades e grupos comunitários para revelar narrativas inclusivas e representativas.',
          body2: 'Cada novo capítulo começa com uma sessão de escuta, recolhendo memórias em varandas, bibliotecas e encontros locais para garantir que o projeto reflete a experiência vivida.'
        },
        cta: {
          title: 'Junta-te ao próximo capítulo',
          body: 'Tens uma história, fotografia ou bairro que gostarias de ver em destaque? Partilha connosco e ajuda a expandir o registo coletivo da nossa cidade.',
          cta: 'Partilha a tua história'
        }
      }
    }
  };

  function getNestedValue(locale, key) {
    var source = translations[locale];
    if (!source) {
      return undefined;
    }

    return key.split('.').reduce(function(accumulator, segment) {
      if (accumulator && Object.prototype.hasOwnProperty.call(accumulator, segment)) {
        return accumulator[segment];
      }
      return undefined;
    }, source);
  }

  function detectLocale() {
    if (typeof window === 'undefined') {
      return FALLBACK_LOCALE;
    }

    var navigatorObject = window.navigator || {};
    var browserLanguages = navigatorObject.languages || [];

    for (var i = 0; i < browserLanguages.length; i++) {
      var lang = (browserLanguages[i] || '').toLowerCase();
      if (lang.indexOf('pt') === 0) {
        return 'pt';
      }
    }

    var primaryLanguage = (navigatorObject.language || navigatorObject.userLanguage || '').toLowerCase();
    if (primaryLanguage.indexOf('pt') === 0) {
      return 'pt';
    }

    return FALLBACK_LOCALE;
  }

  function translateKey(key, locale, fallbackValue) {
    if (!key) {
      return fallbackValue;
    }

    var value = getNestedValue(locale, key);
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      return value;
    }

    if (value && typeof value === 'object') {
      return value;
    }

    return fallbackValue;
  }

  var api = {
    locale: detectLocale(),
    fallback: FALLBACK_LOCALE,
    translations: translations,
    detectLocale: detectLocale,
    t: function(key, fallbackValue, overrideLocale) {
      var activeLocale = overrideLocale || api.locale;
      var localizedValue = translateKey(key, activeLocale, undefined);
      if (localizedValue !== undefined) {
        return localizedValue;
      }
      var fallback = translateKey(key, api.fallback, undefined);
      if (fallback !== undefined) {
        return fallback;
      }
      return fallbackValue;
    },
    setLocale: function(newLocale) {
      if (!translations[newLocale]) {
        newLocale = FALLBACK_LOCALE;
      }
      api.locale = newLocale;
      applyTranslations();
      return api.locale;
    }
  };

  function applyTranslations() {
    document.documentElement.setAttribute('lang', api.locale);

    var textNodes = document.querySelectorAll('[data-i18n]');
    textNodes.forEach(function(node) {
      var key = node.getAttribute('data-i18n');
      var translation = api.t(key);
      if (translation === undefined || translation === null) {
        return;
      }
      if (typeof translation === 'string') {
        if (node.hasAttribute('data-i18n-html')) {
          node.innerHTML = translation;
        } else {
          node.textContent = translation;
        }
      }
    });

    var attrNodes = document.querySelectorAll('[data-i18n-attrs]');
    attrNodes.forEach(function(node) {
      var attrs = node.getAttribute('data-i18n-attrs');
      if (!attrs) {
        return;
      }
      attrs.split(',').forEach(function(attrName) {
        var trimmed = attrName.trim();
        if (!trimmed) {
          return;
        }
        var key = node.getAttribute('data-i18n-' + trimmed);
        var translation = api.t(key);
        if (translation === undefined || translation === null) {
          return;
        }
        node.setAttribute(trimmed, translation);
      });
    });

    if (typeof window.CustomEvent === 'function') {
      var event = new CustomEvent('overlapse:localeApplied', {
        detail: { locale: api.locale }
      });
      document.dispatchEvent(event);
    }
  }

  window.OverlapseI18n = api;

  document.addEventListener('DOMContentLoaded', function() {
    applyTranslations();
  });
})(window, document);
