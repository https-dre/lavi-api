export function generateSlug(name: string): string {
  // 1. Remove acentos e caracteres especiais do nome
  const normalizedName = name
    .toString()
    .normalize('NFD') // Normaliza para decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, ''); // Remove os diacríticos (acentos)

  // 2. Converte para minúsculas e remove caracteres não alfanuméricos (mantendo hífens e números)
  const slugifiedName = normalizedName
    .toLowerCase()
    .trim() // Remove espaços em branco no início e no fim
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres não alfanuméricos, exceto hífens e espaços
    .replace(/\s+/g, '-'); // Substitui espaços por hífens

  // 3. Adiciona um timestamp para garantir a unicidade
  const timestamp = Date.now();

  // 4. Combina o nome sanitizado com o timestamp para criar o slug final
  return `${slugifiedName}-${timestamp}`;
}