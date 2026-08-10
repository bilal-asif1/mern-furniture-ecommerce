export const WHATSAPP_NUMBER = '923063400146';

export function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function buildProductWhatsAppLink(productName, productUrl = '') {
  const parts = [
    `Hi, I'm interested in ${productName}.`,
    'Can you share more details and pricing?',
  ];

  if (productUrl) {
    parts.push(`Product page: ${productUrl}`);
  }

  return buildWhatsAppLink(parts.join(' '));
}
