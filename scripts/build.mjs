import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const partials = join(root, 'partials');

function readPartial(relPath) {
  return readFileSync(join(partials, relPath), 'utf8');
}

const html = `<!DOCTYPE html>
<html lang="tr">
${readPartial('head.html')}
<body>
  <div id="scroll-progress" aria-hidden="true"></div>

  <div id="loader" role="status" aria-label="Sayfa yükleniyor">
    <div class="loader-logo">MEKYAZILIM</div>
    <div class="loader-spinner"></div>
  </div>

  <a href="#ana-sayfa" class="skip-link">Ana içeriğe atla</a>

${readPartial('navbar.html')}

  <main>
${readPartial('sections/hero.html')}
${readPartial('sections/stats.html')}
${readPartial('sections/services.html')}
${readPartial('sections/pricing.html')}
${readPartial('sections/about.html')}
${readPartial('sections/testimonials.html')}
${readPartial('sections/faq.html')}
${readPartial('sections/contact.html')}
  </main>

${readPartial('footer.html')}

  <script type="module" src="js/main.js"></script>
</body>
</html>
`;

const outPath = join(root, 'index.html');
writeFileSync(outPath, html, 'utf8');
console.log(`Built ${outPath}`);
