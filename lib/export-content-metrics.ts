// Utility functions for exporting content metrics data to CSV and Excel formats

import type {
  SongOverviewResponse,
  CollectionOverviewResponse,
} from "@/types/catalog"

// Convert data to CSV format
function convertToCSV(data: any[][]): string {
  return data.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
}

// Download file
function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export Song Metrics
export function exportSongMetrics(
  data: SongOverviewResponse,
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Song Metrics Overview"],
    [""],
    ["Basic Information"],
    ["Song ID", data.songId],
    ["Title", data.title],
    ["Artist", data.artist],
    ["Artist ID", data.artistId],
    [""],
    ["All-Time Metrics"],
    ["Total Plays", data.totalPlays.toString()],
    ["Total Likes", data.totalLikes.toString()],
    [""],
    ["Period Metrics"],
    ["Date Range", `${data.dateRange.current.start} to ${data.dateRange.current.end}`],
    ["Region Filter", data.region || "Global"],
    [""],
    ["Plays"],
    ["Current Period", data.periodPlays.current.toString()],
    ["Previous Period", data.periodPlays.previous.toString()],
    ["Change Percentage", `${data.periodPlays.changePercent.toFixed(2)}%`],
    [""],
    ["Likes"],
    ["Current Period", data.periodLikes.current.toString()],
    ["Previous Period", data.periodLikes.previous.toString()],
    ["Change Percentage", `${data.periodLikes.changePercent.toFixed(2)}%`],
  ]

  const csv = convertToCSV(rows)
  const filename = `song-metrics-${data.songId}-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export Collection Metrics
export function exportCollectionMetrics(
  data: CollectionOverviewResponse,
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Collection Metrics Overview"],
    [""],
    ["Basic Information"],
    ["Collection ID", data.collectionId],
    ["Title", data.title],
    ["Curator", data.curator],
    ["Artist ID", data.artistId],
    [""],
    ["All-Time Metrics"],
    ["Total Plays", data.totalPlays.toString()],
    ["Total Saves", data.totalSaves.toString()],
    [""],
    ["Period Metrics"],
    ["Date Range", `${data.dateRange.current.start} to ${data.dateRange.current.end}`],
    ["Region Filter", data.region || "Global"],
    [""],
    ["Plays"],
    ["Current Period", data.periodPlays.current.toString()],
    ["Previous Period", data.periodPlays.previous.toString()],
    ["Change Percentage", `${data.periodPlays.changePercent.toFixed(2)}%`],
    [""],
    ["Saves"],
    ["Current Period", data.periodSaves.current.toString()],
    ["Previous Period", data.periodSaves.previous.toString()],
    ["Change Percentage", `${data.periodSaves.changePercent.toFixed(2)}%`],
  ]

  const csv = convertToCSV(rows)
  const filename = `collection-metrics-${data.collectionId}-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}
