export interface ModulePastelStyle {
  bg: string;
  border: string;
  hover: string;
  cardClass: string;
}

export function getModulePastelStyle(pathSlug: string = '', index: number = 0): ModulePastelStyle {
  const slug = pathSlug.toLowerCase();
  if (slug.includes('python')) {
    return {
      bg: 'bg-[#f0faf6]',
      border: 'border-[#d4f0e5]',
      hover: 'hover:bg-[#e4f7ef]',
      cardClass: 'bg-[#f0faf6] border-[#d4f0e5] hover:bg-[#e4f7ef]',
    };
  }
  if (slug.includes('sql') || slug.includes('database')) {
    return {
      bg: 'bg-[#f0eef8]',
      border: 'border-[#e0dcf4]',
      hover: 'hover:bg-[#e6e2f4]',
      cardClass: 'bg-[#f0eef8] border-[#e0dcf4] hover:bg-[#e6e2f4]',
    };
  }
  if (slug.includes('git')) {
    return {
      bg: 'bg-[#fdf2f4]',
      border: 'border-[#fce4e8]',
      hover: 'hover:bg-[#fadce2]',
      cardClass: 'bg-[#fdf2f4] border-[#fce4e8] hover:bg-[#fadce2]',
    };
  }
  if (slug.includes('ml') || slug.includes('machine-learning')) {
    return {
      bg: 'bg-[#fde8e2]',
      border: 'border-[#fad0c5]',
      hover: 'hover:bg-[#fbc5b7]',
      cardClass: 'bg-[#fde8e2] border-[#fad0c5] hover:bg-[#fbc5b7]',
    };
  }

  const PALETTE = [
    { bg: 'bg-[#f0faf6]', border: 'border-[#d4f0e5]', hover: 'hover:bg-[#e4f7ef]', cardClass: 'bg-[#f0faf6] border-[#d4f0e5] hover:bg-[#e4f7ef]' },
    { bg: 'bg-[#f0eef8]', border: 'border-[#e0dcf4]', hover: 'hover:bg-[#e6e2f4]', cardClass: 'bg-[#f0eef8] border-[#e0dcf4] hover:bg-[#e6e2f4]' },
    { bg: 'bg-[#fdf2f4]', border: 'border-[#fce4e8]', hover: 'hover:bg-[#fadce2]', cardClass: 'bg-[#fdf2f4] border-[#fce4e8] hover:bg-[#fadce2]' },
    { bg: 'bg-[#fde8e2]', border: 'border-[#fad0c5]', hover: 'hover:bg-[#fbc5b7]', cardClass: 'bg-[#fde8e2] border-[#fad0c5] hover:bg-[#fbc5b7]' },
    { bg: 'bg-[#faf4e8]', border: 'border-[#f5e8d0]', hover: 'hover:bg-[#f3e0c0]', cardClass: 'bg-[#faf4e8] border-[#f5e8d0] hover:bg-[#f3e0c0]' },
  ];

  return PALETTE[index % PALETTE.length];
}
