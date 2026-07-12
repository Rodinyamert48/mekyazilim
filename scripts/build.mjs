import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const partials = join(root, 'partials');
const outDir = join(root, 'public');

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
${readPartial('sections/portfolio.html')}
${readPartial('sections/process.html')}
${readPartial('sections/tech.html')}
${readPartial('sections/pricing.html')}
${readPartial('sections/blog.html')}
${readPartial('sections/about.html')}
${readPartial('sections/faq.html')}
${readPartial('sections/contact.html')}
  </main>

${readPartial('footer.html')}

  <script type="module" src="js/main.js"></script>
</body>
</html>
`;

// Fresh public/ for Vercel outputDirectory
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, 'index.html'), html, 'utf8');
cpSync(join(root, 'css'), join(outDir, 'css'), { recursive: true });
cpSync(join(root, 'js'), join(outDir, 'js'), { recursive: true });

// Keep root index.html in sync for local open-without-build
writeFileSync(join(root, 'index.html'), html, 'utf8');

console.log(`Built ${outDir} (index.html + css + js)`);
