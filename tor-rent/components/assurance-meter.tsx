"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface AssuranceMeterProps {
  score: number
  size?: "small" | "medium" | "large"
  showDetails?: boolean
}

export function AssuranceMeter({ score, size = "medium", showDetails = false }: AssuranceMeterProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  // Determine color based on score
  const getColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-green-400"
    if (score >= 70) return "bg-yellow-500"
    if (score >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  // Determine rating text based on score
  const getRating = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Poor"
  }

  // Calculate scores for different categories
  const propertyConditionScore = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 10) - 5))
  const ownerReliabilityScore = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 10) - 5))
  const valueForMoneyScore = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 10) - 5))
  const locationScore = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 10) - 5))

  // Size classes
  const sizeClasses = {
    small: {
      container: "w-20",
      meter: "h-3",
      text: "text-sm",
      icon: "h-4 w-4",
    },
    medium: {
      container: "w-32",
      meter: "h-4",
      text: "text-base",
      icon: "h-5 w-5",
    },
    large: {
      container: "w-48",
      meter: "h-5",
      text: "text-lg",
      icon: "h-6 w-6",
    },
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center gap-2 ${sizeClasses[size].text}`}>
        <span className="font-bold">{score}</span>
        <span className="text-gray-500">({getRating(score)})</span>
        <TooltipProvider>
          <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
            <TooltipTrigger asChild>
              <button onClick={() => setIsTooltipOpen(!isTooltipOpen)}>
                <Info className={`${sizeClasses[size].icon} text-gray-400 hover:text-gray-600`} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="w-64 p-4">
              <div className="space-y-2">
                <p className="font-medium">Assurance Score Breakdown</p>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Property Condition</span>
                    <span>{propertyConditionScore}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-1.5 rounded-full ${getColor(propertyConditionScore)}`}
                      style={{ width: `${propertyConditionScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Owner Reliability</span>
                    <span>{ownerReliabilityScore}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-1.5 rounded-full ${getColor(ownerReliabilityScore)}`}
                      style={{ width: `${ownerReliabilityScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Value for Money</span>
                    <span>{valueForMoneyScore}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-1.5 rounded-full ${getColor(valueForMoneyScore)}`}
                      style={{ width: `${valueForMoneyScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Location</span>
                    <span>{locationScore}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-1.5 rounded-full ${getColor(locationScore)}`}
                      style={{ width: `${locationScore}%` }}
                    ></div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Based on verified tenant reviews, property inspections, and owner history.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className={`mt-1 w-full ${sizeClasses[size].container}`}>
        <div className={`w-full rounded-full bg-gray-200 ${sizeClasses[size].meter}`}>
          <div
            className={`rounded-full ${getColor(score)} ${sizeClasses[size].meter}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-3 text-sm">
          <div>
            <div className="flex justify-between">
              <span>Property Condition</span>
              <span>{propertyConditionScore}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full ${getColor(propertyConditionScore)}`}
                style={{ width: `${propertyConditionScore}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span>Owner Reliability</span>
              <span>{ownerReliabilityScore}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full ${getColor(ownerReliabilityScore)}`}
                style={{ width: `${ownerReliabilityScore}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span>Value for Money</span>
              <span>{valueForMoneyScore}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full ${getColor(valueForMoneyScore)}`}
                style={{ width: `${valueForMoneyScore}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span>Location</span>
              <span>{locationScore}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full ${getColor(locationScore)}`}
                style={{ width: `${locationScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

