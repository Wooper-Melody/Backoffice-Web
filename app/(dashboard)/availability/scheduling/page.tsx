"use client"

import { useState } from "react"
import { Calendar, Clock, Globe, Search, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

const upcomingReleases = [
  {
    id: "1",
    title: "New Album",
    artist: "The Weeknd",
    type: "Colección",
    scheduledDate: new Date("2024-01-15T10:00:00Z"),
    regions: ["Global"],
    timeUntilRelease: "5 días",
  },
  {
    id: "2",
    title: "Single Drop",
    artist: "Dua Lipa",
    type: "Canción",
    scheduledDate: new Date("2024-01-20T15:30:00Z"),
    regions: ["US", "EU"],
    timeUntilRelease: "10 días",
  },
  {
    id: "3",
    title: "EP Release",
    artist: "Bad Bunny",
    type: "Colección",
    scheduledDate: new Date("2024-01-25T12:00:00Z"),
    regions: ["LATAM", "US"],
    timeUntilRelease: "15 días",
  },
]

export default function SchedulingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [selectedRelease, setSelectedRelease] = useState<any>(null)
  const { toast } = useToast()

  const [scheduleForm, setScheduleForm] = useState({
    title: "",
    artist: "",
    type: "",
    scheduledDate: "",
    scheduledTime: "",
    regions: [] as string[],
  })

  const filteredReleases = upcomingReleases.filter(
    (release) =>
      release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      release.artist.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleScheduleContent = async () => {
    try {
      // Validate form
      if (
        !scheduleForm.title ||
        !scheduleForm.artist ||
        !scheduleForm.type ||
        !scheduleForm.scheduledDate ||
        !scheduleForm.scheduledTime ||
        scheduleForm.regions.length === 0
      ) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos.",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Contenido programado",
        description: "El contenido ha sido programado exitosamente.",
      })

      // Reset form and close dialog
      setScheduleForm({
        title: "",
        artist: "",
        type: "",
        scheduledDate: "",
        scheduledTime: "",
        regions: [],
      })
      setIsScheduleDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo programar el contenido.",
        variant: "destructive",
      })
    }
  }

  const handleEditRelease = (release: any) => {
    setSelectedRelease(release)
    setScheduleForm({
      title: release.title,
      artist: release.artist,
      type: release.type,
      scheduledDate: format(release.scheduledDate, "yyyy-MM-dd"),
      scheduledTime: format(release.scheduledDate, "HH:mm"),
      regions: release.regions,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateRelease = async () => {
    try {
      // Validate form
      if (
        !scheduleForm.title ||
        !scheduleForm.artist ||
        !scheduleForm.type ||
        !scheduleForm.scheduledDate ||
        !scheduleForm.scheduledTime ||
        scheduleForm.regions.length === 0
      ) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos.",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Programación actualizada",
        description: "La programación del contenido ha sido actualizada exitosamente.",
      })

      // Reset form and close dialog
      setScheduleForm({
        title: "",
        artist: "",
        type: "",
        scheduledDate: "",
        scheduledTime: "",
        regions: [],
      })
      setSelectedRelease(null)
      setIsEditDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la programación.",
        variant: "destructive",
      })
    }
  }

  const handleCancelRelease = (release: any) => {
    setSelectedRelease(release)
    setIsCancelDialogOpen(true)
  }

  const handleConfirmCancel = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Programación cancelada",
        description: "La programación del contenido ha sido cancelada exitosamente.",
      })

      setSelectedRelease(null)
      setIsCancelDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cancelar la programación.",
        variant: "destructive",
      })
    }
  }

  const handleConfigureTimezone = (region: string) => {
    toast({
      title: "Configuración de zona horaria",
      description: `Configurando zona horaria para ${region}...`,
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programación de Contenido</h1>
          <p className="text-muted-foreground">Gestiona las fechas y horarios de publicación del contenido</p>
        </div>
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Clock className="h-4 w-4 mr-2" />
              Programar nuevo contenido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Programar Contenido</DialogTitle>
              <DialogDescription>
                Programa la publicación automática de contenido en fechas específicas.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Título del contenido"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">Artista</Label>
                  <Input
                    id="artist"
                    placeholder="Nombre del artista"
                    value={scheduleForm.artist}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, artist: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de contenido</Label>
                <Select
                  value={scheduleForm.type}
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Canción">Canción</SelectItem>
                    <SelectItem value="Colección">Colección</SelectItem>
                    <SelectItem value="EP">EP</SelectItem>
                    <SelectItem value="Álbum">Álbum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Fecha de publicación</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={scheduleForm.scheduledDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime">Hora de publicación</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={scheduleForm.scheduledTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Regiones</Label>
                <div className="flex flex-wrap gap-2">
                  {["Global", "US", "EU", "LATAM", "APAC"].map((region) => (
                    <Button
                      key={region}
                      variant={scheduleForm.regions.includes(region) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newRegions = scheduleForm.regions.includes(region)
                          ? scheduleForm.regions.filter((r) => r !== region)
                          : [...scheduleForm.regions, region]
                        setScheduleForm({ ...scheduleForm, regions: newRegions })
                      }}
                    >
                      {region}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleScheduleContent}>Programar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Calendar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Calendario de lanzamientos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Upcoming Releases */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Próximos lanzamientos</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar contenido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
            <CardDescription>Contenido programado para publicación automática</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReleases.map((release) => (
                <div key={release.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{release.title}</h3>
                      <Badge variant="outline">{release.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{release.artist}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(release.scheduledDate, "PPp", { locale: es })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4" />
                        <span>{release.regions.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      {release.timeUntilRelease}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRelease(release)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleCancelRelease(release)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Zone Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de zona horaria</CardTitle>
          <CardDescription>Configura las zonas horarias para la publicación automática por región</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { region: "Estados Unidos", timezone: "EST (UTC-5)", time: "12:00 AM" },
              { region: "Europa", timezone: "CET (UTC+1)", time: "12:00 AM" },
              { region: "Asia", timezone: "JST (UTC+9)", time: "12:00 AM" },
              { region: "América Latina", timezone: "ART (UTC-3)", time: "12:00 AM" },
            ].map((tz) => (
              <div key={tz.region} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{tz.region}</h4>
                <p className="text-sm text-muted-foreground mb-1">{tz.timezone}</p>
                <p className="text-sm">Hora de publicación: {tz.time}</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => handleConfigureTimezone(tz.region)}>
                  Configurar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Programación</DialogTitle>
            <DialogDescription>Actualiza la información de la programación del contenido.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  placeholder="Título del contenido"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-artist">Artista</Label>
                <Input
                  id="edit-artist"
                  placeholder="Nombre del artista"
                  value={scheduleForm.artist}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, artist: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Tipo de contenido</Label>
              <Select
                value={scheduleForm.type}
                onValueChange={(value) => setScheduleForm({ ...scheduleForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Canción">Canción</SelectItem>
                  <SelectItem value="Colección">Colección</SelectItem>
                  <SelectItem value="EP">EP</SelectItem>
                  <SelectItem value="Álbum">Álbum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-scheduledDate">Fecha de publicación</Label>
                <Input
                  id="edit-scheduledDate"
                  type="date"
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-scheduledTime">Hora de publicación</Label>
                <Input
                  id="edit-scheduledTime"
                  type="time"
                  value={scheduleForm.scheduledTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Regiones</Label>
              <div className="flex flex-wrap gap-2">
                {["Global", "US", "EU", "LATAM", "APAC"].map((region) => (
                  <Button
                    key={region}
                    variant={scheduleForm.regions.includes(region) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newRegions = scheduleForm.regions.includes(region)
                        ? scheduleForm.regions.filter((r) => r !== region)
                        : [...scheduleForm.regions, region]
                      setScheduleForm({ ...scheduleForm, regions: newRegions })
                    }}
                  >
                    {region}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateRelease}>Actualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar programación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cancelará la programación de "{selectedRelease?.title}" por {selectedRelease?.artist}. El
              contenido no se publicará automáticamente en la fecha programada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
