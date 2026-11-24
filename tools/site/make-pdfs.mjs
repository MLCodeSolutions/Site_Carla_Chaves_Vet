import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, '..', 'assets', 'ebooks');
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  {
    file: 'primeiros-cuidados.pdf',
    title: 'Primeiros cuidados',
    subtitle: 'Guia Drª Carla Chaves - o comeco da vida do seu pet',
    lines: [
      'Este guia e um material demonstrativo da Drª Carla Chaves.',
      '',
      '1. Vacinas: siga o protocolo indicado na consulta.',
      '2. Alimentacao: ajuste a porcao a idade e ao porte.',
      '3. Ambiente: cantinho seguro, agua fresca e sombra.',
      '4. Rotina: brincadeiras curtas e descanso de qualidade.',
      '',
      'Em caso de duvida, fale com a equipe da Drª Carla Chaves.'
    ]
  },
  {
    file: 'alimentacao-segura.pdf',
    title: 'Alimentacao segura',
    subtitle: 'Guia Drª Carla Chaves - o que pode e o que nao pode',
    lines: [
      'Este guia e um material demonstrativo da Drª Carla Chaves.',
      '',
      'Evite: chocolate, uva, cebola, alho e bebidas alcoolicas.',
      'Modere: petiscos e gordura animal.',
      'Prefira: racao de qualidade e transicao gradual.',
      'Agua limpa e fresca sempre disponivel.',
      '',
      'Em caso de duvida, fale com a equipe da Drª Carla Chaves.'
    ]
  },
  {
    file: 'pets-nao-convencionais.pdf',
    title: 'Pets nao convencionais',
    subtitle: 'Guia Drª Carla Chaves - coelhos, aves e roedores',
    lines: [
      'Este guia e um material demonstrativo da Drª Carla Chaves.',
      '',
      'Coelhos: feno a vontade e espaco para se mover.',
      'Aves: poleiros de madeira e banho de sol indireto.',
      'Roedores: enriquecimento ambiental e abrigos.',
      'Exoticos: temperatura e umidade controladas.',
      '',
      'Em caso de duvida, fale com a equipe da Drª Carla Chaves.'
    ]
  },
  {
    file: 'viagem-com-pets.pdf',
    title: 'Viagem com pets',
    subtitle: 'Guia Drª Carla Chaves - checklist antes de sair de casa',
    lines: [
      'Este guia e um material demonstrativo da Drª Carla Chaves.',
      '',
      '1. Confira a carteira de vacinacao.',
      '2. Solicite o atestado de saude para viagem.',
      '3. Use caixa de transporte ventilada e segura.',
      '4. Leve agua, comedouro e medicamentos.',
      '5. Planeje pausas a cada duas horas.',
      '',
      'Em caso de duvida, fale com a equipe da Drª Carla Chaves.'
    ]
  }
];

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

function buildPdf(page) {
  const body = [];
  page.lines.forEach((line, i) => {
    body.push(`BT /F1 12 Tf 56 ${620 - i * 26} Td (${esc(line)}) Tj ET`);
  });

  const content = [
    '0.184 0.290 0.196 rg 0 700 595 142 re f',
    '1 1 1 rg BT /F1 26 Tf 56 790 Td (Drª Carla Chaves) Tj ET',
    '0.949 0.929 0.663 rg BT /F1 11 Tf 56 766 Td (VETERINARIA DOMICILIAR) Tj ET',
    '0.184 0.290 0.196 rg BT /F1 24 Tf 56 660 Td (' + esc(page.title) + ') Tj ET',
    '0.361 0.498 0.369 rg BT /F1 12 Tf 56 638 Td (' + esc(page.subtitle) + ') Tj ET',
    '0.114 0.169 0.122 rg'
  ].concat(body).join('\n') + '\n';

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Length ' + Buffer.byteLength(content, 'latin1') + ' >>\nstream\n' + content + 'endstream'
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += String(off).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  fs.writeFileSync(path.join(outDir, page.file), Buffer.from(pdf, 'latin1'));
}

pages.forEach(buildPdf);
console.log('PDFs gerados:', pages.map((p) => p.file).join(', '));
