"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Check } from "lucide-react"

interface IssueReportFormProps {
  propertyId: string
  propertyTitle: string
  onSubmitSuccess: () => void
}

export function IssueReportForm({ propertyId, propertyTitle, onSubmitSuccess }: IssueReportFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after success
      setTimeout(() => {
        onSubmitSuccess()
      }, 1500)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="rounded-full bg-green-100 p-3">
          <Check className="h-6 w-6 text-green-500" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Issue Reported Successfully</h3>
        <p className="mt-2 text-gray-500">
          Your issue has been reported to the property owner. You'll be notified when they respond.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg bg-orange-50 p-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <p className="font-medium">Reporting issue for: {propertyTitle}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="issue-title">Issue Title</Label>
        <Input
          id="issue-title"
          placeholder="Brief description of the issue"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="issue-description">Detailed Description</Label>
        <Textarea
          id="issue-description"
          placeholder="Provide details about the issue, including when it started and any relevant information"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="issue-priority">Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger id="issue-priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - Not urgent, can be fixed when convenient</SelectItem>
            <SelectItem value="medium">Medium - Needs attention within a few days</SelectItem>
            <SelectItem value="high">High - Urgent issue requiring immediate attention</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="issue-photos">Photos (Optional)</Label>
        <Input id="issue-photos" type="file" multiple accept="image/*" />
        <p className="text-xs text-gray-500">
          Upload photos of the issue to help the owner understand the problem better.
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSubmitSuccess}>
          Cancel
        </Button>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </form>
  )
}

