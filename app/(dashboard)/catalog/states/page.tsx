"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Clock, Globe, Shield, CheckCircle } from "lucide-react"

const stateTransitions = [
  {
    from: "Programado",
    to: "Publicado",
    trigger: "Automático al llegar fecha/hora",
    icon: Clock,
    color: "blue",
  },
  {
    from: "Publicado",
    to: "No-disponible-región",
    trigger: "Cambio en configuración territorial",
    icon: Globe,
    color: "yellow",
  },
  {
    from: "Cualquier estado",
    to: "Bloqueado-admin",
    trigger: "Acción manual del administrador",
    icon: Shield,
    color: "red",
  },
  {
    from: "Bloqueado-admin",
    to: "Estado anterior",
    trigger: "Desbloqueo manual",
    icon: CheckCircle,
    color: "green",
  },
]

const stateStats = [
  { state: "Publicado", count: 11847, percentage: 92.2, color: "green" },
  { state: "Programado", count: 156, percentage: 1.2, color: "blue" },
  { state: "No-disponible-región", count: 797, percentage: 6.2, color: "yellow" },
  { state: "Bloqueado-admin", count: 47, percentage: 0.4, color: "red" },
]

export default function CatalogStatesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Estados</h1>
          <p className="text-muted-foreground">Visualiza y gestiona las transiciones de estado del catálogo</p>
        </div>
      </div>

      {/* State Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Estados</CardTitle>
          <CardDescription>Estado actual de todo el contenido en el catálogo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stateStats.map((stat) => (
              <div key={stat.state} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className={`
                      ${stat.color === "green" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                      ${stat.color === "blue" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}
                      ${stat.color === "yellow" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : ""}
                      ${stat.color === "red" ? "bg-red-500/10 text-red-500 border-red-500/20" : ""}
                    `}
                  >
                    {stat.state}
                  </Badge>
                  <span className="font-medium">{stat.count.toLocaleString()} elementos</span>
                </div>
                <div className="flex items-center space-x-3 min-w-[200px]">
                  <Progress value={stat.percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12 text-right">{stat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* State Priority */}
      <Card>
        <CardHeader>
          <CardTitle>Prioridad de Estados</CardTitle>
          <CardDescription>Orden de precedencia cuando múltiples estados aplican al mismo contenido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4 py-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                Bloqueado-admin
              </Badge>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                No-disponible-región
              </Badge>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                Programado
              </Badge>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Publicado
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">Mayor prioridad ← → Menor prioridad</p>
        </CardContent>
      </Card>

      {/* State Transitions */}
      <Card>
        <CardHeader>
          <CardTitle>Transiciones Permitidas</CardTitle>
          <CardDescription>Reglas de cambio de estado y sus desencadenantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {stateTransitions.map((transition, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className={`
                      p-2 rounded-lg
                      ${transition.color === "blue" ? "bg-blue-500/10 text-blue-500" : ""}
                      ${transition.color === "yellow" ? "bg-yellow-500/10 text-yellow-500" : ""}
                      ${transition.color === "red" ? "bg-red-500/10 text-red-500" : ""}
                      ${transition.color === "green" ? "bg-green-500/10 text-green-500" : ""}
                    `}
                    >
                      <transition.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {transition.from}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                          {transition.to}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{transition.trigger}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
