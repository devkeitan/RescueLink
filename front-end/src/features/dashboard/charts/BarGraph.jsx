"use client"

import React, { useContext } from "react"
import { StatsContext } from "@/context/StatsContext"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const BarGraph = () => {
  const { stats, loading } = useContext(StatsContext)

  const chartConfig = {
    alerts: {
      label: "Alerts",
      color: "#9333ea",
    },
    crashes: {
      label: "Crashes",
      color: "#dc2626",
    },
  }

  if (loading) return <div>Loading...</div>
  if (!stats) return <div>No data</div>

  return (
    <Card>
        <CardHeader>
        <CardTitle>Bar Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
    <CardContent>
    <ChartContainer config={chartConfig} classN="min-h-[200px] w-full max-w-2xl">
      <BarChart data={stats}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />

        <Bar dataKey="alerts" fill="var(--color-alerts)" radius={4} />
        <Bar dataKey="crashes" fill="var(--color-crashes)" radius={4} />
      </BarChart>
    </ChartContainer>
    </CardContent>
    </Card>
  )
}

export default BarGraph