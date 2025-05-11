"use client"

import * as React from "react"

interface HistogramProps {
  data: number[]
  bins: number[]
  min: number
  max: number
  selectedRange: [number, number]
  height?: number
  colorStart?: string
  colorEnd?: string
}

export function Histogram({
  data,
  bins,
  min,
  max,
  selectedRange,
  height = 60,
  colorStart = "#7f1d1d",
  colorEnd = "#ef4444",
}: HistogramProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Find the maximum value in the data for scaling
    const maxValue = Math.max(...data)
    if (maxValue === 0) return

    // Calculate bar width and spacing
    const barWidth = canvas.width / data.length
    const barSpacing = 2

    // Draw each bar
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (canvas.height - 10)
      const x = index * barWidth
      const y = canvas.height - barHeight

      // Calculate if this bar is in the selected range
      const binValue = bins[index]
      const isInRange = binValue >= selectedRange[0] && binValue <= selectedRange[1]

      // Calculate color based on position in the range
      let color
      if (isInRange) {
        // Calculate position within the selected range (0 to 1)
        const rangePosition = (binValue - selectedRange[0]) / (selectedRange[1] - selectedRange[0])

        // Parse the hex colors to RGB
        const startRGB = hexToRgb(colorStart)
        const endRGB = hexToRgb(colorEnd)

        if (startRGB && endRGB) {
          // Interpolate between start and end colors
          const r = Math.round(startRGB.r + rangePosition * (endRGB.r - startRGB.r))
          const g = Math.round(startRGB.g + rangePosition * (endRGB.g - startRGB.g))
          const b = Math.round(startRGB.b + rangePosition * (endRGB.b - startRGB.b))

          color = `rgb(${r}, ${g}, ${b})`
        } else {
          color = colorEnd
        }
      } else {
        color = "#374151" // Gray for bars outside the range
      }

      // Draw the bar
      ctx.fillStyle = color
      ctx.fillRect(x + barSpacing / 2, y, barWidth - barSpacing, barHeight)
    })
  }, [data, bins, selectedRange, colorStart, colorEnd])

  // Helper function to convert hex to RGB
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  return <canvas ref={canvasRef} width={300} height={height} className="w-full h-auto" />
}
