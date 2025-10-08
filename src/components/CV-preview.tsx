import { useRef, useState } from 'react'
import jsPDF from 'jspdf'

interface CVPreviewProps {
  formData: {
    name: string
    email: string
    phone: string
    address: string
    summary: string
  }
  sections: {
    id: number
    title: string
    entries?: { id: number; content: string; year?: string }[]
  }[]
}

export default function CVPreview({ formData, sections }: CVPreviewProps) {
  const pdfRef = useRef<HTMLIFrameElement | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string>('')

  const generatePDF = () => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 40
    const marginBottom = 40
    let y = 60

    const checkPageBreak = (currentY: number) => {
      if (currentY > pageHeight - marginBottom) {
        pdf.addPage()
        return margin
      }
      return currentY
    }

    // Header: Nama
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(18)
    const nameLines = pdf.splitTextToSize(
      formData.name || 'Nama Anda',
      pageWidth - 2 * margin,
    )
    for (const line of nameLines) {
      y = checkPageBreak(y)
      pdf.text(line, pageWidth / 2, y, { align: 'center' })
      y += 20
    }

    // Kontak
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    const contactText = `${formData.email || 'Email'} | ${formData.phone || 'Telepon'} | ${formData.address || 'Alamat'}`
    const contactLines = pdf.splitTextToSize(
      contactText,
      pageWidth - 2 * margin,
    )
    for (const line of contactLines) {
      y = checkPageBreak(y)
      pdf.text(line, pageWidth / 2, y, { align: 'center' })
      y += 10
    }
    y += 8

    // Summary
    if (formData.summary.trim()) {
      y = drawJustifiedText(
        pdf,
        formData.summary,
        margin,
        y,
        pageWidth - 2 * margin,
        12,
        pageHeight,
        marginBottom,
      )
    }

    // Sections
    for (const s of sections) {
      y = drawHeading(pdf, s.title, y + 12, true, pageHeight, marginBottom)

      if (s.entries && s.entries.length) {
        for (const entry of s.entries) {
          const leftText = entry.content
          const rightText = entry.year || ''
          y = drawLeftRightText(
            pdf,
            leftText,
            rightText,
            margin,
            pageWidth - margin,
            y,
            11,
            pageHeight,
            marginBottom,
          )
        }
      }
    }

    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)
    setPdfUrl(url)
  }

  // Helper: Heading
  const drawHeading = (
    pdf: jsPDF,
    title: string,
    y: number,
    bold: boolean,
    pageHeight: number,
    marginBottom: number,
  ) => {
    pdf.setFont('helvetica', bold ? 'bold' : 'normal')
    pdf.setFontSize(12)
    const margin = 40
    const maxWidth = pdf.internal.pageSize.getWidth() - 2 * margin
    const lines = pdf.splitTextToSize(title, maxWidth)
    for (const line of lines) {
      if (y > pageHeight - marginBottom) {
        pdf.addPage()
        y = 40
      }
      pdf.text(line, margin, y)
      y += 14
    }
    pdf.setDrawColor(0)
    pdf.setLineWidth(0.4)
    pdf.line(margin, y - 10, pdf.internal.pageSize.getWidth() - margin, y - 10)
    return y + 4
  }

  // Helper: Left-Right Text
  const drawLeftRightText = (
    pdf: jsPDF,
    left: string,
    right: string,
    xLeft: number,
    xRight: number,
    y: number,
    fontSize: number,
    pageHeight?: number,
    marginBottom?: number,
  ) => {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(fontSize)

    const rightWidth = right ? pdf.getTextWidth(right) : 0
    const buffer = 5
    const maxLeftWidth = xRight - xLeft - rightWidth - buffer
    const leftLines = pdf.splitTextToSize(left, maxLeftWidth)

    leftLines.forEach((line: string) => {
      if (pageHeight && marginBottom && y > pageHeight - marginBottom) {
        pdf.addPage()
        y = 40
      }
      const isBullet = line.startsWith('• ')
      pdf.text(line, xLeft + (isBullet ? 4 : 0), y)
      y += fontSize + 2
    })

    if (right) {
      pdf.text(right, xRight, y - (fontSize + 2) * leftLines.length, {
        align: 'right',
      })
    }

    return y
  }

  // Helper: Justified Text
  const drawJustifiedText = (
    pdf: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    pageHeight?: number,
    marginBottom?: number,
  ) => {
    const words = text.split(' ')
    let line = ''
    const lines: string[] = []

    words.forEach((word) => {
      const testLine = line ? line + ' ' + word : word
      if (pdf.getTextWidth(testLine) > maxWidth) {
        lines.push(line)
        line = word
      } else {
        line = testLine
      }
    })
    if (line) lines.push(line)

    lines.forEach((lineText, idx) => {
      if (pageHeight && marginBottom && y > pageHeight - marginBottom) {
        pdf.addPage()
        y = 40
      }

      const lineWords = lineText.split(' ')
      if (idx === lines.length - 1 || lineWords.length === 1) {
        pdf.text(lineText, x, y)
      } else {
        const lineWidth = pdf.getTextWidth(lineText)
        const spaceWidth = pdf.getTextWidth(' ')
        const extraSpace = (maxWidth - lineWidth) / (lineWords.length - 1)
        let cursorX = x

        lineWords.forEach((word) => {
          pdf.text(word, cursorX, y)
          cursorX += pdf.getTextWidth(word) + spaceWidth + extraSpace
        })
      }

      y += lineHeight
    })

    return y
  }

  const handleDownloadPDF = () => {
    generatePDF()
    setTimeout(() => {
      if (!pdfUrl) return
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = formData.name.trim()
        ? `CV - ${formData.name}.pdf`
        : 'MyCV.pdf'
      link.click()
    }, 200)
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={generatePDF}
        className="flex items-center justify-center mb-4 w-fit bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer"
      >
        Preview PDF
      </button>

      {pdfUrl && (
        <>
          <iframe
            ref={pdfRef}
            src={`${pdfUrl}#zoom=100`}
            width="100%"
            height="842px"
            className="border shadow-md rounded mb-4"
          />
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center mt-2 w-fit bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition cursor-pointer"
          >
            Download PDF
          </button>
        </>
      )}
    </div>
  )
}
