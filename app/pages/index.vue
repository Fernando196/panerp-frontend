<script setup lang="ts">
  import { Bar, Line as LineChart } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Filler,
    Tooltip,
    Legend,
  } from 'chart.js'
  import {
    DollarSign,
    Truck,
    Factory,
    AlertTriangle,
    Clock,
    MapPin,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    Circle,
    Loader,
    ArrowRight,
  } from 'lucide-vue-next'
  import { useAuthStore } from '~/store/auth.store'

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Filler,
    Tooltip,
    Legend
  )

  const auth = useAuthStore()

  // ── Greeting ─────────────────────────────────────────────
  const greeting = computed(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 19) return 'Buenas tardes'
    return 'Buenas noches'
  })

  const dateStr = computed(() => {
    const d = new Date()
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ]
    return `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]}`
  })

  // ── KPIs ─────────────────────────────────────────────────
  const kpis = [
    {
      label: 'Ventas del día',
      value: '$4,320',
      sub: '+12% vs ayer',
      trend: 'up',
      icon: DollarSign,
      color: 'success',
    },
    {
      label: 'Entregas hoy',
      value: '8 / 12',
      sub: '4 pendientes de salir',
      trend: 'neutral',
      icon: Truck,
      color: 'info',
    },
    {
      label: 'Producción',
      value: '240 pzas',
      sub: '3 órdenes activas',
      trend: 'up',
      icon: Factory,
      color: 'primary',
    },
    {
      label: 'Stock bajo',
      value: '3 items',
      sub: 'Requieren reposición',
      trend: 'down',
      icon: AlertTriangle,
      color: 'warning',
    },
  ]

  const kpiStyles: Record<string, { bg: string; icon: string; ring: string }> = {
    success: { bg: 'bg-success/10', icon: 'text-success', ring: 'ring-1 ring-success/20' },
    info: { bg: 'bg-info/10', icon: 'text-info', ring: 'ring-1 ring-info/20' },
    primary: { bg: 'bg-primary/10', icon: 'text-primary', ring: 'ring-1 ring-primary/20' },
    warning: { bg: 'bg-warning/10', icon: 'text-warning', ring: 'ring-1 ring-warning/20' },
  }

  // ── Production orders (mock) ──────────────────────────────
  const ordersToday = [
    {
      id: '1',
      receta: 'Pan dulce surtido',
      cantidad: 120,
      producido: 120,
      estado: 'completada',
      hora: '04:00',
    },
    {
      id: '2',
      receta: 'Bolillo',
      cantidad: 200,
      producido: 145,
      estado: 'en_proceso',
      hora: '05:30',
    },
    {
      id: '3',
      receta: 'Croissant',
      cantidad: 60,
      producido: 0,
      estado: 'programada',
      hora: '07:00',
    },
    {
      id: '4',
      receta: 'Pan integral',
      cantidad: 80,
      producido: 0,
      estado: 'programada',
      hora: '08:30',
    },
  ]

  const estadoStyle: Record<string, string> = {
    completada: 'bg-success/10 text-success border-success/20',
    en_proceso: 'bg-info/10 text-info border-info/20',
    programada: 'bg-slate-700/50 text-slate-400 border-slate-700',
    cancelada: 'bg-error/10 text-error border-error/20',
  }

  const estadoLabel: Record<string, string> = {
    completada: 'Completada',
    en_proceso: 'En proceso',
    programada: 'Programada',
    cancelada: 'Cancelada',
  }

  // ── Pending collections (mock) ────────────────────────────
  const pendienteRecoleccion = [
    { id: '1', cliente: 'Tienda La Esperanza', zona: 'Col. Centro', charolas: 3, hora: '18:00' },
    { id: '2', cliente: 'Cafetería Central', zona: 'Col. Roma', charolas: 2, hora: '17:30' },
    { id: '3', cliente: 'Mercado Juárez #45', zona: 'Col. Juárez', charolas: 4, hora: '19:00' },
    {
      id: '4',
      cliente: 'Mini súper El Buen Precio',
      zona: 'Col. Moderna',
      charolas: 2,
      hora: '18:30',
    },
  ]

  // ── Low stock (mock) ──────────────────────────────────────
  const stockBajo = [
    { nombre: 'Harina de trigo', stock: 15, minimo: 50, unidad: 'kg', nivel: 'critico' },
    { nombre: 'Mantequilla sin sal', stock: 3.5, minimo: 10, unidad: 'kg', nivel: 'critico' },
    { nombre: 'Azúcar glass', stock: 2, minimo: 5, unidad: 'kg', nivel: 'bajo' },
  ]

  // ── Charts ────────────────────────────────────────────────
  const chartLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy']

  const barData = computed(() => ({
    labels: chartLabels,
    datasets: [
      {
        label: 'Producción',
        data: [420, 380, 460, 340, 380, 280, 240],
        backgroundColor: '#007b6c',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Vendido',
        data: [410, 360, 440, 330, 365, 270, 215],
        backgroundColor: '#7c3aed',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }))

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#64748b',
          font: { size: 11, family: 'Geist, sans-serif' },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        padding: 10,
        callbacks: {
          label: (ctx: { dataset: { label: string }; parsed: { y: number } }) =>
            ` ${ctx.dataset.label}: ${ctx.parsed.y} pzas`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#475569', font: { size: 11 } },
      },
      y: {
        grid: { color: '#1e293b' },
        border: { display: false },
        ticks: { color: '#475569', font: { size: 11 }, stepSize: 100 },
      },
    },
  }

  const lineData = computed(() => ({
    labels: chartLabels,
    datasets: [
      {
        label: 'Ingresos MXN',
        data: [3200, 2850, 3700, 2600, 3100, 2200, 1800],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249,115,22,0.08)',
        borderWidth: 2,
        pointBackgroundColor: '#f97316',
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
        fill: true,
      },
    ],
  }))

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        padding: 10,
        callbacks: {
          label: (ctx: { parsed: { y: number } }) =>
            ` $${ctx.parsed.y.toLocaleString('es-MX')} MXN`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#475569', font: { size: 11 } },
      },
      y: {
        grid: { color: '#1e293b' },
        border: { display: false },
        ticks: {
          color: '#475569',
          font: { size: 11 },
          callback: (v: string | number) => `$${(Number(v) / 1000).toFixed(0)}k`,
        },
      },
    },
  }
</script>

<template>
  <div class="w-full space-y-5 p-5 pb-10 md:p-7">
    <!-- Page header -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-white">
          {{ greeting }}, {{ auth.user?.nombre?.split(' ')[0] ?? 'bienvenido' }}
        </h1>
        <p class="mt-0.5 text-[13px] text-slate-500 capitalize">{{ dateStr }}</p>
      </div>
      <NuxtLink
        to="/produccion"
        class="btn btn-primary btn-sm hidden shrink-0 items-center gap-1.5 md:inline-flex"
      >
        <Factory :size="13" />
        Nueva orden
      </NuxtLink>
    </div>

    <!-- KPI cards -->
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div
        v-for="kpi in kpis"
        :key="kpi.label"
        class="rounded-xl border border-slate-800 bg-slate-900 p-4"
      >
        <div class="mb-3 flex items-center justify-between">
          <p class="text-[11.5px] font-medium tracking-wider text-slate-500 uppercase">
            {{ kpi.label }}
          </p>
          <div
            :class="[kpiStyles[kpi.color].bg, kpiStyles[kpi.color].ring]"
            class="flex h-7 w-7 items-center justify-center rounded-lg"
          >
            <component :is="kpi.icon" :size="14" :class="kpiStyles[kpi.color].icon" />
          </div>
        </div>
        <p class="text-2xl font-bold text-white">{{ kpi.value }}</p>
        <div class="mt-1.5 flex items-center gap-1">
          <TrendingUp v-if="kpi.trend === 'up'" :size="11" class="text-success" />
          <TrendingDown v-else-if="kpi.trend === 'down'" :size="11" class="text-warning" />
          <p class="text-[12px]" :class="kpi.trend === 'down' ? 'text-warning' : 'text-slate-500'">
            {{ kpi.sub }}
          </p>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <!-- Bar chart -->
      <div class="rounded-xl border border-slate-800 bg-slate-900 p-5 lg:col-span-3">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-[13.5px] font-semibold text-white">Producción vs ventas</p>
          <span class="text-[11.5px] text-slate-500">Últimos 7 días</span>
        </div>
        <ClientOnly>
          <div class="h-44">
            <Bar :data="barData" :options="barOptions as any" />
          </div>
          <template #fallback>
            <div class="h-44 animate-pulse rounded-lg bg-slate-800" />
          </template>
        </ClientOnly>
      </div>

      <!-- Line chart -->
      <div class="rounded-xl border border-slate-800 bg-slate-900 p-5 lg:col-span-2">
        <div class="mb-1 flex items-center justify-between">
          <p class="text-[13.5px] font-semibold text-white">Ingresos</p>
          <span class="text-[11.5px] text-slate-500">Esta semana</span>
        </div>
        <p class="mb-3 text-xl font-bold text-white">
          $19,650
          <span class="text-success text-[12px] font-normal"> +8.4%</span>
        </p>
        <ClientOnly>
          <div class="h-28">
            <LineChart :data="lineData" :options="lineOptions as any" />
          </div>
          <template #fallback>
            <div class="h-28 animate-pulse rounded-lg bg-slate-800" />
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- Lists -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Production orders today -->
      <div class="rounded-xl border border-slate-800 bg-slate-900">
        <div class="flex items-center justify-between border-b border-slate-800 px-4 py-3.5">
          <p class="text-[13.5px] font-semibold text-white">Producción de hoy</p>
          <NuxtLink
            to="/produccion"
            class="text-primary hover:text-primary-dark flex items-center gap-1 text-[12px] transition-colors"
          >
            Ver todo <ArrowRight :size="11" />
          </NuxtLink>
        </div>
        <ul class="divide-y divide-slate-800/60">
          <li
            v-for="order in ordersToday"
            :key="order.id"
            class="flex items-center gap-3 px-4 py-3"
          >
            <div class="shrink-0">
              <CheckCircle2 v-if="order.estado === 'completada'" :size="16" class="text-success" />
              <Loader
                v-else-if="order.estado === 'en_proceso'"
                :size="16"
                class="text-info animate-spin"
              />
              <Circle v-else :size="16" class="text-slate-700" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[13px] font-medium text-white">{{ order.receta }}</p>
              <p class="text-[12px] text-slate-500">
                <template v-if="order.estado === 'en_proceso'">
                  {{ order.producido }} / {{ order.cantidad }} pzas
                </template>
                <template v-else>{{ order.cantidad }} pzas</template>
              </p>
            </div>
            <div class="flex shrink-0 flex-col items-end gap-1">
              <span
                class="rounded-full border px-2 py-0.5 text-[11px] font-medium"
                :class="estadoStyle[order.estado]"
              >
                {{ estadoLabel[order.estado] }}
              </span>
              <span class="flex items-center gap-1 text-[11px] text-slate-600">
                <Clock :size="10" />
                {{ order.hora }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Pending collections -->
      <div class="rounded-xl border border-slate-800 bg-slate-900">
        <div class="flex items-center justify-between border-b border-slate-800 px-4 py-3.5">
          <p class="text-[13.5px] font-semibold text-white">Pendientes de recolección</p>
          <NuxtLink
            to="/entregas"
            class="text-primary hover:text-primary-dark flex items-center gap-1 text-[12px] transition-colors"
          >
            Ver todo <ArrowRight :size="11" />
          </NuxtLink>
        </div>
        <ul class="divide-y divide-slate-800/60">
          <li
            v-for="item in pendienteRecoleccion"
            :key="item.id"
            class="flex items-center gap-3 px-4 py-3"
          >
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400"
            >
              <Truck :size="14" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[13px] font-medium text-white">{{ item.cliente }}</p>
              <div class="flex items-center gap-2 text-[12px] text-slate-500">
                <span class="flex items-center gap-0.5">
                  <MapPin :size="10" />
                  {{ item.zona }}
                </span>
                <span>·</span>
                <span>{{ item.charolas }} charolas</span>
              </div>
            </div>
            <span class="flex shrink-0 items-center gap-1 text-[12px] text-slate-500">
              <Clock :size="11" />
              {{ item.hora }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Low stock alerts -->
    <div class="border-warning/20 bg-warning/5 rounded-xl border">
      <div class="border-warning/20 flex items-center gap-2 border-b px-4 py-3.5">
        <AlertTriangle :size="14" class="text-warning" />
        <p class="text-[13.5px] font-semibold text-white">Alertas de stock bajo</p>
        <NuxtLink
          to="/inventario"
          class="text-primary hover:text-primary-dark ml-auto flex items-center gap-1 text-[12px] transition-colors"
        >
          Gestionar <ArrowRight :size="11" />
        </NuxtLink>
      </div>
      <div
        class="divide-warning/10 grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        <div v-for="item in stockBajo" :key="item.nombre" class="flex items-center gap-3 px-4 py-3">
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            :class="item.nivel === 'critico' ? 'bg-error/10' : 'bg-warning/10'"
          >
            <AlertTriangle
              :size="14"
              :class="item.nivel === 'critico' ? 'text-error' : 'text-warning'"
            />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-[13px] font-medium text-white">{{ item.nombre }}</p>
            <p class="text-[12px] text-slate-500">
              {{ item.stock }} {{ item.unidad }} · mín. {{ item.minimo }} {{ item.unidad }}
            </p>
          </div>
          <span
            class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
            :class="
              item.nivel === 'critico' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
            "
          >
            {{ item.nivel === 'critico' ? 'Crítico' : 'Bajo' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
