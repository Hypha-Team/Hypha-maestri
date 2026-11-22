/** Reads an image file and shrinks it, so uploaded works fit in the browser's storage. */
export function readImage(file: File, max = 1000): Promise<{ src: string; ratio: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve({ src: canvas.toDataURL('image/jpeg', 0.82), ratio: img.width / img.height })
    }
    img.onerror = reject
    img.src = url
  })
}
