/**
 * Custom high-performance shim for GSAP's premium SplitText utility.
 * Mimics DOM character and word separation to allow bulletproof staggered text animations.
 */
export class SplitText {
  elements: HTMLElement[] = [];
  words: HTMLElement[] = [];
  chars: HTMLElement[] = [];
  lines: HTMLElement[] = [];
  originalHTML: string = '';
  private originalContentMap = new Map<HTMLElement, string>();

  constructor(
    target: HTMLElement | HTMLElement[] | string,
    vars: {
      type?: string;
      charsClass?: string;
      wordsClass?: string;
      linesClass?: string;
    } = {}
  ) {
    let els: HTMLElement[] = [];
    if (typeof target === 'string') {
      els = Array.from(document.querySelectorAll(target));
    } else if (Array.isArray(target)) {
      els = target;
    } else if (target instanceof HTMLElement) {
      els = [target];
    } else if (target && (target as any).current instanceof HTMLElement) {
      // Handle React Refs
      els = [(target as any).current];
    }

    this.elements = els;
    const type = vars.type || 'words,chars';
    const splitWords = type.includes('words');
    const splitChars = type.includes('chars');

    els.forEach((el) => {
      // Save original HTML for cleanup / reverting
      this.originalContentMap.set(el, el.innerHTML);

      const text = el.innerText || '';
      el.innerHTML = ''; // reset view inside element

      // Split into words, preserving spaces
      const tokenArray = text.split(/(\s+)/);
      tokenArray.forEach((token) => {
        if (!token) return;

        // If it is whitespace, append as text node so layout spacing remains authentic
        if (/^\s+$/.test(token)) {
          el.appendChild(document.createTextNode(token));
          return;
        }

        if (splitWords) {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          if (vars.wordsClass) {
            wordSpan.className = vars.wordsClass;
          }
          this.words.push(wordSpan);

          if (splitChars) {
            const letters = token.split('');
            letters.forEach((letter) => {
              const charSpan = document.createElement('span');
              charSpan.style.display = 'inline-block';
              charSpan.innerText = letter;
              if (vars.charsClass) {
                charSpan.className = vars.charsClass;
              }
              wordSpan.appendChild(charSpan);
              this.chars.push(charSpan);
            });
          } else {
            wordSpan.innerText = token;
          }

          el.appendChild(wordSpan);
        } else if (splitChars) {
          const letters = token.split('');
          letters.forEach((letter) => {
            const charSpan = document.createElement('span');
            charSpan.style.display = 'inline-block';
            charSpan.innerText = letter;
            if (vars.charsClass) {
              charSpan.className = vars.charsClass;
            }
            el.appendChild(charSpan);
            this.chars.push(charSpan);
          });
        } else {
          el.appendChild(document.createTextNode(token));
        }
      });
    });

    // Alias lines to elements if requested
    this.lines = this.elements;
  }

  revert() {
    this.elements.forEach((el) => {
      const original = this.originalContentMap.get(el);
      if (original !== undefined) {
        el.innerHTML = original;
      }
    });
  }
}
