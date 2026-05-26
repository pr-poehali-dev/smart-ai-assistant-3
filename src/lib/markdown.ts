export function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold text-foreground mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold text-foreground mt-4 mb-1.5">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-foreground mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="font-mono text-[12px] bg-white/10 px-1 py-0.5 rounded text-primary">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="flex gap-2 mb-0.5"><span class="text-primary mt-0.5 shrink-0">•</span><span>$1</span></li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="flex gap-2 mb-0.5"><span class="text-primary font-mono text-xs mt-0.5 shrink-0 w-4">$1.</span><span>$2</span></li>')
    .replace(/(<li[\s\S]*?<\/li>)+/g, '<ul class="my-1 space-y-0.5">$&</ul>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br/>')
    .replace(/^(?!<[h|u|p|l])(.+)$/gm, (match) => {
      if (match.trim() === '') return '';
      return match;
    });
}
