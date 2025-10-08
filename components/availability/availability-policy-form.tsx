"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Globe, Clock } from "lucide-react"

const regions = [
  { id: "global", name: "Global", description: "Todas las regiones" },
  { id: "us", name: "Estados Unidos", description: "Mercado estadounidense" },
  { id: "eu", name: "Europa", description: "Unión Europea" },
  { id: "asia", name: "Asia", description: "Mercados asiáticos" },
  { id: "latam", name: "América Latina", description: "Mercados latinoamericanos" },
]

interface AvailabilityPolicyFormProps {
  contentTitle?: string
  onSave?: (policy: any) => void
  onCancel?: () => void
}

export function AvailabilityPolicyForm({
  contentTitle = "Contenido seleccionado",
  onSave,
  onCancel,
}: AvailabilityPolicyFormProps) {
  const [policyType, setPolicyType] = useState<"allow" | "deny">("allow")
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["global"])
  const [hasSchedule, setHasSchedule] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startTime, setStartTime] = useState("00:00")
  const [endTime, setEndTime] = useState("23:59")

  const handleRegionChange = (regionId: string, checked: boolean) => {
    if (regionId === "global") {
      setSelectedRegions(checked ? ["global"] : [])
    } else {
      const newRegions = checked
        ? [...selectedRegions.filter((r) => r !== "global"), regionId]
        : selectedRegions.filter((r) => r !== regionId)
      setSelectedRegions(newRegions)
    }
  }

  const handleSave = () => {
    const policy = {
      type: policyType,
      regions: selectedRegions,
      schedule: hasSchedule
        ? {
            startDate,
            endDate,
            startTime,
            endTime,
          }
        : null,
    }
    onSave?.(policy)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Configuración territorial</span>
          </CardTitle>
          <CardDescription>Define en qué regiones estará disponible "{contentTitle}"</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Policy Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tipo de política</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="allow"
                  name="policyType"
                  value="allow"
                  checked={policyType === "allow"}
                  onChange={(e) => setPolicyType(e.target.value as "allow")}
                  className="h-4 w-4"
                />
                <Label htmlFor="allow">Permitir en regiones seleccionadas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="deny"
                  name="policyType"
                  value="deny"
                  checked={policyType === "deny"}
                  onChange={(e) => setPolicyType(e.target.value as "deny")}
                  className="h-4 w-4"
                />
                <Label htmlFor="deny">Bloquear en regiones seleccionadas</Label>
              </div>
            </div>
          </div>

          {/* Region Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Regiones</Label>
            <div className="space-y-3">
              {regions.map((region) => (
                <div key={region.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={region.id}
                    checked={selectedRegions.includes(region.id)}
                    onCheckedChange={(checked) => handleRegionChange(region.id, checked as boolean)}
                    disabled={region.id === "global" && selectedRegions.length > 1}
                  />
                  <div className="flex-1">
                    <Label htmlFor={region.id} className="font-medium">
                      {region.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{region.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Ventana de tiempo</span>
          </CardTitle>
          <CardDescription>Configura cuándo estará disponible el contenido (opcional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasSchedule"
              checked={hasSchedule}
              onCheckedChange={(checked) => setHasSchedule(checked as boolean)}
            />
            <Label htmlFor="hasSchedule">Configurar ventana de tiempo</Label>
          </div>

          {hasSchedule && (
            <div className="space-y-4 pl-6 border-l-2 border-muted">
              {/* Date Range */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Fecha de inicio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={es} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Fecha de fin (opcional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: es }) : "Sin fecha de fin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={es} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Time Range */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora de inicio</Label>
                  <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora de fin</Label>
                  <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>Guardar política</Button>
      </div>
    </div>
  )
}
