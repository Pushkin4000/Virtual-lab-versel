"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

export default function ComparisonTable() {
  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Metric</TableHead>
              <TableHead>Non-Optimized</TableHead>
              <TableHead>Optimized</TableHead>
              <TableHead className="text-right">Improvement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  Latency
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-slate-400 cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Time to process a single inference request</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
              <TableCell>200ms</TableCell>
              <TableCell>80ms</TableCell>
              <TableCell className="text-right text-green-600 font-medium">60% faster</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  Throughput
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-slate-400 cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of requests processed per second</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
              <TableCell>5 req/s</TableCell>
              <TableCell>25 req/s</TableCell>
              <TableCell className="text-right text-green-600 font-medium">5x higher</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  GPU Usage
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-slate-400 cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Percentage of GPU compute resources utilized</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
              <TableCell>30%</TableCell>
              <TableCell>85%</TableCell>
              <TableCell className="text-right text-green-600 font-medium">2.8x better</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  Power Consumption
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-slate-400 cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Power used during inference</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
              <TableCell>120W</TableCell>
              <TableCell>70W</TableCell>
              <TableCell className="text-right text-green-600 font-medium">42% less</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  Accuracy
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-slate-400 cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Model prediction accuracy</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
              <TableCell>94%</TableCell>
              <TableCell>92%</TableCell>
              <TableCell className="text-right text-amber-600 font-medium">2% lower</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  Model Size
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-slate-400 cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Size of the model on disk</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
              <TableCell>350MB</TableCell>
              <TableCell>120MB</TableCell>
              <TableCell className="text-right text-green-600 font-medium">66% smaller</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

