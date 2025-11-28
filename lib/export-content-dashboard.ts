// Utility functions for exporting content dashboard metrics to CSV and Excel formats

import type {
  ContentSummaryResponse,
  TopSong,
  TopCollection,
  TopPlaylist,
  TopArtist,
  ContentStateManagementResponse,
  ContentRatesResponse
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

// Export Content Summary
export function exportContentSummary(
  data: ContentSummaryResponse,
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Content Summary"],
    [""],
    ["Date Range", `${data.dateRange.current.start} to ${data.dateRange.current.end}`],
    [""],
    ["Songs Released"],
    ["Current Period", data.songsReleased.current.toString()],
    ["Previous Period", data.songsReleased.previous.toString()],
    ["Change Percentage", `${data.songsReleased.changePercent.toFixed(2)}%`],
    [""],
    ["Albums Released"],
    ["Current Period", data.albumsReleased.current.toString()],
    ["Previous Period", data.albumsReleased.previous.toString()],
    ["Change Percentage", `${data.albumsReleased.changePercent.toFixed(2)}%`],
    [""],
    ["Total Plays"],
    ["Current Period", data.totalPlays.current.toString()],
    ["Previous Period", data.totalPlays.previous.toString()],
    ["Change Percentage", `${data.totalPlays.changePercent.toFixed(2)}%`],
    [""],
    ["Total Likes"],
    ["Current Period", data.totalLikes.current.toString()],
    ["Previous Period", data.totalLikes.previous.toString()],
    ["Change Percentage", `${data.totalLikes.changePercent.toFixed(2)}%`],
    [""],
    ["Total Saves"],
    ["Current Period", data.totalSaves.current.toString()],
    ["Previous Period", data.totalSaves.previous.toString()],
    ["Change Percentage", `${data.totalSaves.changePercent.toFixed(2)}%`],
  ]

  const csv = convertToCSV(rows)
  const filename = `content-summary-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export Top Songs
export function exportTopSongs(
  songs: TopSong[],
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Top Performing Songs"],
    [""],
    ["Rank", "Song ID", "Title", "Artist", "Plays", "Likes"],
    ...songs.map(song => [
      song.rank.toString(),
      song.songId,
      song.title,
      song.artist,
      song.plays.toString(),
      song.likes.toString()
    ])
  ]

  const csv = convertToCSV(rows)
  const filename = `top-songs-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export Top Collections
export function exportTopCollections(
  collections: TopCollection[],
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Top Performing Collections"],
    [""],
    ["Rank", "Collection ID", "Title", "Artist Name", "Artist ID", "Plays", "Saves"],
    ...collections.map(collection => [
      collection.rank.toString(),
      collection.collectionId,
      collection.title,
      collection.artistName,
      collection.artistId,
      collection.plays.toString(),
      collection.saves.toString()
    ])
  ]

  const csv = convertToCSV(rows)
  const filename = `top-collections-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export Top Playlists
export function exportTopPlaylists(
  playlists: TopPlaylist[],
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Top Performing Playlists"],
    [""],
    ["Rank", "Playlist ID", "Title", "Curator", "Owner ID", "Plays", "Saves"],
    ...playlists.map(playlist => [
      playlist.rank.toString(),
      playlist.playlistId,
      playlist.title,
      playlist.curator,
      playlist.ownerId,
      playlist.plays.toString(),
      playlist.saves.toString()
    ])
  ]

  const csv = convertToCSV(rows)
  const filename = `top-playlists-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export Top Artists
export function exportTopArtists(
  artists: TopArtist[],
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Top Performing Artists"],
    [""],
    ["Rank", "Artist ID", "Artist Name", "Plays", "Likes"],
    ...artists.map(artist => [
      artist.rank.toString(),
      artist.artistId,
      artist.artistName,
      artist.plays.toString(),
      artist.likes.toString()
    ])
  ]

  const csv = convertToCSV(rows)
  const filename = `top-artists-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export Content State Management
export function exportContentStateManagement(
  data: ContentStateManagementResponse,
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Content State Management"],
    [""],
    ["Region", data.region || "Global"],
    [""],
    ["Songs State Distribution"],
    ["Published", data.songs.published.toString()],
    ["Scheduled", data.songs.scheduled.toString()],
    ["Region Unavailable", data.songs.regionUnavailable.toString()],
    ["Admin Blocked", data.songs.adminBlocked.toString()],
    ["Total Songs", data.songs.total.toString()],
    [""],
    ["Collections State Distribution"],
    ["Published", data.collections.published.toString()],
    ["Scheduled", data.collections.scheduled.toString()],
    ["Region Unavailable", data.collections.regionUnavailable.toString()],
    ["Admin Blocked", data.collections.adminBlocked.toString()],
    ["Total Collections", data.collections.total.toString()],
  ]

  const csv = convertToCSV(rows)
  const filename = `content-state-management-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export Content Rates
export function exportContentRates(
  data: ContentRatesResponse,
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Content Engagement Rates"],
    [""],
    ["Date Range", `${data.dateRange.current.start} to ${data.dateRange.current.end}`],
    [""],
    ["Average Plays Per Song"],
    ["Current Period", data.averagePlaysPerSong.current.toString()],
    ["Previous Period", data.averagePlaysPerSong.previous.toString()],
    ["Change Percentage", `${data.averagePlaysPerSong.changePercent.toFixed(2)}%`],
    [""],
    ["Like Rate"],
    ["Description", data.likeRate.description],
    ["Current Period", data.likeRate.current.toFixed(2)],
    ["Previous Period", data.likeRate.previous.toFixed(2)],
    ["Change Percentage", `${data.likeRate.changePercent.toFixed(2)}%`],
    [""],
    ["Save Rate (Playlists)"],
    ["Description", data.saveRatePlaylists.description],
    ["Current Period", data.saveRatePlaylists.current.toFixed(2)],
    ["Previous Period", data.saveRatePlaylists.previous.toFixed(2)],
    ["Change Percentage", `${data.saveRatePlaylists.changePercent.toFixed(2)}%`],
    [""],
    ["Save Rate (Collections)"],
    ["Description", data.saveRateCollections.description],
    ["Current Period", data.saveRateCollections.current.toFixed(2)],
    ["Previous Period", data.saveRateCollections.previous.toFixed(2)],
    ["Change Percentage", `${data.saveRateCollections.changePercent.toFixed(2)}%`],
  ]

  const csv = convertToCSV(rows)
  const filename = `content-rates-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}
