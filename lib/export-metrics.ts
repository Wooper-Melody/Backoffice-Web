// Utility functions for exporting metrics data to CSV and Excel formats

import type {
  TotalUsersMetrics,
  RoleDistributionMetrics,
  BlockedUsersMetrics,
  ActiveUsersMetrics,
  NewSignUpsMetrics,
  RecentSignUpsMetrics,
  MetricPeriod,
} from "@/types/users"

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

// Export Total Users Metrics
export function exportTotalUsersMetrics(
  data: TotalUsersMetrics,
  period: MetricPeriod,
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Metric", "Value"],
    ["Total Users", data.totalUsers.toString()],
    ["Change Percentage", `${data.changePercentage.toFixed(2)}%`],
    ["Period", period],
    [""],
    ["Regional Breakdown"],
    ["Region", "Count"],
    ...data.regionalBreakdown.map((r) => [r.region, r.count.toString()]),
  ]

  const csv = convertToCSV(rows)
  const filename = `total-users-metrics-${period}-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    // For Excel, we'll still use CSV but with .xls extension for simplicity
    // In a production environment, you would use a library like xlsx
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export Role Distribution Metrics
export function exportRoleDistributionMetrics(
  data: RoleDistributionMetrics,
  period: MetricPeriod,
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Role Distribution Metrics"],
    ["Change Percentage", `${data.changePercentage.toFixed(2)}%`],
    ["Period", period],
    [""],
    ["Total Distribution"],
    ["Role", "Count"],
    ...data.totalRoleDistribution.map((r) => [r.role, r.count.toString()]),
    [""],
    ["Regional Distribution"],
    ["Role", "Region", "Count"],
    ...data.regionalRoleDistribution.map((r) => [r.role, r.region, r.count.toString()]),
  ]

  const csv = convertToCSV(rows)
  const filename = `role-distribution-metrics-${period}-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export Blocked Users Metrics
export function exportBlockedUsersMetrics(
  data: BlockedUsersMetrics,
  period: MetricPeriod,
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Metric", "Value"],
    ["Total Blocked Users", data.totalBlockedUsers.toString()],
    ["Change Percentage", `${data.changePercentage.toFixed(2)}%`],
    ["Period", period],
    [""],
    ["Regional Breakdown"],
    ["Region", "Count"],
    ...data.regionalBreakdown.map((r) => [r.region, r.count.toString()]),
  ]

  const csv = convertToCSV(rows)
  const filename = `blocked-users-metrics-${period}-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export Active Users Metrics
export function exportActiveUsersMetrics(
  data: ActiveUsersMetrics,
  period: MetricPeriod,
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Metric", "Value"],
    ["Active Users", data.activeUsers.toString()],
    ["Change Percentage", `${data.changePercentage.toFixed(2)}%`],
    ["Period", period],
  ]

  const csv = convertToCSV(rows)
  const filename = `active-users-metrics-${period}-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export New SignUps Metrics
export function exportNewSignUpsMetrics(
  data: NewSignUpsMetrics,
  period: MetricPeriod,
  format: "csv" | "excel" = "csv"
) {
  const rows = [
    ["Metric", "Value"],
    ["New Sign-ups", data.newSignUps.toString()],
    ["Change Percentage", `${data.changePercentage.toFixed(2)}%`],
    ["Period", period],
  ]

  const csv = convertToCSV(rows)
  const filename = `new-signups-metrics-${period}-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export Recent SignUps Metrics
export function exportRecentSignUpsMetrics(data: RecentSignUpsMetrics, format: "csv" | "excel" = "csv") {
  const rows = [
    ["Recent Sign-ups"],
    [""],
    ["Last Artist"],
    ["Field", "Value"],
  ]

  if (data.lastArtist) {
    rows.push(
      ["ID", data.lastArtist.id],
      ["Username", data.lastArtist.username],
      ["Email", data.lastArtist.email],
      ["Created At", data.lastArtist.createdAt]
    )
  } else {
    rows.push(["No data", ""])
  }

  rows.push([""], ["Last Listener"], ["Field", "Value"])

  if (data.lastListener) {
    rows.push(
      ["ID", data.lastListener.id],
      ["Username", data.lastListener.username],
      ["Email", data.lastListener.email],
      ["Created At", data.lastListener.createdAt]
    )
  } else {
    rows.push(["No data", ""])
  }

  const csv = convertToCSV(rows)
  const filename = `recent-signups-metrics-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}

// Export all metrics combined
export function exportAllUserMetrics(
  totalUsers: TotalUsersMetrics | null,
  roleDistribution: RoleDistributionMetrics | null,
  blockedUsers: BlockedUsersMetrics | null,
  activeUsers: ActiveUsersMetrics | null,
  newSignUps: NewSignUpsMetrics | null,
  recentSignUps: RecentSignUpsMetrics | null,
  period: MetricPeriod,
  format: "csv" | "excel" = "csv"
) {
  const rows: any[][] = [["User Metrics Report"], ["Period", period], ["Generated At", new Date().toISOString()], [""]]

  if (totalUsers) {
    rows.push(
      ["Total Users"],
      ["Total", totalUsers.totalUsers.toString()],
      ["Change", `${totalUsers.changePercentage.toFixed(2)}%`],
      [""],
      ["Regional Breakdown"],
      ["Region", "Count"],
      ...totalUsers.regionalBreakdown.map((r) => [r.region, r.count.toString()]),
      [""]
    )
  }

  if (newSignUps) {
    rows.push(
      ["New Sign-ups"],
      ["Count", newSignUps.newSignUps.toString()],
      ["Change", `${newSignUps.changePercentage.toFixed(2)}%`],
      [""]
    )
  }

  if (activeUsers) {
    rows.push(
      ["Active Users"],
      ["Count", activeUsers.activeUsers.toString()],
      ["Change", `${activeUsers.changePercentage.toFixed(2)}%`],
      [""]
    )
  }

  if (roleDistribution) {
    rows.push(
      ["Role Distribution"],
      ["Change", `${roleDistribution.changePercentage.toFixed(2)}%`],
      [""],
      ["Role", "Count"],
      ...roleDistribution.totalRoleDistribution.map((r) => [r.role, r.count.toString()]),
      [""]
    )
  }

  if (blockedUsers) {
    rows.push(
      ["Blocked Users"],
      ["Total", blockedUsers.totalBlockedUsers.toString()],
      ["Change", `${blockedUsers.changePercentage.toFixed(2)}%`],
      [""]
    )
  }

  if (recentSignUps) {
    rows.push(["Recent Sign-ups"], [""])
    if (recentSignUps.lastArtist) {
      rows.push(
        ["Last Artist", recentSignUps.lastArtist.username],
        ["Email", recentSignUps.lastArtist.email],
        ["Created", recentSignUps.lastArtist.createdAt],
        [""]
      )
    }
    if (recentSignUps.lastListener) {
      rows.push(
        ["Last Listener", recentSignUps.lastListener.username],
        ["Email", recentSignUps.lastListener.email],
        ["Created", recentSignUps.lastListener.createdAt],
        [""]
      )
    }
  }

  const csv = convertToCSV(rows)
  const filename = `all-user-metrics-${period}-${Date.now()}.csv`

  if (format === "csv") {
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  } else {
    downloadFile(csv, filename.replace(".csv", ".xls"), "application/vnd.ms-excel")
  }
}
