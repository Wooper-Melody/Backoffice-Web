"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Shield, Plus, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

const availabilityStats = [
  { label: "Políticas activas", value: 1247, change: "+23", color: "blue" },
  { label: "Contenido programado", value: 156, change: "+12", color: "yellow" },
  { label: "Bloqueos activos", value: 47, change: "-3", color: "red" },
  { label: "Regiones configuradas", value: 12, change: "0", color: "green" },
]

export default function AvailabilityPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disponibilidad</h1>
          <p className="text-muted-foreground">Gestiona la disponibilidad territorial y temporal del contenido</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {availabilityStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stat.change} desde el mes pasado</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="regions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="regions">Configuración Regional</TabsTrigger>
          <TabsTrigger value="scheduling">Ventanas de Tiempo</TabsTrigger>
          <TabsTrigger value="blocks">Bloqueos</TabsTrigger>
        </TabsList>

        <TabsContent value="regions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Regiones configuradas</CardTitle>
                    <CardDescription>
                      Gestiona las regiones disponibles para configurar políticas de contenido
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva región
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RegionsTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduling">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Contenido programado</CardTitle>
                    <CardDescription>Contenido con fechas de publicación programadas</CardDescription>
                  </div>
                  <Link href="/availability/scheduling/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Programar contenido
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <ScheduledContentTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blocks">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Contenido bloqueado</CardTitle>
                    <CardDescription>Contenido bloqueado administrativamente</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <BlockedContentTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RegionsTable() {
  const regions = [
    { id: "1", name: "Global", code: "GLOBAL", countries: 195, status: "Activa" },
    { id: "2", name: "Estados Unidos", code: "US", countries: 1, status: "Activa" },
    { id: "3", name: "Europa", code: "EU", countries: 27, status: "Activa" },
    { id: "4", name: "Asia", code: "ASIA", countries: 48, status: "Activa" },
    { id: "5", name: "América Latina", code: "LATAM", countries: 20, status: "Activa" },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Código</TableHead>
          <TableHead>Países incluidos</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {regions.map((region) => (
          <TableRow key={region.id}>
            <TableCell className="font-medium">{region.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{region.code}</Badge>
            </TableCell>
            <TableCell>{region.countries} países</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                {region.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                {region.code !== "GLOBAL" && (
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function ScheduledContentTable() {
  const scheduledContent = [
    {
      id: "1",
      title: "New Album Release",
      artist: "Artist Name",
      type: "Colección",
      scheduledDate: "2024-01-15T10:00:00Z",
      regions: ["Global"],
      status: "Programado",
    },
    {
      id: "2",
      title: "Single Preview",
      artist: "Another Artist",
      type: "Canción",
      scheduledDate: "2024-01-20T15:30:00Z",
      regions: ["US", "EU"],
      status: "Programado",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contenido</TableHead>
          <TableHead>Artista</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Fecha programada</TableHead>
          <TableHead>Regiones</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scheduledContent.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.artist}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.type}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(item.scheduledDate).toLocaleString()}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {item.regions.map((region) => (
                  <Badge key={region} variant="secondary" className="text-xs">
                    {region}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                {item.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function BlockedContentTable() {
  const blockedContent = [
    {
      id: "1",
      title: "Blocked Song",
      artist: "Artist Name",
      type: "Canción",
      blockedDate: "2024-01-10T14:30:00Z",
      reason: "Violación de derechos de autor",
      scope: "Global",
      blockedBy: "admin@melody.com",
    },
    {
      id: "2",
      title: "Regional Block",
      artist: "Another Artist",
      type: "Canción",
      blockedDate: "2024-01-08T09:15:00Z",
      reason: "Solicitud legal",
      scope: "EU",
      blockedBy: "moderator@melody.com",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contenido</TableHead>
          <TableHead>Artista</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Fecha de bloqueo</TableHead>
          <TableHead>Motivo</TableHead>
          <TableHead>Alcance</TableHead>
          <TableHead>Bloqueado por</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blockedContent.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.artist}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.type}</Badge>
            </TableCell>
            <TableCell>{new Date(item.blockedDate).toLocaleString()}</TableCell>
            <TableCell>{item.reason}</TableCell>
            <TableCell>
              <Badge variant="secondary">{item.scope}</Badge>
            </TableCell>
            <TableCell>{item.blockedBy}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Desbloquear
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
