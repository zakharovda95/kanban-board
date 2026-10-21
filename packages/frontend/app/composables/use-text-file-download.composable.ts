export function useTextFileDownload() {
  const downloadText = (lines: string[], filename = 'data.txt') => {
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  return { downloadText };
}
