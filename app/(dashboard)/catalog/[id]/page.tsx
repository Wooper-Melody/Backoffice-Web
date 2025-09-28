"use client"

import { useState } from "react"
import { ArrowLeft, Play, ExternalLink, Edit, Shield, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

// Mock data - in real app this would come from API based on [id]
const contentDetail = {
  id: "1",
  type: "Canción",
  title: "Blinding Lights",
  artist: "The Weeknd",
  collection: "After Hours",
  collectionYear: 2020,
  position: 2,
  duration: "3:20",
  publishDate: "2019-11-29",
  status: "Publicado",
  hasVideo: true,
  explicit: false,
  cover: "/placeholder.svg?key=s8s96",
  genres: ["Pop", "Synthwave", "R&B"],
  label: "XO/Republic Records",
  isrc: "USUG11902646",
}

const availabilityData = [
  { region: "Global", status: "Publicado", scheduledDate: null },
  { region: "Estados Unidos", status: "Publicado", scheduledDate: null },
  { region: "Europa", status: "Publicado", scheduledDate: null },
  { region: "Asia", status: "No-disponible-región", scheduledDate: null },
  { region: "América Latina", status: "Programado", scheduledDate: "2024-01-15T10:00:00Z" },
]

const appearances = [
  {
    type: "Álbum",
    title: "After Hours",
    position: 2,
    owner: null,
  },
  {
    type: "Playlist",
    title: "Top Hits 2020",
    position: 1,
    owner: "Melody Editorial",
  },
  {
    type: "Playlist",
    title: "Synthwave Essentials",
    position: 5,
    owner: "Usuario: @musiclover",
  },
]

const auditLog = [
  {
    id: "1",
    timestamp: "2024-01-10T14:30:00Z",
    user: "admin@melody.com",
    event: "Cambio de disponibilidad",
    details: "Región Asia: Publicado → No-disponible-región",
    scope: "Asia",
  },
  {
    id: "2",
    timestamp: "2024-01-05T09:15:00Z",
    user: "moderator@melody.com",
    event: "Desbloqueo",
    details: "Contenido desbloqueado tras revisión",
    scope: "Global",
  },
  {
    id: "3",
    timestamp: "2023-12-20T16:45:00Z",
    user: "admin@melody.com",
    event: "Bloqueo administrativo",
    details: "Bloqueado por reporte de copyright",
    scope: "Global",
  },
]

const statusColors = {
  Publicado: "bg-green-500/10 text-green-500 border-green-500/20",
  Programado: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "No-disponible-región": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "Bloqueado-admin": "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function ContentDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("summary")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/catalog">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Button>
        </Link>
      </div>

      {/* Content Header */}
      <div className="flex items-start space-x-6">
        <Avatar className="h-32 w-32 rounded-lg">
          <AvatarImage src={contentDetail.cover || "/placeholder.svg"} alt={contentDetail.title} />
          <AvatarFallback className="rounded-lg text-2xl">{contentDetail.title.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant="outline">{contentDetail.type}</Badge>
              <Badge variant="outline" className={statusColors[contentDetail.status as keyof typeof statusColors]}>
                {contentDetail.status}
              </Badge>
              {contentDetail.hasVideo && <Badge variant="secondary">Video</Badge>}
              {contentDetail.explicit && <Badge variant="destructive">Explícito</Badge>}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{contentDetail.title}</h1>
            <p className="text-xl text-muted-foreground">{contentDetail.artist}</p>
            {contentDetail.collection && (
              <p className="text-muted-foreground">
                De {contentDetail.collection} ({contentDetail.collectionYear})
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Reproducir
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar metadatos
            </Button>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Gestionar disponibilidad
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
          <TabsTrigger value="appearances">Apariciones</TabsTrigger>
          <TabsTrigger value="audit">Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duración:</span>
                  <span>{contentDetail.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posición en colección:</span>
                  <span>#{contentDetail.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de publicación:</span>
                  <span>{contentDetail.publishDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ISRC:</span>
                  <span className="font-mono text-sm">{contentDetail.isrc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sello discográfico:</span>
                  <span>{contentDetail.label}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Géneros y clasificación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-muted-foreground mb-2 block">Géneros:</span>
                  <div className="flex flex-wrap gap-2">
                    {contentDetail.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contenido explícito:</span>
                  <span>{contentDetail.explicit ? "Sí" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Video musical:</span>
                  <span>{contentDetail.hasVideo ? "Disponible" : "No disponible"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {contentDetail.collection && (
            <Card>
              <CardHeader>
                <CardTitle>Colección asociada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{contentDetail.collection}</p>
                    <p className="text-sm text-muted-foreground">
                      Álbum • {contentDetail.collectionYear} • Posición #{contentDetail.position}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver colección
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado efectivo por región</CardTitle>
              <CardDescription>Disponibilidad actual aplicando la prioridad de estados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Región</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha programada</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availabilityData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.region}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[item.status as keyof typeof statusColors]}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.scheduledDate ? (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(item.scheduledDate).toLocaleString()}</span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apariciones en colecciones</CardTitle>
              <CardDescription>Álbumes, EPs, Singles y Playlists públicas que incluyen esta canción</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Posición</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appearances.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline">{item.type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>#{item.position}</TableCell>
                      <TableCell>{item.owner || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de auditoría</CardTitle>
              <CardDescription>
                Registro de cambios de bloqueo administrativo y disponibilidad por región
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y hora</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead>Alcance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLog.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.event}</Badge>
                      </TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{log.scope}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
