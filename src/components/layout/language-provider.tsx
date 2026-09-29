"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "es";

const messages = {
  en: {
    overview: "Overview", system: "System", docker: "Docker", services: "Services", network: "Network", settings: "Settings",
    workspace: "Workspace", openNavigation: "Open navigation", collapseSidebar: "Collapse sidebar", expandSidebar: "Expand sidebar",
    yourLab: "Your lab. One workspace.", monitorCopy: "Monitor your infrastructure with a little more clarity.", viewConfiguration: "View configuration →", footer: "Built for the infrastructure you call home.",
    refreshData: "Refresh data", refreshing: "Refreshing…", infrastructure: "Infrastructure", overviewTitle: "Your lab, at a glance.", overviewDescription: "A clear picture of your home infrastructure.",
    systemDescription: "The essentials behind your primary host.", dockerDescription: "Keep an eye on your container workloads.", servicesDescription: "Your applications, all in one place.", networkDescription: "Service endpoints and network visibility.",
    updateFailed: "Update failed. Displaying the last loaded snapshot.", loadFailed: "Could not load the dashboard. Use Refresh data to try again.", loading: "Loading dashboard…",
    cpuUsage: "CPU usage", cores: "cores", of: "of", loadAverage: "load average", memory: "Memory", allocated: "allocated", storage: "Storage", used: "used", cpuTemperature: "CPU temperature", sensorReading: "Reported sensor reading",
    dataSourceSettings: "Data source settings", eachPanel: "Each panel identifies its data source.", snapshotLoaded: "Snapshot loaded", primaryHost: "Primary host", uptime: "Uptime", online: "Online", offline: "Offline",
    containers: "Containers", resourceUsage: "Resource usage by container", searchContainers: "Search containers…", filterStatus: "Filter container status", allStatuses: "All statuses", running: "Running", stopped: "Stopped", noContainers: "No containers match your filters.", readOnly: "Read-only monitoring · Container actions are not enabled", status: "Status", container: "Container",
    resourceHistory: "Resource history", cpuMemory: "CPU & memory utilization", hours24: "24 hours", chartMetric: "Chart metric", bothMetrics: "Both metrics", cpuOnly: "CPU only", memoryOnly: "Memory only", noHistory: "No history available.",
    available: "available", noServices: "No services to display.", noPort: "No port reported", fallback: "Fallback", live: "Live", mockData: "Mock Data", fallbackTitle: "Remote data unavailable. Displaying demonstration data.",
    totalContainers: "Total containers", availabilityTitle: "Availability, without the guesswork.", availabilityCopy: "Statuses reflect the latest provider snapshot. Mock and fallback data are demonstrations of service availability, not live connectivity checks.",
    endpointDirectory: "Endpoint directory", portsReported: "Ports reported by the services provider", port: "port", trafficUnavailable: "Traffic metrics are not available yet", trafficCopy: "Bandwidth, interfaces and latency will be available when the monitoring agent supports network telemetry. No network scans are performed.",
    settingsTitle: "Workspace settings", settingsDescription: "Understand how your dashboard gets its data.", dataSource: "Data source", selectedProvider: "Selected provider", remoteConfigured: "Remote agent configured", requestTimeout: "Request timeout", connectionStatus: "Connection status", snapshotUtc: "Snapshot loaded (UTC)", readOnlyConfig: "Configuration is read-only. Changes are managed through environment variables.", privateTitle: "Private by design", privateCopy: "Agent credentials and connection addresses stay on the server. This screen only shows safe configuration details.", workspaceTitle: "A workspace for your lab", workspaceCopy: "Dark appearance · Read-only monitoring", mockCopy: "Mock data is available without a server.", backOverview: "Back to overview", fallbackCopy: "The remote agent is unavailable. Demonstration data is displayed until connectivity is restored.", yes: "Yes", no: "No", connected: "Connected", demoMode: "Demo mode · no connection required", unavailable: "Unavailable · fallback active",
  },
  es: {
    overview: "Resumen", system: "Sistema", docker: "Docker", services: "Servicios", network: "Red", settings: "Ajustes",
    workspace: "Espacio de trabajo", openNavigation: "Abrir navegación", collapseSidebar: "Contraer barra lateral", expandSidebar: "Expandir barra lateral",
    yourLab: "Tu laboratorio. Un solo espacio.", monitorCopy: "Monitoreá tu infraestructura con mayor claridad.", viewConfiguration: "Ver configuración →", footer: "Hecho para la infraestructura de tu hogar.",
    refreshData: "Actualizar datos", refreshing: "Actualizando…", infrastructure: "Infraestructura", overviewTitle: "Tu laboratorio, de un vistazo.", overviewDescription: "Una vista clara de tu infraestructura doméstica.",
    systemDescription: "Lo esencial de tu servidor principal.", dockerDescription: "Seguimiento de tus cargas en contenedores.", servicesDescription: "Tus aplicaciones, en un solo lugar.", networkDescription: "Endpoints de servicios y visibilidad de red.",
    updateFailed: "La actualización falló. Se muestra la última información cargada.", loadFailed: "No se pudo cargar el dashboard. Usá Actualizar datos para reintentar.", loading: "Cargando dashboard…",
    cpuUsage: "Uso de CPU", cores: "núcleos", of: "de", loadAverage: "carga promedio", memory: "Memoria", allocated: "asignada", storage: "Almacenamiento", used: "usado", cpuTemperature: "Temperatura de CPU", sensorReading: "Lectura del sensor",
    dataSourceSettings: "Ajustes de origen de datos", eachPanel: "Cada panel identifica su origen de datos.", snapshotLoaded: "Instantánea cargada", primaryHost: "Servidor principal", uptime: "Tiempo activo", online: "En línea", offline: "Sin conexión",
    containers: "Contenedores", resourceUsage: "Uso de recursos por contenedor", searchContainers: "Buscar contenedores…", filterStatus: "Filtrar estado", allStatuses: "Todos los estados", running: "En ejecución", stopped: "Detenido", noContainers: "No hay contenedores que coincidan con los filtros.", readOnly: "Monitoreo de solo lectura · Las acciones no están habilitadas", status: "Estado", container: "Contenedor",
    resourceHistory: "Historial de recursos", cpuMemory: "Uso de CPU y memoria", hours24: "Últimas 24 horas", chartMetric: "Métrica del gráfico", bothMetrics: "Ambas métricas", cpuOnly: "Solo CPU", memoryOnly: "Solo memoria", noHistory: "No hay historial disponible.",
    available: "disponibles", noServices: "No hay servicios para mostrar.", noPort: "Sin puerto informado", fallback: "Respaldo", live: "En vivo", mockData: "Datos simulados", fallbackTitle: "Los datos remotos no están disponibles. Se muestran datos de demostración.",
    totalContainers: "Total de contenedores", availabilityTitle: "Disponibilidad sin adivinar.", availabilityCopy: "Los estados reflejan la última instantánea del proveedor. Los datos simulados y de respaldo no son verificaciones de conectividad en vivo.",
    endpointDirectory: "Directorio de endpoints", portsReported: "Puertos informados por el proveedor de servicios", port: "puerto", trafficUnavailable: "Las métricas de tráfico aún no están disponibles", trafficCopy: "El ancho de banda, interfaces y latencia estarán disponibles cuando el agente incluya telemetría de red. No se realizan escaneos de red.",
    settingsTitle: "Ajustes del espacio", settingsDescription: "Entendé cómo obtiene sus datos el dashboard.", dataSource: "Origen de datos", selectedProvider: "Proveedor seleccionado", remoteConfigured: "Agente remoto configurado", requestTimeout: "Tiempo de espera", connectionStatus: "Estado de conexión", snapshotUtc: "Instantánea cargada (UTC)", readOnlyConfig: "La configuración es de solo lectura. Los cambios se gestionan mediante variables de entorno.", privateTitle: "Privado por diseño", privateCopy: "Las credenciales y direcciones del agente permanecen en el servidor. Esta pantalla solo muestra información segura.", workspaceTitle: "Un espacio para tu laboratorio", workspaceCopy: "Apariencia oscura · Monitoreo de solo lectura", mockCopy: "Los datos simulados funcionan sin un servidor.", backOverview: "Volver al resumen", fallbackCopy: "El agente remoto no está disponible. Se muestran datos de demostración hasta recuperar la conectividad.", yes: "Sí", no: "No", connected: "Conectado", demoMode: "Modo demostración · no requiere conexión", unavailable: "No disponible · respaldo activo",
  },
} as const;

type TranslationKey = keyof typeof messages.en;
type I18nContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey) => string };

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    const stored = window.localStorage.getItem("homelab-language");
    if (stored !== "en" && stored !== "es") return;
    const frame = window.requestAnimationFrame(() => setLanguage(stored));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const value = useMemo(() => ({ language, setLanguage: (next: Language) => { window.localStorage.setItem("homelab-language", next); setLanguage(next); }, t: (key: TranslationKey) => messages[language][key] }), [language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside LanguageProvider");
  return context;
}
