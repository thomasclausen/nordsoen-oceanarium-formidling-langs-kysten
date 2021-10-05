(() => {
  // 'use strict';

  /*
   * Get proper browser prefix for events such as 'TransitionEnd' or 'AminationEnd'
   * @param  {Node}      element   Element to attach the event
   * @param  {String}    type      The event you want a prefix for
   * @param  {Function}  callback  The callback with the correct prefix
   */
  const setPrefixedEvent = (element, type, callback) => {
    const prefixes = ['webkit', 'moz', 'MS', 'o', ''];

    for (let p = 0, pl = prefixes.length; p < pl; p++) {
      if (!prefixes[p]) {
        type = type.toLowerCase();
      }
      element.addEventListener(prefixes[p] + type, callback, false);
    }
  };

  // Idle
  let idleTime = 0;
  let missedClicks = 0;
  const siteWrapper = document.body.querySelector('.site-wrapper');
  const idleTarget = parseInt(siteWrapper.getAttribute('data-idle-timeout')) || 60; // seconds
  const missedTarget = parseInt(siteWrapper.getAttribute('data-missed-clicks')) || 3; // number of clicks

  const preventTimer = (event) => {
    if (document.body.classList.contains('js-miss')) {
      missedClicks = 0;
    } else {
      if (event.target === siteWrapper) {
        missedClicks++;
      } else {
        missedClicks = 0;
      }
    }

    if (document.body.classList.contains('js-idle')) {
      // We got a overlay - reset timer
      idleTime = 0;
      document.body.classList.remove('js-idle');
      missedClicks = 0;
    }

    if (missedClicks >= missedTarget) {
      document.body.classList.add('js-miss');
    } else {
      document.body.classList.remove('js-miss');
    }
  };

  setInterval(() => {
    idleTime += 1000;

    if (document.body.classList.contains('js-miss')) {
      // We got a overlay - pause timer
      idleTime = 0;
    }

    if (document.body.classList.contains('js-modal-open')) {
      if (idleTime > ((idleTarget * 1000) * 2)) {
        document.body.classList.remove('js-modal-open');

        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
          // Reset modal
          gallery(modal.querySelector('.gallery'), 'reset');
          // Reset tabs
          tabsReset();
        });

        document.body.classList.add('js-idle');
      } else {
        document.body.classList.remove('js-idle');
      }
    } else {
      if (idleTime > (idleTarget * 1000)) {
        document.body.classList.add('js-idle');
      } else {
        document.body.classList.remove('js-idle');
      }
    }
  }, 1000);

  document.addEventListener('click', preventTimer);

  // Modal + Overlay
  const modalOpen = (event) => {
    event.preventDefault();

    const element = event.target;
    const modals = document.querySelectorAll('.modal');
    const target = document.getElementById(element.getAttribute('data-target'));

    document.body.classList.add('js-modal-open');

    modals.forEach(modal => {
      if (modal === target) {
        modal.classList.add('js-active');
      } else {
        modal.classList.remove('js-active');
      }
    });
  };

  const modalButtonOpen = document.querySelectorAll('[data-action="modal-open"]');
  modalButtonOpen.forEach(element => {
    element.addEventListener('click', modalOpen);
  });

  const modalClose = (event) => {
    event.preventDefault();

    document.body.classList.remove('js-modal-open');

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.classList.remove('js-active');

      // Reset modal
      gallery(modal.querySelector('.gallery'), 'reset');
      // Reset tabs
      tabsReset();
    });
  };

  const modalButtonClose = document.querySelectorAll('[data-action="modal-close"]');
  modalButtonClose.forEach(element => {
    element.addEventListener('click', modalClose);
  });

  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {

      document.body.classList.remove('js-modal-open');

      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        // Reset modal
        gallery(modal.querySelector('.gallery'), 'reset');
        // Reset tabs
        tabsReset();
      });
    });
  }

  // Gallery
  const gallery = (element, state) => {
    const gallery = element;
    let showing = 'image';
    let source = '';

    if (gallery) {
      const media = gallery.querySelector('.gallery-media');
      const thumbnails = gallery.querySelectorAll('.gallery-thumbnail');

      if (thumbnails.length > 1) {
        const load = () => {
          gallery.classList.remove('js-loading');
        };

        const change = (event) => {
          const element = event.target;

          source = element.getAttribute('data-source');
          if (showing !== element.getAttribute('data-type')) {
            showing = element.getAttribute('data-type');
          }

          gallery.classList.add('js-loading');

          thumbnails.forEach(thumbnail => {
            if (thumbnail === element) {
              thumbnail.classList.add('js-active');
            } else {
              thumbnail.classList.remove('js-active');
            }
          });
        };

        if (state === 'reset') {
          source = thumbnails[0].getAttribute('data-source');
          showing = thumbnails[0].getAttribute('data-type');

          gallery.classList.add('js-reset');

          thumbnails.forEach(thumbnail => {
            if (thumbnail === thumbnails[0]) {
              thumbnail.classList.add('js-active');
            } else {
              thumbnail.classList.remove('js-active');
            }
          });

          setTimeout(() => {
            gallery.classList.remove('js-reset');
          }, 600);
        }

        media.querySelector('.image img').addEventListener('load', load);
        media.querySelector('.video video').addEventListener('loadeddata', load);

        media.querySelector('.video video').addEventListener('ended', () => {
          media.querySelector('.video video').classList.remove('js-playing');
        });
        media.querySelector('.video video').addEventListener('click', () => {
          media.querySelector('.video video').pause();
          media.querySelector('.video video').classList.remove('js-playing');
        });
        media.querySelector('.video [data-action=video-play]').addEventListener('click', () => {
          media.querySelector('.video video').play();
          media.querySelector('.video video').classList.add('js-playing');
        });

        setPrefixedEvent(media, 'TransitionEnd', () => {
          if (gallery.classList.contains('js-loading') || gallery.classList.contains('js-reset')) {
            media.setAttribute('data-type', showing);
            media.querySelector('.' + showing).firstElementChild.src = source;
          }
        });

        thumbnails.forEach(thumbnail => {
          thumbnail.addEventListener('click', change);
        });
        thumbnails[0].classList.add('js-active');
      }
    }
  };

  const galleries = document.querySelectorAll('.gallery');
  galleries.forEach(element => {
    gallery(element, 'initialize');
  });

  // Tabs
  const tabOpen = (event) => {
    event.preventDefault();

    const element = event.target;
    const tabs = element.closest('.tabs');
    const target = document.getElementById(element.getAttribute('data-target'));

    // Buttons
    tabs.querySelectorAll('.tab-button').forEach(button => {
      if (button === element) {
        button.classList.add('js-active');
      } else {
        button.classList.remove('js-active');
      }
    });

    // Content
    tabs.querySelectorAll('.tab-content').forEach(content => {
      if (content === target) {
        content.classList.add('js-active');
      } else {
        content.classList.remove('js-active');
      }
    });
  };

  const tabButtonOpen = document.querySelectorAll('[data-action="tab-open"]');
  tabButtonOpen.forEach(element => {
    element.addEventListener('click', tabOpen);
  });

  const tabsReset = () => {
    const tabs = document.querySelectorAll('.tabs');

    setTimeout(() => {
      tabs.forEach(tab => {
        if (tab.querySelectorAll('.tab-button').length > 1) {
          // Buttons
          tab.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('js-active');
          });

          tab.querySelectorAll('.tab-button')[0].classList.add('js-active');

          // Content
          tab.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('js-active');
            content.scrollTop = 0;
          });

          tab.querySelectorAll('.tab-content')[0].classList.add('js-active');
        }
      });
    }, 300);
  };
})();
